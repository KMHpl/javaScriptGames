function TinyFlap(cnvs) {
    
  
  
  this.colours = {
    '0' : "rgba(0,0,0,0.0)", 
    '1' : "#434343", 
    '2' : "#FFF", 
    '3' : "red", 
    '4' : "red", 
    '5' : "red",
    'A' : "#14AAB5",
    'B' : "#116D9C", 
    'K' : "#FF6A00", 
    'L' : "#BD540D", 
    'M' : "#2D2D2D", 
    '6' : "rgb(35,131,146)", 
    '7' : "#8DDE90", 
    '8' : "rgb(72,179,41)", 
    '9' : "rgb(49,147,96)", 
  };

  // The images to generate
  this.images = {
    bird : {
      width : 19,
      height : 14,
     
      data : [],
      scale : 1
    },
    bush : {
      width : 0,
      height : 0,
    
      data : [],
      scale : 30
    },
    logo : {
      width : 52,
      height : 11,
    
      data : [],
      scale : 3
    }
  };

  // Game states
  this.Modes = {
    WAIT : 0,
    PLAY : 1,
    RETRY : 2,
    DIE : 3
  };

  this.bird = {
    // Location
    x : 0,
    y : 0,
    speedX : 0,
    speedY : 0,
    gravity : 14,
    // Flap
    flap : false,
    flapPower :90,
    flaps : 6,
    flapCount : 0,
    // Stuff
    image : 0,
    swap : false,
    mode : 0,
    // Drift
    drift : 7,
    driftDir : 1 / 2,
    currentDrift : 0
  };

  this.pipes = {
    every : 80,
    width : 40,
    gap : 60,

    inView : [],
    cleared : 0,
    ground : 0
  };

  this.frames = {
    amount : 0,
    last : new Date(),
    current : 0,
  };

  this.font = {
    size : 5,
   
  };
}

// Make the images
TinyFlap.prototype.makeImages = function (cnvs, ctx) {
  for (var i in this.images) {
    var obj = this.images[i];

    obj.data = [];

    var newImage = document.createElement("img"); // Store image
        newImage.src = "bird.png";
          
        obj.data.push(newImage);

       ctx.clearRect(0, 0, cnvs.width, cnvs.height); // Reset for next image
  }
}

// Update the pipe infotmation
TinyFlap.prototype.pipeLoc = function () {
  var lastPipe = (this.canvas.width / 2) + this.pipes.every;

  // Relative position
  var birdBack = this.bird.x + (this.canvas.width / 2) + this.images.bird.scale;
  var birdFront = this.bird.x + (this.canvas.width / 2) + this.images.bird.data[this.bird.image].width - this.images.bird.scale;

  var birdTop = this.bird.y + this.images.bird.scale;
  var birdBottom = this.bird.y + this.images.bird.data[this.bird.image].height - this.images.bird.scale;

 // console.log(birdBottom + birdTop);

  // Update pipes
  for (var i in this.pipes.inView) {
    var cPipe = this.pipes.inView[i];

    // Update draw location
    cPipe.x = cPipe.acX - this.bird.x;
    lastPipe = cPipe.acX + this.pipes.width;

    // Check that it's within colision area
    if (birdFront - 10 > cPipe.acX && birdBack < lastPipe) {
      if (birdTop -16> cPipe.up && birdBottom < cPipe.down) {
        // The bird is between the pipe gap
      } else {
      
        this.bird.mode = this.Modes.DIE;
      }
    } else if (birdFront > lastPipe && !this.pipes.inView[i].passed) {
      cPipe.passed = true;
      this.pipes.cleared++;
    }

    // Don't draw this pipe anymore
    if (cPipe.x + this.pipes.width <= 0) {
      this.pipes.inView.splice(i, 1);
    }
  }

  // Check that there's enough pipes
  for (var i = 0; i < (4 - this.pipes.inView.length); i++) {
    // Y location for the pipe
    var diffMid = (Math.random() * (this.canvas.height / 2)); // Check it's in bounds

    if (diffMid < (this.pipes.gap / 2)) {
      diffMid += (this.pipes.gap / 2);
    } else if (diffMid > (this.pipes.ground + (this.pipes.gap / 2))) {
      diffMid -= (this.pipes.gap / 2);
    }

    var topPipe = diffMid - (this.pipes.gap / 2);
    var bottomPipe = diffMid + (this.pipes.gap / 2);

    // X location for the pipe
    var locX = lastPipe + this.pipes.every;
    var diffX = locX - this.bird.x;

    // Add pipe to the ones to draw
    this.pipes.inView.push({
      acX : locX,
      x : diffX,
      up : topPipe, // This should be the H of the top of the pipe
      down : bottomPipe, // This should be the Y of the bottom of the pipe
      passed : false
    });

    // Update last pipe
    lastPipe = locX + this.pipes.width;
  }
}

// KeyDown
TinyFlap.prototype.keyDown = function (event) {
  

    
    
  var keycode = event.keyCode;

  if (keycode == 32) {
      
    if (this.bird.mode == this.Modes.WAIT) {
      this.bird.mode = this.Modes.PLAY; // Start the game
    } else if (this.bird.mode == this.Modes.PLAY) {
      this.bird.flap = true; // Flap the bird
    } else if (this.bird.mode == this.Modes.RETRY) {
      this.bird.mode = this.Modes.WAIT; // Player wishes to retry
    }
  }
}

// Draw to the canvas
TinyFlap.prototype.draw = function (ctx) {
  // Draw the background
  ctx.fillStyle = this.colours["6"];
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Draw the pipe
    
   var heart = new Image();
    heart.src = "tubo.png";
    var pattern = ctx.createPattern( heart, "repeat" );


    
 ctx.fillStyle = "red";
  for (var i in this.pipes.inView) {
    var cPipe = this.pipes.inView[i];
    ctx.fillStyle = pattern;
        
    ctx.fillRect(cPipe.x, 15, this.pipes.width, cPipe.up); // Top one
    ctx.fillRect(cPipe.x, cPipe.down, this.pipes.width, this.pipes.ground); // Bottom one
  }

  // Draw the bird
  var midView = (ctx.canvas.width / 2) - (this.images.bird.data[this.bird.image].width / 2);
  ctx.drawImage(this.images.bird.data[this.bird.image + this.bird.swap], midView, this.bird.y);

  // Press to play
  ctx.fillStyle = "rgb(68,172,61)";

  if (this.bird.mode == this.Modes.WAIT) {
    ctx.drawImage(this.images.logo.data[0], (ctx.canvas.width / 2) - (this.images.logo.data[0].width / 2), (ctx.canvas.height / 4));

    var str = "Press Space to start!!!";
    ctx.fillText(str, (ctx.canvas.width / 2) - ((str.length / 4) * this.font.size)-20, (ctx.canvas.height / 2) + this.font.size + this.bird.drift + 20);
  } else if (this.bird.mode == this.Modes.RETRY) {
    var str = "Press Space to retry!!!";
    ctx.fillText(str, (ctx.canvas.width / 2) - ((str.length / 4) * this.font.size)-20, (ctx.canvas.height / 2)+ this.font.size + this.bird.drift + 20);
  }

  // Draw the score
  if (this.bird.mode != this.Modes.WAIT) {
    var str = this.pipes.cleared.toString();
      ctx.font="Verdana";
    ctx.fillText("S C O R E :     " + str, 3, 10);
     
  }

  // Draw the ground
  ctx.fillStyle = this.colours["8"];
  ctx.fillRect(0, ctx.canvas.height - 10, ctx.canvas.width, ctx.canvas.height);

  // Update the frame counter
  this.frames.amount++;
}
// This is the main function
TinyFlap.prototype.run = function () {
  this.draw(this.bufferContext); // Draw to the buffer
  this.update(this.bufferContext); // Update the game
  this.context.drawImage(this.buffer, 0, 0); // Draw buffer to canvas
}
// Update the game
TinyFlap.prototype.update = function (ctx) {
  var now = new Date();
  var diff = now - this.frames.last;

  if (this.bird.mode == this.Modes.PLAY) {
    // Detect location
    if (this.bird.y >= this.pipes.ground) {
    
      this.bird.mode = this.Modes.RETRY;
    } else {
      // Apply forces
      if (!this.bird.flap) {
        this.bird.speedY += this.bird.gravity / 60;
      } else {
        if (this.bird.flapCount < this.bird.flaps) {
          this.bird.speedY =  - (this.bird.flapPower / 60);
          this.bird.flapCount++;
        } else {
          this.bird.flapCount = 0;
          this.bird.flap = false;
        }
      }

      // Move the bird
      this.bird.x++;

      this.bird.y += this.bird.speedY;
    }

    // Update the pipes
    this.pipeLoc();
  } else if (this.bird.mode == this.Modes.WAIT) {
    if (Math.abs(this.bird.currentDrift)> this.bird.drift) {
      this.bird.driftDir = -this.bird.driftDir;
    }

    this.bird.y = ((ctx.canvas.height / 2) - (this.images.bird.data[this.bird.image].height / 2)) + this.bird.currentDrift;
    this.bird.currentDrift += this.bird.driftDir;

    this.bird.speedY = 0;
    this.bird.x = 0;
    this.pipes.inView = [];

    this.pipes.cleared = 0;
  } else if (this.bird.mode == this.Modes.DIE) {
    if (this.bird.y >= this.pipes.ground) { // Bird hit the ground
      this.bird.y = this.pipes.ground;
      this.bird.mode = this.Modes.RETRY;
    } else {
      if (this.bird.speedY < 0) {
        this.bird.speedY = 0;
      }

      this.bird.speedY += this.bird.gravity / 60;
      this.bird.y += this.bird.speedY;
    }
  }

 
  // The FPS
  if (diff.valueOf() >= 1000) {
    this.frames.current = this.frames.amount; // Store the curent frame count
    this.frames.last = now; // Update the last changed
    this.frames.amount = 0; // Reset
  }
}



TinyFlap.prototype.create = function (cnvs) {
  var game = this;
  

  // Create canvas
  game.canvas = document.getElementById(cnvs); // Store the canvas
  game.context = game.canvas.getContext("2d"); // Set up canvas
  
  // Set up buffer
  game.buffer = document.createElement("canvas"); // 'Double' buffer
  game.bufferContext = game.buffer.getContext("2d");

  // Make the graphics we will use
 
  game.makeImages(game.buffer, game.bufferContext);

  // Restore buffer
  game.buffer.height = game.canvas.height;
  game.buffer.width = game.canvas.width;

  // Set up ground
  game.pipes.ground = game.canvas.height - game.images.bird.data[game.bird.image].height - 9.5;

  // Key Information
  game.canvas.tabIndex = 0;
  document.addEventListener("keydown", function (event) {
    game.keyDown(event);
  });
    
   
    

  // Run the game
  setInterval(function () {
    game.run();
  }, 15);

 
}
