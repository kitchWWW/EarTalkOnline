function masterIntervalStepper() {
  time = Math.floor(Date.now());
  time = time % TOTAL_LENGTH_OF_COMPOSITION; // keep it within 0 -> total length
  ANIMATION_TIME_CURRENT = time;
  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    scoreSampleInstruction = scoreAllSoundInstructions[fileName];
    if (!(fileName in allSoundFiles)) {
      loadFile(fileName);
    }
    if (scoreSampleInstruction.startTime > time - GLOBAL_TIMESTEP && scoreSampleInstruction.startTime < time) {
      //tell the thing to start playing
      allSoundFiles[fileName].play();
    }
    doParamsUpdate(fileName);
  });
  // also do a render update
}

function masterScoreRefresh() {
  fetch("/score.json?id=" + SESSION_ID)
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
}

var serverUpdateTimeout = null;

function updateServerScore(sample_id, params_for_edit) {
  console.log("doing update!");
  console.log(sample_id);
  console.log(params_for_edit);
  CAN_DO_UPDATE = false;
  postData('/updateScore?id='+SESSION_ID, {
      sample_id: sample_id,
      params_for_edit: params_for_edit,
    })
    .then((data) => {
      CAN_DO_UPDATE = true;
      console.log("DID THE UPDATE!");
      console.log(data); // JSON data parsed by `response.json()` call
    });
}

function doInstructionExecution() {
  var res = document.getElementById("myText").value;
  document.getElementById("myText").value = "";
  res = res.toLowerCase();
  console.log(res);
  curSampleID = ''
  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    fileName = fileName.toLowerCase();
    if (res.includes(fileName)) {
      curSampleID = fileName
    }
  })
}


function doParamsUpdate(fileName) {
  allSoundFiles[fileName].volume = scoreAllSoundInstructions[fileName].volume
  allSoundFiles[fileName].pan = scoreAllSoundInstructions[fileName].pan
}

function doMute() {
  if (IS_IN_MUTE) {
    MASTER_GROUP.volume = 1;
    IS_IN_MUTE = false
    document.getElementById("myMuteButton").innerHTML = "MUTE!";
  } else {
    MASTER_GROUP.volume = 0;
    IS_IN_MUTE = true
    document.getElementById("myMuteButton").innerHTML = "play again";
  }
}


function doInit() {
  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    var myNewObject = {}
    myNewObject.startTime = Math.floor(Math.random() * TOTAL_LENGTH_OF_COMPOSITION); // also should subtract diff out.
    myNewObject.volume = 1;
    myNewObject.pan = .5;
    loadFile(fileName)
    scoreAllSoundInstructions[fileName] = myNewObject;
    console.log(scoreAllSoundInstructions);
  });
}