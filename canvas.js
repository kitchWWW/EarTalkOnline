var sun = new Image();
var moon = new Image();
var earth = new Image();

function init() {
  sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
  moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
  earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
  window.requestAnimationFrame(draw);
}

function draw() {
  var CAN_X = 300.0;
  var SAMPLE_HEIGHT = 10;
  var ctx = document.getElementById('canvas').getContext('2d');

  ctx.globalCompositeOperation = 'destination-over';
  ctx.clearRect(0, 0, CAN_X, 300); // clear canvas

  var x_playback = Math.floor((ANIMATION_TIME_CURRENT * CAN_X) / (TOTAL_LENGTH_OF_COMPOSITION));
  ctx.beginPath();
  ctx.moveTo(x_playback, 0);
  ctx.lineTo(x_playback, 150);
  ctx.stroke();

  sampleCounts = 0;
 

  window.requestAnimationFrame(draw);
}

init();