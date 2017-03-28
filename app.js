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
  simulation: null,
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
Simulation.prototype = {
  particles: [],
  obstacles: [],
  started: false,
  running: false,
  start() {
    this.started = true;
    // TODO
  },
  tick() {
    // TODO
    // TBC : Update particle position
    // TBC : Check collisions
      // TBC : If collided, bounce, stick, etc.
  },
  addParticle(particle) {
    this.particles.push(particle);
  },
  setParticles(particles) {
    this.particles = particles;
  },
  getParticles() {
    return this.particles;
  },
  addObstacle(obstacle) {
    this.obstacles.push(obstacle);
  },
  setObstacles(obstacles) {
    this.obstacles = obstacles;
  },
  getObstacles() {
    return this.obstacles;
  },
};

function Particle() { }
Particle.prototype = { };

function Obstacle() { }
Obstacle.prototype = { };

function BounceyObstacle() { }
BounceyObstacle.prototype = Object.create(Obstacle.prototype, {

});

function StickyObstacle() { }
StickyObstacle.prototype = Object.create(Obstacle.prototype, {

});

$(document).ready(function() {
  var app = new App();
});
