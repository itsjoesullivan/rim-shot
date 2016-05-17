var makeDistortionCurve = require('make-distortion-curve');
var curve = makeDistortionCurve(1024);


// partially informed by the rather odd http://www.kvraudio.com/forum/viewtopic.php?t=383536
module.exports = function(context) {

  var distortion = context.createWaveShaper();
  distortion.curve = curve;

  var highpass = context.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 700;

  distortion.connect(highpass);

  return function() {
    var duration = 0.05;
    var oscs = [
      context.createOscillator(),
      context.createOscillator(),
      ];
    oscs.forEach(function(osc) {
      osc.type = "triangle";
    });
    oscs[0].frequency.value = 500;
    oscs[1].frequency.value = 1720;

    var gain = context.createGain();

    oscs.forEach(function(osc) {
      osc.connect(distortion);
    });
    highpass.connect(gain);
    gain.start = function(when) {
      oscs.forEach(function(osc) {
        osc.start(when);
        osc.stop(when + duration);
      });
      gain.gain.setValueAtTime(0.8, when);
      gain.gain.exponentialRampToValueAtTime(0.00001, when + duration);
    };
    return gain;
  };
};

