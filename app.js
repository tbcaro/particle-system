function App() {
  this.elements = { };
  this.context = null;
  this.simulation = null;

  this.elements.canvas = $('#canvas')[0]; // TBC : Unwrap canvas from jquery wrapper
  this.elements.txtParticleCount = $('#txt-particle-count');
  this.elements.btnStart = $('#btn-start');
  this.elements.btnStop = $('#btn-stop');
  this.elements.btnReload = $('#btn-reload');
  this.elements.txtXAcceleration = $('#txt-x-acceleration');
  this.elements.txtYAcceleration = $('#txt-y-acceleration');

  this.context = this.elements.canvas.getContext('2d');
  this.simulation = new Simulation();

  this.bindEventHandlers();
}
App.prototype = {
  bindEventHandlers() {
    this.elements.btnStart.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      console.log('start clicked...');
      this.simulation.start();
    });
    this.elements.btnStop.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      console.log('stop clicked...');
      this.simulation.stop();
    });
    this.elements.btnReload.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      console.log('reload clicked...');
      this.simulation.reload();
    });
    $(document).on('simulation-tick', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      console.log('simulation-tick...');
    });
  },
};

function Simulation() {
  this.particles = [];
  this.obstacles = [];
  this.started = false;
  this.running = false;
}
Simulation.prototype = {
  start() {
    this.started = true;
    this.running = true;
    window.requestAnimationFrame(() => { this.run(); }); // TBC : Use arrow function to maintain correct reference of 'this'
  },
  reload() {
    this.particles = [];
    this.obstacles = [];
    this.started = false;
    this.running = false;
  },
  stop() {
    this.running = false;
  },
  run() {
    if (this.started && this.running) {
      this.tick();
      window.requestAnimationFrame(() => { this.run(); }); // TBC : Use arrow function to maintain correct reference of 'this'
    }
  },
  tick() {
    // TODO
    // TBC : Update particle position
    // TBC : Check collisions
      // TBC : If collided, bounce, stick, etc.
    var event = jQuery.Event('simulation-tick');
    event.particles = this.particles;
    event.obstacles = this.obstacles;
    $(document).trigger(event);
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

function Particle(options) {
  var DEFAULT_POSITION = { x:0, y:0 },
      DEFAULT_VELOCITY = { xv:0, yv:0 },
      DEFAULT_COLOR = '#fff',
      DEFAULT_SIZE = 5,
      DEFAULT_SHAPE = Particle.Shapes.CIRCLE;
  options.hasOwnProperty('position') ? this.position = options.position : this.position = DEFAULT_POSITION;
  options.hasOwnProperty('velocity') ? this.velocity = options.velocity : this.velocity = DEFAULT_VELOCITY;
  options.hasOwnProperty('size') ? this.size = options.size : this.size = DEFAULT_SIZE;
  options.hasOwnProperty('color') ? this.color = options.color : this.color = DEFAULT_COLOR;
  options.hasOwnProperty('shape') ? this.color = options.color : this.color = DEFAULT_COLOR;
}
Particle.prototype = {
  Shapes: {
    CIRCLE: 'circle',
    SQUARE: 'square'
  }
};

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
