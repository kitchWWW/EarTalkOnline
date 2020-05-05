function sendFDtoServer(fd) {
  var url = "/handsUpload";
  var request = new XMLHttpRequest();
  request.open('POST', url, true);
  request.onload = function() { // request successful
    // we can use server response to our request now
    console.log(request.responseText);
    window.my_recording_to_playback = new Pizzicato.Sound({
      source: 'file',
      options: {
        path: 'hands/samples/' + request.responseText,
        loop: true,
        attack: 2,
        release: .1,
      }
    }, function() {
      // Sound loaded!
      console.log(window.my_recording_to_playback)
      // console.log(window.my_reverb_for_sound);
      // window.my_recording_to_playback.addEffect(window.my_reverb_for_sound);
      window.my_recording_to_playback.play();
      window.my_recording_to_playback.isPlayingRightNow = true;
    });
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



async function record() {
  recorder = await recordAudio();
  recorder.start();
  // also gunna need to disable the current pizzicato playback
  document.getElementById("record_start").style.display = "none";
  document.getElementById("record_stop").style.display = "block";
  if (window.my_recording_to_playback != null) {
    window.my_recording_to_playback.stop()
  }
}

async function finishRecording() {
  document.getElementById("record_stop").style.display = "none";
  document.getElementById("record_start").style.display = "block";
  document.getElementById("mute_button").style.display = "block";
  document.getElementById("piece_over").style.display = "block";
  document.getElementById("start_button").innerHTML = "record new";
  await recorder.stop();

}

function mute() {
  if (window.my_recording_to_playback) {
    if (window.my_recording_to_playback.isPlayingRightNow === true) {
      window.my_recording_to_playback.stop()
      window.my_recording_to_playback.isPlayingRightNow = false;
      document.getElementById("mute").innerHTML = "unmute";

    } else {
      window.my_recording_to_playback.play();
      window.my_recording_to_playback.isPlayingRightNow = true;
      document.getElementById("mute").innerHTML = "mute";
    };

  }
}



function startWholeThing() {
  document.getElementById("go_button_div").style.display = "none";
  document.getElementById("main_content_div").style.display = "block";
}

function finishPiece() {
  document.getElementById("go_button_div").style.display = "block";
  document.getElementById("thanks_message").style.display = "block";
  document.getElementById("main_content_div").style.display = "none";
  if (window.my_recording_to_playback != null) {
    window.my_recording_to_playback.stop()
  }
}