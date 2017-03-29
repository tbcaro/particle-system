const ObstacleType = {
  BOUNCEY: 'bouncey',
  STICKY: 'sticky'
};

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
      if (!this.simulation.started) {
        try {
          var particles = this.loadInitialParticles();
          var obstacles = this.loadInitialObstacles();
          this.simulation.setParticles(particles);
          this.simulation.setObstacles(obstacles);
        } catch (ex) {
          console.log(ex);
          alert(ex.message);
        }
      }

      this.simulation.start();
    });
    this.elements.btnStop.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      this.simulation.stop();
    });
    this.elements.btnReload.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      this.simulation.reload();
    });
    this.elements.txtXAcceleration.on('change', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      try {
        var xAccel = Number.parseFloat(this.elements.txtXAcceleration.val());
        this.simulation.setXAccel(xAccel);
      } catch (ex) {
        console.log(ex);
        alert(ex.message);
      }
    });
    this.elements.txtYAcceleration.on('change', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      try {
        var yAccel = Number.parseFloat(this.elements.txtYAcceleration.val());
        this.simulation.setYAccel(yAccel);
      } catch (ex) {
        console.log(ex);
        alert(ex.message);
      }
    });
  },
  loadInitialParticles() {
    var particles = [];
    var particleCount = this.elements.txtParticleCount.val()

    for (var i = 0; i < particleCount; i++) {
      var p = new Particle({
        position: { x: this.elements.canvas.width / 2, y: this.elements.canvas.height / 2},
        velocity: { vx: 4 * Math.random() - 2, vy: 4 * Math.random() - 2 },
        canvas: this.elements.canvas,
        drawContext: this.context
      });

      particles.push(p);
    }

    return particles;
  },
  loadInitialObstacles() {
    var obstacles = [];
    // var obstacleCount = Math.floor(Math.random() * 9 + 1); // TBC : Max of 10 obstacles
    var obstacleCount = 5;

    obstacles.push(new Obstacle({
      position: {
        x: 100,
        y: 100
      },
      type: ObstacleType.BOUNCEY,
      size: Math.random() * 100 + 10,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    obstacles.push(new Obstacle({
      position: {
        x: 400,
        y: 400
      },
      type: ObstacleType.BOUNCEY,
      size: Math.random() * 100 + 10,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    // for (var i = 0; i < obstacleCount; i++) {
    //   var randXOffset = Math.floor(Math.random() * 2);
    //   var randYOffset = Math.floor(Math.random() * 2);
    //   var randObstacleType = Math.floor(Math.random() * 2);
    //   var xOffset = 100;
    //   var yOffset = 100;
    //   var obstacleType = ObstacleType.BOUNCEY;
    //
    //   randXOffset == 0 ? xOffset = -xOffset : xOffset = xOffset;
    //   randYOffset == 0 ? yOffset = -yOffset : yOffset = yOffset;
    //   randObstacleType == 0 ? obstacleType = ObstacleType.BOUNCEY : obstacleType = ObstacleType.STICKY;
    //
    //   var o = new Obstacle({
    //     position: {
    //       x: (this.elements.canvas.width / 2) + Math.random() * 100,
    //       y: (this.elements.canvas.height / 2) + Math.random() * 100
    //     },
    //     type: obstacleType,
    //     size: Math.random() * 50 + 1,
    //     canvas: this.elements.canvas,
    //     drawContext: this.context
    //   });
    //
    //   obstacles.push(o);
    // }

    return obstacles;
  }
};

function Simulation(drawContext, canvas) {
  this.drawContext = drawContext || null;
  this.canvas = canvas || null;
  this.particles = [];
  this.obstacles = [];
  this.started = false;
  this.running = false;
  this.simulatedFrames = 0;
  this.particleAcceleration = { xAccel: 0, yAccel: 0 };
}
Simulation.prototype = {
  start() {
    this.started = true;
    this.running = true;
    window.requestAnimationFrame(() => { this.run(); }); // TBC : Use arrow function to maintain correct reference of 'this'
  },
  reload() {
    this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particleAcceleration = { xAccel: 0, yAccel: 0 };
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
    // TBC : Draw obstacles
    this.obstacles.forEach(function(obstacle) {
      obstacle.draw();
    });
    this.particles.forEach((particle) => {
      // TBC : Accelerate particle velocity
      particle.accelerate(this.particleAcceleration);

      // TBC : Update particle position
      particle.updatePosition();

      // TBC : Check obstacle collisions
      this.obstacles.forEach(function(obstacle) {
        obstacle.checkCollision(particle);
      });

      particle.draw();
    });

    this.simulatedFrames++;
  },
  setXAccel(xAccel) {
    this.particleAcceleration.xAccel = xAccel;
  },
  setYAccel(yAccel) {
    this.particleAcceleration.yAccel = yAccel;
  },
  setParticles(particles) {
    this.particles = particles;
  },
  getParticles() {
    return this.particles;
  },
  setObstacles(obstacles) {
    this.obstacles = obstacles;
  },
  getObstacles() {
    return this.obstacles;
  },
};

function Particle(options) {
  this.position = { x:0, y:0 };
  this.velocity = { vx:0, vy:0 };
  this.color = '#000';
  this.radius = 2;
  this.canvas = $('#canvas')[0];
  this.drawContext = this.canvas.getContext('2d');

  if (options.hasOwnProperty('position')) this.position = options.position;
  if (options.hasOwnProperty('velocity')) this.velocity = options.velocity;
  if (options.hasOwnProperty('radius')) this.radius = options.radius;
  if (options.hasOwnProperty('color')) this.color = options.color;
  if (options.hasOwnProperty('canvas')) this.canvas = options.canvas;
  if (options.hasOwnProperty('drawContext')) this.drawContext = options.drawContext;
}
Particle.prototype = {
  updatePosition() {
    // TBC : Move position
    this.position.x += this.velocity.vx;
    this.position.y += this.velocity.vy;

    // TBC : Bounce off of walls
    if (this.position.x - this.radius <= 0 || this.position.x + this.radius >= this.canvas.width)
      this.velocity.vx = -this.velocity.vx;
    if (this.position.y - this.radius <= 0 || this.position.y + this.radius >= this.canvas.height)
      this.velocity.vy = -this.velocity.vy;
  },
  draw() {
    this.drawContext.fillStyle = this.color;
    this.drawContext.beginPath();
    this.drawContext.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    this.drawContext.fill();
  },
  accelerate(acceleration) {
    this.velocity.vx > 0 ? this.velocity.vx += acceleration.xAccel : this.velocity.vx -= acceleration.xAccel;
    this.velocity.vy > 0 ? this.velocity.vy += acceleration.yAccel : this.velocity.vy -= acceleration.yAccel;
  }
};

function Obstacle(options) {
  this.position = { x:0, y:0 };
  this.type = ObstacleType.BOUNCEY;
  this.size = 5;
  this.canvas = $('#canvas')[0];
  this.drawContext = this.canvas.getContext('2d');

  if (options.hasOwnProperty('position')) this.position = options.position;
  if (options.hasOwnProperty('type')) this.type = options.type;
  if (options.hasOwnProperty('size')) this.size = options.size;
  if (options.hasOwnProperty('canvas')) this.canvas = options.canvas;
  if (options.hasOwnProperty('drawContext')) this.drawContext = options.drawContext;
}
Obstacle.prototype = {
  checkCollision(particle) {
    var distance = this.calculateDistanceToCenter(particle);

    if (Math.abs(distance.xDist) <= this.size / 2 && Math.abs(distance.yDist) <= this.size / 2) {
      if (this.type === ObstacleType.BOUNCEY) {

        // TBC : Collision top or bottom
        if (particle.position.y <= this.position.y + particle.velocity.vy || particle.position.y >= this.position.y + this.size + particle.velocity.vy) {
          particle.velocity.vy = -particle.velocity.vy;
        }

        // TBC : Collision left or right
        if (particle.position.x < this.position.x + particle.velocity.vx || particle.position.x > this.position.x + this.size + particle.velocity.vx ) {
          particle.velocity.vx = -particle.velocity.vx;
        }
      } else {
        particle.velocity.vx = 0;
        particle.velocity.vy = 0;
      }
    }
  },
  draw() {
    this.type === ObstacleType.BOUNCEY ? this.drawContext.fillStyle = '#0f0' : this.drawContext.fillStyle = '#00f';
    this.drawContext.fillRect(this.position.x, this.position.y, this.size, this.size);
  },
  calculateDistanceToCenter(particle) {
    var distance = { xDist: 0, yDist: 0 };

    distance.xDist = particle.position.x - (this.position.x + this.size / 2);
    distance.yDist = particle.position.y - (this.position.y + this.size / 2);

    return distance;
  }
};

$(document).ready(function() {
  var app = new App();
});
