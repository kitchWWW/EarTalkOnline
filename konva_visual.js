var width = window.innerWidth;
var height = window.innerHeight - 200;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

SAMPLE_HEIGHT = 100;

function doAnimationScoreUpdate() {
  console.log("we are here bro");
  sampleCounts = 0
  stage.destroyChildren();
  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    var x_start = Math.floor((scoreAllSoundInstructions[fileName].startTime * width) / TOTAL_LENGTH_OF_COMPOSITION);
    var y_start = (SAMPLE_HEIGHT * sampleCounts);
    var sn = allSoundFiles[fileName].et_sn;

    var rec_width = sn.buffer.duration * 1000 * width / TOTAL_LENGTH_OF_COMPOSITION

    var layer = new Konva.Layer();
    var rectX = stage.width() / 2 - 50;
    var rectY = stage.height() / 2 - 25;
    var box = new Konva.Rect({
      x: x_start,
      y: y_start,
      width: rec_width,
      height: SAMPLE_HEIGHT,
      fill: '#00D2FF',
      stroke: 'black',
      strokeWidth: 4,
      draggable: true
    });
    box.et_name = fileName
    sampleCounts += 1
    // add cursor styling
    box.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    box.on('mouseup', function() {
      console.log(box.et_name);
      console.log(box.attrs.x)
      if (box.attrs.x < 0) {
        box.move({
          x: -box.attrs.x,
          y: 0
        });
      }
      // new thing:
      var new_start_time = box.attrs.x * TOTAL_LENGTH_OF_COMPOSITION / width;
      console.log(new_start_time);
      updateServerScore(box.et_name,'startTime',new_start_time);
    });
    box.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });
    layer.add(box);
    stage.add(layer);
  });
}