const URL_PREFIX = '/'


function URLify(string) {
  return string.trim().replace(/\s/g, '%20');
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function loadFile(fileName) {
  var new_sound_clip = new Pizzicato.Sound(URL_PREFIX + 'samples/' + fileName, function() {
    doParamsUpdate(fileName);
    allSoundFiles[fileName]['et_sn'] = allSoundFiles[fileName].file.getRawSourceNode();
    doAnimationScoreUpdate();

  });

  var stereoPanner = new Pizzicato.Effects.StereoPanner({
    pan: 0.0
  });

  var distortion = new Pizzicato.Effects.Distortion({
    gain: 0.0
  });

  var lowPassFilter = new Pizzicato.Effects.LowPassFilter({
    frequency: 400,
    peak: 10
  });


  new_sound_clip.addEffect(distortion);
  new_sound_clip.addEffect(stereoPanner);
  new_sound_clip.addEffect(lowPassFilter);

  new_whole_object = {
    file: new_sound_clip,
    pan: stereoPanner,
    distort: distortion,
    lowpass: lowPassFilter,
  }

  allSoundFiles[fileName] = new_whole_object;
  MASTER_GROUP.addSound(new_sound_clip);

}

async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}


function updateSessionID() {
  SESSION_ID = ORIG_SESSION_ID;
  var user_name = document.getElementById("fname").value;
  if (user_name == "" || user_name == null || user_name == undefined) {
    user_name = 'Anon';
  }
  SESSION_ID = SESSION_ID + '=|=|=|=|=' + user_name;
}



function isEquivalent(a, b) {
  // Create arrays of property names
  var aProps = Object.getOwnPropertyNames(a);
  var bProps = Object.getOwnPropertyNames(b);

  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length != bProps.length) {
    return false;
  }

  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i];
    // If values of same property are not equal,
    // objects are not equivalent
    if (!isEquivalent(a[propName], b[propName])) {
      return false;
    }
  }
  // If we made it this far, objects
  // are considered equivalent
  return true;
}

function formSubmit() {
  var fd = new FormData(document.getElementById('fileUploadForm'));
  console.log(fd);
  sendFDtoServer(fd);
}


function sendFDtoServer(fd) {
  updateSessionID();

  var url = "/eartalkUpload?id=" + SESSION_ID;
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onload = function() { // request successful
    // we can use server response to our request now
    console.log(request.responseText);
  };

  request.onerror = function() {
    // request failed
  };
  request.send(fd); // create FormData from form that triggered event

}


const recordAudio = () => {
  return new Promise(resolve => {
    navigator.mediaDevices.getUserMedia({
        audio: true
      })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        const start = () => {
          mediaRecorder.start();
        };

        const stop = () => {
          return new Promise(resolve => {
            mediaRecorder.addEventListener("stop", () => {
              const audioBlob = new Blob(audioChunks);
              var fd = new FormData();
              fd.append('fname', 'test.wav');
              fd.append('upload', audioBlob);
              sendFDtoServer(fd);
              resolve({
                audioBlob,
              });
            });
            mediaRecorder.stop();
          });
        };
        resolve({
          start,
          stop
        });
      });
  });
};


function firstView() {
  MASTER_GROUP.volume = 1;
  IS_IN_MUTE = false;
  window.setTimeout(addHelpText, 300);
  window.setTimeout(removeHelpText, 3200);
}