var width = window.innerWidth;
var height = window.innerHeight - 300;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});
var samples_layer = new Konva.Layer();
var trash_layer = new Konva.Layer();



// main API:
var imageObj = new Image();
imageObj.onload = function() {
  var yoda = new Konva.Image({
    x: width - 55,
    y: height - 55,
    image: imageObj,
    width: 50,
    height: 50,
  });

  // add the shape to the layer
  trash_layer.add(yoda);
  trash_layer.batchDraw();
};
imageObj.src = '/res/trash.png';
stage.add(trash_layer);


SAMPLE_HEIGHT = 50;
CAN_DO_UPDATE = true;

function doAnimationScoreUpdate() {
  // console.log("going!");
  if (!CAN_DO_UPDATE) {
    // console.log("aborting");
    return;
  }
  sampleCounts = 0
  samples_layer.destroyChildren();
  Object.keys(scoreAllSoundInstructions).forEach((fileName) => {
    var x_start = Math.floor((scoreAllSoundInstructions[fileName].startTime * width) / TOTAL_LENGTH_OF_COMPOSITION);
    var y_start = (1 - scoreAllSoundInstructions[fileName].volume) * (height - SAMPLE_HEIGHT)
    if (allSoundFiles[fileName] == undefined) {
      return;
    }
    var sn = allSoundFiles[fileName].et_sn;
    if (sn == undefined) {
      return;
    }
    var rec_width = sn.buffer.duration * 1000 * width / TOTAL_LENGTH_OF_COMPOSITION

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

    var myUpdateFunction = function(e) {
      console.log("start:");
      console.log();
      if (e.evt.layerX > width - 50) {
        if (e.evt.layerY > height - 50) {
          // then they went to the delete button!
          console.log("delete!");
          updateServerScore(group.et_name, {});
          group.destroy();

          return;
        }
      }

      // console.log(e.target.x());
      // console.log(group.attrs.x);

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
      if (new_start_time < 0) {
        new_start_time = 0;
      }
      if (new_volume < 0) {
        new_volume = 0;
      }
      if (new_volume > 1) {
        new_volume = 1;
      }
      updateServerScore(group.et_name, {
        'startTime': new_start_time,
        'volume': new_volume,
      });
    };


    group.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
    });
    group.on('mouseup', myUpdateFunction);
    group.on('touchend', myUpdateFunction);
    group.on('mousedown', function() {
      CAN_DO_UPDATE = false;
    })
    group.on('touchdown', function() {
      CAN_DO_UPDATE = false;
    })
    group.on('mouseout', function() {
      document.body.style.cursor = 'default';
    });
    samples_layer.add(group);
  });

  stage.add(samples_layer);


}