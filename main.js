var Sound = require('./index');
var context = new AudioContext();

document.getElementById('play').addEventListener('click', function(e) {
  var sound = Sound(context, {});
  soundNode = sound();
  soundNode.connect(context.destination);
  soundNode.start(context.currentTime + 0.01);
  soundNode.gain.value = 0.5;
});
