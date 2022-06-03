// all the shit that you have to actually execute

function firstView() {
  MASTER_GROUP.volume = 1;
  IS_IN_MUTE = false;
  window.setTimeout(doHelpText, 300);
}

// set the button to be the score:
document.getElementById("fileUploadForm").onchange = function() {
	formSubmit();
};

// the stupid junk you have to do to get pizz audio to work on mobile.
window.onclick = function() {
	let context = Pizzicato.context
	let source = context.createBufferSource()
	source.buffer = context.createBuffer(1, 1, 22050)
	source.connect(context.destination)
	source.start()
	var noSleep = new NoSleep();
}

// set up the chat box:
document.getElementById('message_box').onkeypress = function(e) {
	if (!e) e = window.event;
	var keyCode = e.keyCode || e.which;
	if (keyCode == '13') {
		var chat_message = document.getElementById('message_box').value;
		document.getElementById('message_box').value = '';
		postData('/chat?id=' + SESSION_ID, {
			message: encodeURI(chat_message),
		});
	}
}



// set all your shit
scoreAllSoundInstructions = {} // in future will be something we get, store, and refresh from server
allSoundFiles = {}
IS_IN_MUTE = true; // start off muted;

GLOBAL_TIMESTEP = 1000 / 20.0; // 13 frames a second, enough to fool eye in scrolling.
GLOBAL_REFRESH = 1000; // how frequently we request a new score from the server
TOTAL_LENGTH_OF_COMPOSITION = 120 * 1000;
ANIMATION_TIME_CURRENT = 0;
IS_FIRST_TIME_LOADING_CHAT = true;
MY_PARAM_TO_CONTROL = 'volume'; // should be volume or pan for now, something else maybe later. 
var recorder = null;
var how_long_to_disable_dragging = 10;

TIME_OFFSET = 0;

var reverb = new Pizzicato.Effects.Reverb({
	time: 1.45,
	decay: 1,
	reverse: false,
	mix: 0
});

var VIEWER_MODE = '';

var MASTER_GROUP = new Pizzicato.Group([]);
MASTER_GROUP.addEffect(reverb);

var ORIG_SESSION_ID = 'id_' + Math.random().toString(36).substr(2, 18);
var SESSION_ID = '';
updateSessionID();

// the valid final state of the dealio
doInit();
MASTER_GROUP.volume = 0;
updateForViewMode();
window.setInterval(masterIntervalStepper, GLOBAL_TIMESTEP);
window.setInterval(masterScoreRefresh, GLOBAL_REFRESH);







// hide the record button because we aren't on https
// document.getElementById('startRecordButton').style.display="none";



// and now that everything is ready to go and loaded, we "show" it.
window.addEventListener("load", firstView);
