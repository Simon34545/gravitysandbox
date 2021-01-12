class CelestialBody {
  constructor() {
    //extra
    this.position = undefined;
    this.color = undefined;
    this.stroke = undefined;
    this.showName = undefined;
	this.trails = undefined;
	this.trail = undefined;
	this.maxTrails = undefined;
	this.trailColor = undefined;
	this.fadeTrails = undefined;
	this.locked = undefined;
	this.id = undefined;
	this.prevPosition = undefined;
    // normal
    this.radius = undefined;
    this.surfaceGravity = undefined;
    this.initialVelocity = undefined;
    this.bodyName = "Unnamed";
    
    this.velocity = undefined;
    this.mass = undefined;
    
    this.Awake = function() {
      this.velocity = createVector(this.initialVelocity.x, this.initialVelocity.y);
      this.OnValidate();
	  //extra
	  this.prevPosition = this.position;
	  this.id = Math.max(Math.random() * 1000, Math.round(new Date().getTime() * Math.random()));
	  if (this.maxTrails == undefined) {
		this.maxTrails = 1;  
	  }
    }
    
    this.UpdateVelocity = function(acceleration, timeStep) {
      this.velocity.add(p5.Vector.mult(acceleration, timeStep));
    }
    
    this.UpdatePosition = function(timeStep) {
	  //extra
	  this.prevPosition = this.position;
	  if (this.trail) {
		this.trails.push({x: this.position.x, y: this.position.y});
	    if (this.trails.length > this.maxTrails) {
		  this.trails.shift();
	    }  
	  } else if (this.trails != []) {
		  this.trails = [];
	  }
	  
	  if (!this.locked) {
		//normal
		this.position.add(p5.Vector.mult(createVector(this.velocity.x, this.velocity.y), timeStep));
		//extra
	  }
    }
    
    this.OnValidate = function() {
      this.mass = this.surfaceGravity * this.radius * this.radius / Universe.gravitationalConstant;
    }
  }
}