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
  this.simulation = new Simulation(this.context, this.elements.canvas);

  this.bindEventHandlers();
}
App.prototype = {
  bindEventHandlers() {
    this.elements.btnStart.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      console.log('start clicked...');
      try {
        var particles = this.loadInitialParticles();
        //var obstacles = this.loadInitialObstacles();
        this.simulation.setParticles(particles);
        this.simulation.start();
      } catch (ex) {
        console.log(ex);
        alert(ex.message);
      }
    });
    this.elements.btnStop.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      console.log('stop clicked...');
      this.simulation.stop();
    });
    this.elements.btnReload.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      console.log('reload clicked...');
      this.simulation.reload();
    });
    // $(document).on('simulation-tick', () => { // TBC : Use arrow function to maintain correct reference of 'this'
    //   console.log('simulation-tick...');
    // });
  },
  loadInitialParticles() {
    const INITIAL_LOCATION = { x: this.elements.canvas.width / 2, y: this.elements.canvas.height / 2};
    var particles = [];
    var particleCount = this.elements.txtParticleCount.val()

    for (var i = 0; i < particleCount; i++) {
      var p = new Particle({
        position: INITIAL_LOCATION,
        velocity: { vx: Math.random() - 1, vy: Math.random() - 1 },
        canvas: this.elements.canvas,
        drawContext: this.context
      });

      particles.push(p);
    }

    return particles;
  }
};

function Simulation(drawContext, canvas) {
  this.drawContext = drawContext || null;
  this.canvas = canvas || null;
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
    this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach(function(particle) {
      // TBC : Update particle position
      particle.updatePosition();

      // this.obstacles.forEach(function(obstacle) {
      //   // TBC : If collided, bounce, stick, etc.
      // });

      particle.draw();
    });

    var event = jQuery.Event('simulation-tick');
    event.particles = this.particles;
    event.obstacles = this.obstacles;
    $(document).trigger(event);
  },
  setAcceleration(acceleration) {
    this.acceleration = acceleration;
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
      DEFAULT_VELOCITY = { vx:0, vy:0 },
      DEFAULT_COLOR = '#f00',
      DEFAULT_RADIUS = 2,
      DEFAULT_CANVAS = $('#canvas')[0],
      DEFAULT_DRAW_CONTEXT = DEFAULT_CANVAS.getContext('2d');

  options.hasOwnProperty('position') ? this.position = options.position : this.position = DEFAULT_POSITION;
  options.hasOwnProperty('velocity') ? this.velocity = options.velocity : this.velocity = DEFAULT_VELOCITY;
  options.hasOwnProperty('radius') ? this.radius = options.radius : this.radius = DEFAULT_RADIUS;
  options.hasOwnProperty('color') ? this.color = options.color : this.color = DEFAULT_COLOR;
  options.hasOwnProperty('canvas') ? this.canvas = options.canvas : this.canvas = DEFAULT_CANVAS;
  options.hasOwnProperty('drawContext') ? this.drawContext = options.drawContext : this.drawContext = DEFAULT_DRAW_CONTEXT;
}
Particle.prototype = {
  updatePosition() {
    // TBC : Move position
    this.position.x += this.velocity.vx;
    this.position.y += this.velocity.vy;

    // TBC : Bounce off of walls
    if (this.position.x < 0 || this.position.x > this.canvas.width)
      this.velocity.vx = -this.velocity.vx;
    if (this.position.y < 0 || this.position.y > this.canvas.height)
      this.velocity.vy = -this.velocity.vy;
  },
  draw() {
    this.drawContext.fillStyle = this.color;
    this.drawContext.beginPath();
    this.drawContext.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    this.drawContext.fill();
  }
};

function Obstacle() {

}
Obstacle.prototype = {
  ObstacleType: {
    BOUNCEY: 'bouncey',
    STICKY: 'sticky'
  },
  getObstacleType() {
    return this.type;
  }
};

// function BounceyObstacle() { }
// BounceyObstacle.prototype = Object.create(Obstacle.prototype, {
//
// });
//
// function StickyObstacle() { }
// StickyObstacle.prototype = Object.create(Obstacle.prototype, {
//
// });

$(document).ready(function() {
  var app = new App();
});
