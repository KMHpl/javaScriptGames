function laser(spos){
    this.pos = createVector(spos.x,spos.y);
    this.vel = p5.Vector.fromAngle(ship.heading);
    this.vel.mult(10);
    this.remake = false;
    //this.rotation.mult(10);
    
    this.show = function(){
        //console.log(this.rotation.x)
        push();
        noFill();
        stroke(255);
        translate((this.rotation.x)*3,(this.rotation.y)*3);
        ellipse(this.pos.x,this.pos.y , 10, 10);
        pop();
        
    }
    this.shot = function(){ 
    this.rotation = this.vel;
    this.pos.add(this.vel);
    }
    this.delete = function(){
        
                    if(this.pos.x > width)
                        {
                           // return true;
                        }else if (this.pos.y > height)
                        {
                           // return true;        
                        }else if (this.pos.x < 0)
                        {
                            //return true;
                        }else if (this.pos.y < 0)
                        {
                            //return true;    
                        }
    }
    this.hits = function(xx){
       var distance =dist(this.pos.x,this.pos.y,xx.position.x,xx.position.y);
        
        if(distance < xx.r){
            return true;
        }else {
            return false;
        }
    }
    
}