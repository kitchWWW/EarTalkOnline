function URLify(string) {
 return string.trim().replace(/\s/g, '%20');
}


function loadFile(fileName){
  var new_file = new Pizzicato.Sound('res/'+fileName+'.m4a', function() {
    console.log("loaded "+fileName+"!");
    doParamsUpdate(fileName);
  });
  allSoundFiles[fileName] = new_file;
  console.log(allSoundFiles);
  MASTER_GROUP.addSound(new_file);
}

function showAll(){
	// do some div hiding and showing here
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