function Asteroids(pos ,promien){
  //console.log("works");
  this.x = random(width);
  this.y = random(height);
  this.velocity = p5.Vector.random2D();
    if(pos){
        this.position = pos.copy();
    }else{
        this.position = createVector(this.x,this.y);
    }
         
    if (promien){
            this.r = promien*0.5;
        }else{
            this.r = random(20,150);
        }
                 this.show = function() {
                    if(this.position.x > width)
                        {
                            this.position.x=0;
                        }else if (this.position.y > height)
                        {
                            this.position.y=0;        
                        }else if (this.position.x < 0)
                        {
                            this.position.x=width;
                        }else if (this.position.y < 0)
                        {
                            this.position.y=height;
                        }
              
            };

            this.breakup = function(){
                var newArry = [];
                newArry[0]= new Asteroids(this.position, this.r);
                newArry[1]= new Asteroids(this.position, this.r);
                return newArry;

            }
    
            this.update = function(){
                this.position.add(this.velocity);
            }
            
            this.shot = function(){
                push();
                noFill();
                stroke(255);
                //translate(this.position.x,this.position.y);
                ellipse(ship.position.x,ship.position.y , 10, 10);
                pop();
            }

            this.display = function() {
                push();
                noFill();
                stroke(255);
                translate(this.position.x,this.position.y);
                ellipse(0, 0, this.r, this.r);
                pop();
            };
};