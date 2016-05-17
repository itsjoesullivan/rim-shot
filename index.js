var makeDistortionCurve = require('make-distortion-curve');

// partially informed by the rather odd http://www.kvraudio.com/forum/viewtopic.php?t=383536
module.exports = function(context) {

  return function() {
    var duration = 0.05;
    var oscs = [
      context.createOscillator(),
      context.createOscillator(),
      //context.createOscillator()
      ];
    oscs.forEach(function(osc) {
      osc.type = "triangle";
    });
    var highpass = context.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 700;
    oscs[0].frequency.value = 500;
    oscs[1].frequency.value = 1720;
    var distortion = context.createWaveShaper();
    distortion.curve = makeDistortionCurve(1024);

    var gain = context.createGain();
    oscs.forEach(function(osc) {
      osc.connect(distortion);
    });
    distortion.connect(highpass);
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

