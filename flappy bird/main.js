function FLappyBird(cnvs) {

  this.images={bird:{},};

  this.bird = {

    speed_y : 0,
    flap : false,
    flapCount : 0,
    image : 0,
    swap : false,
    Stan : 0,
    deley : 1/3,
    currentDrift : 0
  };

  this.wall = {
    SHOWN : [],
    cleared : 0,
  };

  this.count = {
    amount : 0,
    last : new Date(),
    current : 0,
  };

}


FLappyBird.prototype.makeImages = function (cnvs, ctx) {
    
  for (var i in this.images) {
    var obj = this.images[i];

    obj.data = [];

    var newImage = document.createElement("img"); 
      
        newImage.src = "bird.png";
          
        obj.data.push(newImage);
 
  }
}


FLappyBird.prototype.wallLoc = function () {
  var lastwall = (this.canvas.width) + 80;

  
  var Back = this.bird.x + (this.canvas.width / 2) + 1;
  var RIght = this.bird.x + (this.canvas.width / 2) + 18;

  var UP = this.bird.y + 1;
  var down = this.bird.y + 18;

 

 
  for (var i in this.wall.SHOWN) {
    var mur = this.wall.SHOWN[i];

    
    mur.x = mur.location - this.bird.x;
    lastwall = mur.location + 40;

    
    if (RIght > mur.location && Back < lastwall) {
      if (UP -16> mur.up && down < mur.down) {
        // The bird is between the wall gap
      } else {
      
        this.bird.Stan = 3;
      }
    } else if (RIght > lastwall && !this.wall.SHOWN[i].passed) {
      mur.passed = true;
      this.wall.cleared++;
    }

   
    if (mur.x + 40 <= 0) {
      this.wall.SHOWN.splice(i, 1);
    }
  }

  
  for (var i = 0; i < (3 - this.wall.SHOWN.length); i++) {
   
    var Srodek_wala = (Math.random() * (this.canvas.height / 3)); 
    if (Srodek_wala < 35) {
      Srodek_wala += 35;
    } else if (Srodek_wala > (this.wall.ground + 35)) {
      Srodek_wala -= 35;
    }

    var topwall = Srodek_wala - 35;
    var bottomwall = Srodek_wala + 35;

   
    var pozycja_x = lastwall + 80;
    var xxx = pozycja_x - this.bird.x;

 
    this.wall.SHOWN.push({
      location : pozycja_x,
      x : xxx,
      up : topwall,
      down : bottomwall,
      passed : false
    });

  
    lastwall = pozycja_x + 40;
  }
}

FLappyBird.prototype.keyDown = function (event) {
  

    
    
  var keycode = event.keyCode;

  if (keycode == 32) {
    if (this.bird.Stan == 0) {
      this.bird.Stan = 1; 
    } else if (this.bird.Stan == 1) {
      this.bird.flap = true; 
    } else if (this.bird.Stan == 2) {
      this.bird.Stan = 0; 
    }
  }
}

FLappyBird.prototype.draw = function (ctx) {
  // Draw the background
  ctx.fillStyle = "rgb(35,131,146)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = "green";
  for (var i in this.wall.SHOWN) {
    var mur = this.wall.SHOWN[i];
 
        
    ctx.fillRect(mur.x, 15, 40, mur.up); // (x,y,width,height)
    ctx.fillRect(mur.x, mur.down, 40, this.wall.ground); // 
  }

  ctx.drawImage(this.images.bird.data[this.bird.image], (ctx.canvas.width / 2) - 12, this.bird.y);

  ctx.fillStyle = "rgb(68,172,61)";

  if (this.bird.Stan == 0) {
    var str = "Press Space to start!!!";
    ctx.fillText(str, (ctx.canvas.width / 2) - ((str.length / 4) * 5)-20, (ctx.canvas.height / 2)+ 27);
  } else if (this.bird.Stan == 2) {
    var str = "Press Space to retry!!!";
    ctx.fillText(str, (ctx.canvas.width / 2) - ((str.length / 4) * 5)-20, (ctx.canvas.height / 2)+ 27);
  }
if (this.bird.Stan != 0) {
    var str = this.wall.cleared.toString();
      ctx.font="Verdana";
    ctx.fillText("S C O R E :     " + str, 3, 10);
     
  }
 ctx.fillStyle = "rgb(72,179,41)";
  ctx.fillRect(0, ctx.canvas.height - 10, ctx.canvas.width, ctx.canvas.height);
this.count.amount++;
}
FLappyBird.prototype.update = function (ctx) {
 
    var now = new Date();
    
    var uppp = now - this.count.last;

  if (this.bird.Stan == 1) 
  
  {
    
    if (this.bird.y >= this.wall.ground) {
    
      this.bird.Stan = 2;
    } else {
    
      if (!this.bird.flap) {
        this.bird.speed_y += 14 / 60;
      } else {
        if (this.bird.flapCount < 6) {
          this.bird.speed_y =  - (90 / 60);
          this.bird.flapCount++;
        } else {
          this.bird.flapCount = 0;
          this.bird.flap = false;
        }
      }
      this.bird.x++;

      this.bird.y += this.bird.speed_y;
    }

    // Update the wall
    this.wallLoc();
  } else if (this.bird.Stan == 0) {
    if (Math.abs(this.bird.currentDrift)> 7) {
      this.bird.deley = -this.bird.deley;
    }

    this.bird.y = ((ctx.canvas.height / 2) - (this.images.bird.data[this.bird.image].height / 2)) + this.bird.currentDrift;
    this.bird.currentDrift += this.bird.deley;

    this.bird.speed_y = 0;
    this.bird.x = 0;
    this.wall.SHOWN = [];

    this.wall.cleared = 0;
  } else if (this.bird.Stan == 3) 
  {
 if (this.bird.y >= this.wall.ground) 
 { // Bird hit the ground
      this.bird.y = this.wall.ground;
      this.bird.Stan = 2;
 }else
 {
    if (this.bird.speed_y < 0) 
    {
     this.bird.speed_y = 0;
    }

      this.bird.speed_y += 14 / 60;
      this.bird.y += this.bird.speed_y;
 }
 }

 
  // The FPS
  if (uppp.valueOf() >= 1000) {
    this.count.current = this.count.amount; // Store the curent frame count
    this.count.last = now; // Update the last changed
    this.count.amount = 0; // Reset
  }
}

FLappyBird.prototype.create = function (cnvs) {
  var Create = this;
  document.addEventListener("keydown", function (event) {
    Create.keyDown(event);
  });

 
  Create.canvas = document.getElementById(cnvs); 
  Create.xd = Create.canvas.getContext("2d");
  Create.buffer = document.createElement("canvas"); 
  Create.bufferContext = Create.buffer.getContext("2d");
  Create.makeImages(Create.buffer, Create.bufferContext);
  Create.buffer.height = Create.canvas.height;
  Create.buffer.width = Create.canvas.width;
  Create.wall.ground = Create.canvas.height - (20/100)*Create.canvas.height;
  Create.canvas.tabIndex = 0;
  
              setInterval(function () {
                        Create.go();
                }, 15);

}

FLappyBird.prototype.go = function () {
  this.draw(this.bufferContext); 
  this.update(this.bufferContext); 
  this.xd.drawImage(this.buffer, 0, 0);
}