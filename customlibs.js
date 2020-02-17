function URLify(string) {
  return string.trim().replace(/\s/g, '%20');
}


function loadFile(fileName) {
  var new_file = new Pizzicato.Sound('res/' + fileName + '.m4a', function() {
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
  var x = document.getElementById("allInteraction");
  if (x.style.display === "none") {
    x.style.display = "block";
    document.getElementById("go_all").style.display = "none";
  } else {
    x.style.display = "none";
  }
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