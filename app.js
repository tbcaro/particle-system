function App() {
  this.elements.canvas = $('#canvas')[0]; // TBC : Unwrap canvas from jquery wrapper
  this.elements.txtParticleCount = $('#txt-particle-count');
  this.elements.btnStart = $('#btn-start');
  this.elements.btnStop = $('#btn-stop');
  this.elements.btnReload = $('#btn-reload');
  this.elements.txtXAcceleration = $('#txt-x-acceleration');
  this.elements.txtYAcceleration = $('#txt-y-acceleration');

  this.context = this.elements.canvas.getContext('2d');

  this.bindEventHandlers();
}
App.prototype = {
  elements: { },
  context: null,
  bindEventHandlers() {
    this.elements.btnStart.on('click', function() {
      console.log('start clicked...');
    });
    this.elements.btnStop.on('click', function() {
      console.log('stop clicked...');
    });
    this.elements.btnReload.on('click', function() {
      console.log('reload clicked...');
    });
  },
};

function Simulation() { }
Simulation.prototype = { };

function Particle() { }
Particle.prototype = { };

function Obstacle() { }
Obstacle.prototype = { };

function BounceyObstacle() { }
BounceyObstacle.prototype = Object.create(Obstacle.prototype, {

});

function StickyObstacle() { }
StickyObstacle.prototype = { };

$(document).ready(function() {
  var app = new App();
});
