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
  // console.log("going!");
  if (!CAN_DO_UPDATE) {
    // console.log("aborting");
    return;
  }
  sampleCounts = 0
  stage.destroyChildren();
  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    var x_start = Math.floor((scoreAllSoundInstructions[fileName].startTime * width) / TOTAL_LENGTH_OF_COMPOSITION);
    var y_start = (1 - scoreAllSoundInstructions[fileName].volume) * (height - SAMPLE_HEIGHT)
    if(allSoundFiles[fileName] == undefined){
      return;
    }
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
    });
    var simpleText = new Konva.Text({
      x: x_start + 5,
      y: y_start + 5,
      text: fileName,
      fontSize: 30,
      fontFamily: 'arial',
      fill: 'black'
    });
    var group = new Konva.Group({
      draggable: true
    });
    group.add(box);
    group.add(simpleText);
    group.et_name = fileName
    sampleCounts += 1
    // add cursor styling
    group.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    group.on('mouseup', function(e) {
      console.log("start:");
      console.log(e.target.x());
      console.log(group.attrs.x);
      var box_x = e.target.x() + group.attrs.x
      var box_y = e.target.y() + group.attrs.y
      console.log(box_x);
      console.log(box_y);
      if (box_x < 0) {
        group.move({
          x: -box_x,
          y: 0
        });
      }
      if (box_y + SAMPLE_HEIGHT > height) {
        group.move({
          x: 0,
          y: (height - SAMPLE_HEIGHT - box_y)
        });
      }
      // new thing:
      var new_start_time = box_x * TOTAL_LENGTH_OF_COMPOSITION / width;
      var new_volume = 1 - (box_y / (height - SAMPLE_HEIGHT));
      if(new_start_time < 0){
        new_start_time = 0;
      }if(new_volume < 0){
        new_volume = 0;
      }if(new_volume > 1){
        new_volume = 1;
      }
      updateServerScore(group.et_name, {
        'startTime': new_start_time,
        'volume': new_volume,
      });
    });
    group.on('mousedown', function() {
      CAN_DO_UPDATE = false;
    })
    group.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });
    layer.add(group);
    stage.add(layer);

  });
}