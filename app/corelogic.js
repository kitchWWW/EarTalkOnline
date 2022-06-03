function masterIntervalStepper() {
  time = Math.floor(Date.now())- TIME_OFFSET; // go back in time :)
  time = time % TOTAL_LENGTH_OF_COMPOSITION; // keep it within 0 -> total length
  ANIMATION_TIME_CURRENT = time;
  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    scoreSampleInstruction = scoreAllSoundInstructions[fileName];
    if (!(fileName in allSoundFiles)) {
      loadFile(fileName);
    }
    if (scoreSampleInstruction.startTime > time - GLOBAL_TIMESTEP && scoreSampleInstruction.startTime < time) {
      //tell the thing to start playing
      allSoundFiles[fileName].file.play();
    }
    doParamsUpdate(fileName);
  });
  // also do a render update
}

function masterScoreRefresh() {
  updateSessionID();
  fetch(URL_PREFIX + "score.json?id=" + SESSION_ID+"&timeOffset="+TIME_OFFSET)
    .then(blob => blob.json())
    .then(data => {
      var old_scoreAllSoundInstructions = scoreAllSoundInstructions
      scoreAllSoundInstructions = data;
      if (!isEquivalent(scoreAllSoundInstructions, old_scoreAllSoundInstructions)) {
        console.log("shit aint the same, need an update!");
      }
      doAnimationScoreUpdate();
    })
    .catch(e => {
      console.log(e);
      return e;
    });

  fetch(URL_PREFIX + "server.log?id=" + SESSION_ID)
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      oldDisplayData = displayData;
      var regex = /\*\*\*/gi;
      var displayData = data.replace(regex, "<br />***");
      document.getElementById("history_log").innerHTML = "" + displayData;
      if (IS_FIRST_TIME_LOADING_CHAT) {
        var objDiv = document.getElementById("history_log");
        objDiv.scrollTop = objDiv.scrollHeight;
        IS_FIRST_TIME_LOADING_CHAT = false;
      }
    });

  fetch(URL_PREFIX + "chat.log?id=" + SESSION_ID)
    .then(function(response) {
      return response.text();
    }).then(function(data) {
      oldDisplayData = displayData;
      var regex = /\*\*\*/gi;
      var displayData = data.replace(regex, "<br />***");
      document.getElementById("chat_log").innerHTML = "" + displayData;
      var objDiv = document.getElementById("chat_log");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
}

var serverUpdateTimeout = null;

function updateServerScore(sample_id, params_for_edit) {
  updateSessionID();
  CAN_DO_UPDATE = false;
  postData('/updateScore?id=' + SESSION_ID, {
      sample_id: sample_id,
      params_for_edit: params_for_edit,
    })
    .then((data) => {
      CAN_DO_UPDATE = true;
    });
}

function doParamsUpdate(fileName) {
  if (VIEWER_MODE != 'streamview') {
    allSoundFiles[fileName].file.volume = scoreAllSoundInstructions[fileName].volume;
  } else {
    allSoundFiles[fileName].file.volume = 0;
  }
  allSoundFiles[fileName].pan.pan = (scoreAllSoundInstructions[fileName].pan * 2.0) - 1;
  allSoundFiles[fileName].distort.gain = scoreAllSoundInstructions[fileName].distort;
  allSoundFiles[fileName].lowpass.frequency = (Math.log((scoreAllSoundInstructions[fileName].lowpass + 1)) / (Math.log(10))) * 20000.0;
}

function doMute() {
  if (IS_IN_MUTE) {
    MASTER_GROUP.volume = 1;
    IS_IN_MUTE = false
    document.getElementById("myMuteButton").innerHTML = "mute";
  } else {
    MASTER_GROUP.volume = 0;
    IS_IN_MUTE = true
    document.getElementById("myMuteButton").innerHTML = "unmute";
  }
}

async function startRecording() {
  recorder = await recordAudio();
  recorder.start();
  document.getElementById("startRecordButton").style.display = "none";
  document.getElementById("stopRecordButton").style.display = "block";
  MASTER_GROUP.volume = 0;

}

async function stopRecording() {
  document.getElementById("startRecordButton").style.display = "block";
  document.getElementById("stopRecordButton").style.display = "none";
  await recorder.stop();
  MASTER_GROUP.volume = 1;

}

function paramChange(new_param) {
  MY_PARAM_TO_CONTROL = new_param;
  var paramToDisplay = {
    'volume': 'Volume Master',
    'pan': 'Pan Master',
    'distort': 'Distortion Master',
    'lowpass': 'Clarity Master'
  }[MY_PARAM_TO_CONTROL]
  document.getElementById("myActiveRole").innerHTML = paramToDisplay
  addLabelWithParam(MY_PARAM_TO_CONTROL);
}


function updateForViewMode() {
  if (VIEWER_MODE != 'master') {
    MASTER_GROUP.volume = 0;
    document.getElementById("show_for_master_viewer").style.display = "none";
  }
  if(VIEWER_MODE == 'history'){
    document.getElementById("select_screen_name_div").style.display = "none";
    document.getElementById("send_message_div").style.display = "none";
    GLOBAL_REFRESH = 200; // we need to ping the server a lot more.
  }
}


function doInit() {
  // request to see what role we fill
  VIEWER_MODE = getUrlVars()['mode'];
  TIME_OFFSET = getUrlVars()['timeOffset'];
  var name = getUrlVars()['name'];
  if(name == undefined){
    name = 'ANON'
  }
  document.getElementById("fname").value = decodeURI(name);
  postData('/firstPing?id=' + SESSION_ID, {
      sample_id: '3',
      params_for_edit: 'a',
    })
    .then((data) => {
      MY_PARAM_TO_CONTROL = data['role']
      paramChange(MY_PARAM_TO_CONTROL);
    });

  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    var myNewObject = {}
    myNewObject.startTime = Math.floor(Math.random() * TOTAL_LENGTH_OF_COMPOSITION); // also should subtract diff out.
    myNewObject.volume = 1;
    myNewObject.pan = .5;
    loadFile(fileName)
    scoreAllSoundInstructions[fileName] = myNewObject;
  });

  var how_long_to_delay = getUrlVars()['delay']
  if(how_long_to_delay != undefined){
    how_long_to_disable_dragging = parseInt(how_long_to_delay)
  }

  var should_mute_right_away = getUrlVars()['mute']
  if(should_mute_right_away != undefined){
    if(should_mute_right_away == 'true'){
      setTimeout(doMute,1000);
    }
  }






}