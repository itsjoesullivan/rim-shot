var Sound = require('./index');
var context = new AudioContext();

var sound = Sound(context, {});

document.getElementById('play').addEventListener('click', function(e) {
  soundNode = sound();
  soundNode.connect(context.destination);
  soundNode.start(context.currentTime + 0.01);
  soundNode.gain.value = 0.5;
});
