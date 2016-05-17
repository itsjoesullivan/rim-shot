(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"make-distortion-curve":3}],2:[function(require,module,exports){
var Sound = require('./index');
var context = new AudioContext();

document.getElementById('play').addEventListener('click', function(e) {
  var sound = Sound(context, {});
  soundNode = sound();
  soundNode.connect(context.destination);
  soundNode.start(context.currentTime + 0.01);
  soundNode.gain.value = 0.5;
});

},{"./index":1}],3:[function(require,module,exports){
module.exports = function(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
}

},{}]},{},[2]);
