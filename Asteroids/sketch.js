var ship;
var shoot = [];
var asteroids = [];
this.boosting=false;

function setup(){
    createCanvas(windowWidth-50,windowHeight-50);
    ship = new Ship();
    for (i=0;i<5;i++){
        asteroids.push(new Asteroids());
    }
}
function draw(){
background(0);
ship.show();
ship.turn();
ship.update();
    for (i=0;i<asteroids.length;i++){
        if (ship.hits(asteroids[i])){
            console.log("hits");
        }
        asteroids[i].show();
        asteroids[i].display();
        asteroids[i].update();
        }
    for (i=shoot.length-1;i>=0;i--){
        shoot[i].shot();
        shoot[i].show();
        shoot[i].delete();
    
        for (j = asteroids.length-1;j>=0;j--){
            if(shoot[i].hits(asteroids[j])){
                if(asteroids[j].r > 40)
                    {
                var newAsteroids = asteroids[j].breakup();
                asteroids = asteroids.concat(newAsteroids);
                }else{
                    console.log("point");
                }
                asteroids.splice(j,1);
                shoot.splice(i,1);
            break;
            }
        }

    }
}

function keyReleased(){
   ship.setRotation(0);
    ship.boosting(false);
}
function keyPressed(){
    if(keyCode == ENTER){
        shoot.push(new laser(ship.position)); 
        }
    if(keyCode == UP_ARROW){
        ship.boosting(true);
        ship.power();
    }
    if(keyCode == RIGHT_ARROW){
        //console.log("right");
        ship.setRotation(0.1);
    }
    if(keyCode == LEFT_ARROW){
        ship.setRotation(-0.1);
    }
}