function URLify(string) {
  return string.trim().replace(/\s/g, '%20');
}


function loadFile(fileName) {
  var new_file = new Pizzicato.Sound('samples/' + fileName, function() {
    // console.log("loaded " + fileName + "!");
    doParamsUpdate(fileName);
    allSoundFiles[fileName].et_sn = allSoundFiles[fileName].getRawSourceNode();
    // console.log(allSoundFiles[fileName]);
    doAnimationScoreUpdate();

  });
  allSoundFiles[fileName] = new_file;
  // console.log(allSoundFiles);
  MASTER_GROUP.addSound(new_file);

}

function showAll() {
  document.getElementById("allInteraction").style.display = "block";
  document.getElementById("intro_page").style.display = "none";
  MASTER_GROUP.volume = 1;
  IS_IN_MUTE = false;
  document.getElementById("fname").value = document.getElementById("cname").value
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
  var url = "/upload";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onload = function() { // request successful
    // we can use server response to our request now
    console.log(request.responseText);
  };

  request.onerror = function() {
    // request failed
  };

  request.send(new FormData(document.getElementById('fileUploadForm'))); // create FormData from form that triggered event
}