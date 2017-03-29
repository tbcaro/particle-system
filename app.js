/*
  TBC : ObstacleType functions like an enumeration to distinguish obstacles and their appropriate behaviors
*/
const ObstacleType = {
  BOUNCEY: 'bouncey',
  STICKY: 'sticky'
};

/*
  TBC : The App object is responsible for handling page elements, even handlers, and simulation management
  such as seeding the simulation with particles and obstacles. This specific app is used to configure this
  version of the simulation.
*/
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
  /*
    TBC : Bind event handlers to buttons and inputs
  */
  bindEventHandlers() {
    /*
      TBC : When the 'start' button is clicked, if the simulation has not been initialized, initialize it and begin
      the simulation. If the simulation is only paused, resume with current state.
    */
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
    /*
      TBC : When the 'stop' button is clicked, pause the simulation
    */
    this.elements.btnStop.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      this.simulation.stop();
    });
    /*
      TBC : When the 'reload' button is clicked, stop the simulation and reset the simulation state to an 'uninitialized' state.
    */
    this.elements.btnReload.on('click', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      this.simulation.reload();
    });
    /*
      TBC : When the x-acceleration is changed, update the simlulation's acceleration coefficient
    */
    this.elements.txtXAcceleration.on('change', () => { // TBC : Use arrow function to maintain correct reference of 'this'
      try {
        var xAccel = Number.parseFloat(this.elements.txtXAcceleration.val());
        this.simulation.setXAccel(xAccel);
      } catch (ex) {
        console.log(ex);
        alert(ex.message);
      }
    });
    /*
      TBC : When the y-acceleration is changed, update the simlulation's acceleration coefficient
    */
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
  /*
    TBC : Load intial particles, in the center position, with randomized velocities to 'explode' in all directions
  */
  loadInitialParticles() {
    var particles = [];
    var particleCount = this.elements.txtParticleCount.val()

    for (var i = 0; i < particleCount; i++) {
      var p = new Particle({
        position: { x: this.elements.canvas.width / 2, y: this.elements.canvas.height / 2},
        velocity: { vx: 8 * Math.random() - 4, vy: 8 * Math.random() - 4 },
        canvas: this.elements.canvas,
        drawContext: this.context
      });

      particles.push(p);
    }

    return particles;
  },
  /*
    TBC : Load initial obstacles, staticly positioned in corners and sides
  */
  loadInitialObstacles() {
    var obstacles = [];
    const STICKY_SIZE = 200;
    const BOUNCEY_SIZE = 40;

    obstacles.push(new Obstacle({
      position: {
        x: 0,
        y: 0
      },
      type: ObstacleType.STICKY,
      size: STICKY_SIZE,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    obstacles.push(new Obstacle({
      position: {
        x: this.elements.canvas.width - STICKY_SIZE,
        y: 0
      },
      type: ObstacleType.STICKY,
      size: STICKY_SIZE,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    obstacles.push(new Obstacle({
      position: {
        x: 0,
        y: this.elements.canvas.height - STICKY_SIZE
      },
      type: ObstacleType.STICKY,
      size: STICKY_SIZE,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    obstacles.push(new Obstacle({
      position: {
        x: this.elements.canvas.width - STICKY_SIZE,
        y: this.elements.canvas.height - STICKY_SIZE
      },
      type: ObstacleType.STICKY,
      size: STICKY_SIZE,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    obstacles.push(new Obstacle({
      position: {
        x: 20,
        y: this.elements.canvas.height / 2 - (BOUNCEY_SIZE / 2)
      },
      type: ObstacleType.BOUNCEY,
      size: BOUNCEY_SIZE,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    obstacles.push(new Obstacle({
      position: {
        x: this.elements.canvas.width - (BOUNCEY_SIZE / 2) - BOUNCEY_SIZE,
        y: this.elements.canvas.height / 2 - (BOUNCEY_SIZE / 2)
      },
      type: ObstacleType.BOUNCEY,
      size: BOUNCEY_SIZE,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    obstacles.push(new Obstacle({
      position: {
        x: this.elements.canvas.width / 2 - (BOUNCEY_SIZE / 2),
        y: (BOUNCEY_SIZE / 2)
      },
      type: ObstacleType.BOUNCEY,
      size: BOUNCEY_SIZE,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    obstacles.push(new Obstacle({
      position: {
        x: this.elements.canvas.width / 2 - (BOUNCEY_SIZE / 2),
        y: this.elements.canvas.height - (BOUNCEY_SIZE / 2) - BOUNCEY_SIZE,
      },
      type: ObstacleType.BOUNCEY,
      size: BOUNCEY_SIZE,
      canvas: this.elements.canvas,
      drawContext: this.context
    }));

    return obstacles;
  }
};

/*
  TBC : The Simulation object is responsible for the control flow of executing the simulation.
  The simulation is the object with the necessary context of the particles and obstacles, and
  implements the algorithm for advancing and tracking frames as well as calling the draw()
  methods of its particles and obstacles.
*/
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
  /*
    TBC : begin execution of simulation
  */
  start() {
    this.started = true;
    this.running = true;
    window.requestAnimationFrame(() => { this.run(); }); // TBC : Use arrow function to maintain correct reference of 'this'
  },
  /*
    TBC : stop execution and reset simulation state
  */
  reload() {
    this.drawContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particleAcceleration = { xAccel: 0, yAccel: 0 };
    this.particles = [];
    this.obstacles = [];
    this.started = false;
    this.running = false;
  },
  /*
    TBC : stop execution, but maintain simulation state. Effectively 'pause'.
  */
  stop() {
    this.running = false;
  },
  /*
    TBC : Ensure the simulation has been initialized and is running, and loop to advance frames
  */
  run() {
    if (this.started && this.running) {
      this.tick();
      window.requestAnimationFrame(() => { this.run(); }); // TBC : Use arrow function to maintain correct reference of 'this'
    }
  },
  /*
    TBC : Perform single frame update, updating particle positions, checking for collisions, performing any acceleration operations
    on the particles, and ultimately rendering the particles and obstacles to the canvas.
  */
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
  setXAccel(xAccel) { this.particleAcceleration.xAccel = xAccel; },
  setYAccel(yAccel) { this.particleAcceleration.yAccel = yAccel; },
  setParticles(particles) { this.particles = particles; },
  setObstacles(obstacles) { this.obstacles = obstacles; },
};

/*
  TBC : Particle object represents a particle in the system. A particle has the necessary properties
  to calculate where and how to draw itself as well as update its position to move.
*/
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
  /*
    TBC : Move the particle and bounce off of boundary walls
  */
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
  /*
    TBC : Draw the particle to the canvas
  */
  draw() {
    this.drawContext.fillStyle = this.color;
    this.drawContext.beginPath();
    this.drawContext.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    this.drawContext.fill();
  },
  /*
    TBC : Accelerate the particle velocity based on acceleration coefficients
  */
  accelerate(acceleration) {
    this.velocity.vx += acceleration.xAccel;
    this.velocity.vy += acceleration.yAccel;
  }
};

/*
  TBC : Obstacles represent objects in the environment, in which the particles interact with
*/
function Obstacle(options) {
  this.position = { x:0, y:0 };
  this.type = ObstacleType.BOUNCEY;
  this.size = 5;
  this.canvas = $('#canvas')[0];
  this.drawContext = this.canvas.getContext('2d');
  this.particlesCollided = 0;

  if (options.hasOwnProperty('position')) this.position = options.position;
  if (options.hasOwnProperty('type')) this.type = options.type;
  if (options.hasOwnProperty('size')) this.size = options.size;
  if (options.hasOwnProperty('canvas')) this.canvas = options.canvas;
  if (options.hasOwnProperty('drawContext')) this.drawContext = options.drawContext;
}
Obstacle.prototype = {
  /*
    TBC : check collision with specific particle.
    Collision is calculating the distance between center points of the particle and the obstacle.
    If the center point of the particle is within the boundary of the obstacle, a collision has occurred.
    BOUNCEY obstacles will reverse the velocity based on which side the particle is colliding from.
    STICKY obstacles will cause the particles to stop, and also will decrease it's own size over after enough collisions.
  */
  checkCollision(particle) {
    var distance = this.calculateDistanceToCenter(particle);

    if (Math.abs(distance.xDist) <= this.size / 2 && Math.abs(distance.yDist) <= this.size / 2) {
      // TBC : Check if particle is not stationary. Do not count 'stuck' particles are collisions.
      if (particle.velocity.vx !== 0 || particle.velocity.vy !== 0) {
        this.particlesCollided++;
      }

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
        if (this.particlesCollided % 20 === 0) {
          var step = 20;
          this.position.x += step;
          this.position.y += step;

          (this.size - (step * 2) <= 0) ? this.size = 0 : this.size -= step * 2;
        }
        particle.velocity.vx = 0;
        particle.velocity.vy = 0;
        particle.color = '#f00000';
      }
    }
  },
  /*
    TBC : Draw obstacle to screen.
  */
  draw() {
    this.type === ObstacleType.BOUNCEY ? this.drawContext.fillStyle = '#ccff00' : this.drawContext.fillStyle = '#00ccff';
    this.drawContext.fillRect(this.position.x, this.position.y, this.size, this.size);
  },
  /*
    TBC : Calculate the distance between obstacle center and particle center
  */
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
