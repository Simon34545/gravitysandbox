class NBodySimulation {
  constructor() {
    this.bodies = [];
    
    this.FixedUpdate = function() {
      for (let i = 0; i < this.bodies.length; i++) {
        const acceleration = this.CalculateAcceleration(this.bodies[i].position, this.bodies[i]);
        this.bodies[i].UpdateVelocity(acceleration, Universe.physicsTimeStep);
      }
      
      for (let i = 0; i < this.bodies.length; i++) {
        this.bodies[i].UpdatePosition(Universe.physicsTimeStep);
      }
    }
    
    this.CalculateAcceleration = function(point, ignoreBody) {
      let acceleration = createVector();
      for (var index in this.bodies) {
        var body = this.bodies[index];
        if (body != ignoreBody) {
          const sqrDst = p5.Vector.sub(body.position, point).magSq();
          const forceDir = p5.Vector.sub(body.position, point).normalize();
          acceleration.add(p5.Vector.div(p5.Vector.mult(p5.Vector.mult(forceDir, Universe.gravitationalConstant), body.mass), sqrDst));
        }
      }
      
      return acceleration;
    }
  }
}