function masterIntervalStepper() {
  time = Math.floor(Date.now());
  time = time % TOTAL_LENGTH_OF_COMPOSITION; // keep it within 0 -> total length
  allSampleNames.forEach((fileName) => {
    scoreSampleInstruction = scoreAllSoundInstructions[fileName];
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
      scoreAllSoundInstructions = data;
      postData('/updateScore', {
          sample_id: 's1',
          param_to_edit: 'volume',
          new_param_value: 1
        })
        .then((data) => {
          console.log(data); // JSON data parsed by `response.json()` call
        });

    })
    .catch(e => {
      console.log(e);
      return e;
    });
}


function doInstructionExecution() {
  var res = document.getElementById("myText").value;
  document.getElementById("myText").value = "";
  console.log(res);
  fetch("https://api.wit.ai/message?v=20200204&q=" + URLify(res), {
      headers: {
        Authorization: "Bearer YRP5ROMET2FO3A54HYWB7R72VV6TRSF2"
      }
    })
    .then(blob => blob.json())
    .then(data => {
      console.table(data);
      var intent = ''
      if (data.entities.intent) {
        intent = data.entities.intent[0].value
      }
      var instrument = ''
      if (data.entities.instrument) {
        instrument = data.entities.instrument[0].value
      }
    })
    .catch(e => {
      console.log(e);
      return e;
    });
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
  console.log(allSampleNames);
  allSampleNames.forEach((fileName) => {
    var myNewObject = {}
    myNewObject.startTime = Math.floor(Math.random() * TOTAL_LENGTH_OF_COMPOSITION); // also should subtract diff out.
    myNewObject.volume = 1;
    myNewObject.pan = .5;
    loadFile(fileName)
    scoreAllSoundInstructions[fileName] = myNewObject;
    console.log(scoreAllSoundInstructions);
  });
}