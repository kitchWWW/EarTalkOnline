
// the stupid junk you have to do to get pizz audio to work on mobile.
window.onclick = function() {
	let context = Pizzicato.context
	let source = context.createBufferSource()
	source.buffer = context.createBuffer(1, 1, 22050)
	source.connect(context.destination)
	source.start()
	var noSleep = new NoSleep();
}


var my_recording_to_playback = null;
// var my_reverb_for_sound = new Pizzicato.Effects.Reverb({
//     time: 0.01,
//     decay: 0.01,
//     reverse: false,
//     mix: 0.5
// });

console.log("everything started!");