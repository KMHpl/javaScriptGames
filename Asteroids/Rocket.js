function Ship(){
    this.r = 40;
    this.heading = 0;
    this.rotation = 0;
    this.position = createVector(width/2,height/2);
    this.velocity = createVector(0,0);
        this.update = function(){
            this.position.add(this.velocity);
            this.velocity.mult(0.99);
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
            if (this.isboosting){
                this.power();
                
            }
            
           // this.velocity.mult(0.99);
        }
        this.hits = function(asteroid){
            var d = dist(this.position.x,this.position.y,asteroid.position.x,asteroid.position.y)
            if (d < this.r/2 + asteroid.r)
                {
                    return true;
                    
                }else
                {
                    return false;
                }
        }
        
        this.power =function(){
            var force = p5.Vector.fromAngle(this.heading);
            force.mult(0.4);
            this.velocity.add(force);
            
        }
        this.boosting = function(b){
            this.isboosting = b;
        }
        
        
        this.show = function(){
            push();
            translate(this.position.x,this.position.y);
            rotate(this.heading+ PI /2);
            noFill();
            stroke(255);
            triangle(-this.r,this.r,this.r,this.r,0,-this.r)
            pop();

        }
        this.setRotation = function(a){
            this.rotation = a;
        }
        this.turn = function(a){
            this.heading += this.rotation;
        }
        
}