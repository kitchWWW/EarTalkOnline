// all the shit that you have to actually execute
document.getElementById('fileUploadForm').addEventListener("submit", formSubmit);

// the stupid junk you have to do to get pizz audio to work on mobile.
window.onclick = function() {
	let context = Pizzicato.context
	let source = context.createBufferSource()
	source.buffer = context.createBuffer(1, 1, 22050)
	source.connect(context.destination)
	source.start()
}

// set all your shit
scoreAllSoundInstructions = {} // in future will be something we get, store, and refresh from server
allSoundFiles = {}
IS_IN_MUTE = true; // start off muted;

GLOBAL_TIMESTEP = 1000 / 20.0; // 13 frames a second, enough to fool eye in scrolling.
GLOBAL_REFRESH = 1000; // how frequently we request a new score from the server
TOTAL_LENGTH_OF_COMPOSITION = 20 * 1000; 
ANIMATION_TIME_CURRENT = 0;
IS_FIRST_TIME_LOADING_CHAT = true;

var reverb = new Pizzicato.Effects.Reverb({
	time: 0.5,
	decay: 1,
	reverse: false,
	mix: 0.9
});
var MASTER_GROUP = new Pizzicato.Group([]);
MASTER_GROUP.addEffect(reverb);
var ORIG_SESSION_ID = 'id_' + Math.random().toString(36).substr(2, 18);
var SESSION_ID = '';
updateSessionID();

// the valid final state of the dealio
doInit();
MASTER_GROUP.volume = 0;
window.setInterval(masterIntervalStepper, GLOBAL_TIMESTEP);
window.setInterval(masterScoreRefresh, GLOBAL_REFRESH);