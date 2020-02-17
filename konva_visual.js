var width = window.innerWidth;
var height = window.innerHeight - 200;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

SAMPLE_HEIGHT = 100;
CAN_DO_UPDATE = true;

function doAnimationScoreUpdate() {
  if (!CAN_DO_UPDATE) {
    return;
  }
  sampleCounts = 0
  stage.destroyChildren();
  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    var x_start = Math.floor((scoreAllSoundInstructions[fileName].startTime * width) / TOTAL_LENGTH_OF_COMPOSITION);
    var y_start = (1 - scoreAllSoundInstructions[fileName].volume) * (height - SAMPLE_HEIGHT)
    var sn = allSoundFiles[fileName].et_sn;
    if (sn == undefined) {
      return;
    }
    var rec_width = sn.buffer.duration * 1000 * width / TOTAL_LENGTH_OF_COMPOSITION

    var layer = new Konva.Layer();
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
      CAN_DO_UPDATE = true;
      if (box.attrs.x < 0) {
        box.move({
          x: -box.attrs.x,
          y: 0
        });
      }
      // new thing:
      var new_start_time = box.attrs.x * TOTAL_LENGTH_OF_COMPOSITION / width;
      var new_volume = 1 - (box.attrs.y / (height - SAMPLE_HEIGHT));
      console.log(new_volume);
      updateServerScore(box.et_name, {
        'startTime': new_start_time,
        'volume': new_volume,
      });
    });
    box.on('mousedown', function() {
      CAN_DO_UPDATE = false;
    })
    box.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });
    layer.add(box);
    stage.add(layer);

  });
}