class CircleRenderer {
  renderCircle() {} // contract
}
class VectorRenderer extends CircleRenderer { // should there be a contract for these???
  renderCircle(radius) {
    console.log(`Drawing a vector circle of radius ${radius}`);
  }
}
class RasterRenderer extends CircleRenderer { // should there be a contract for these???
  renderCircle(radius) {
    console.log(`Drawing pixels for a raster circle of radius ${radius}`);
  }
}

class Shape { // this is the bridge class
  constructor(renderer) {
    this.renderer = renderer; // this requires either a VectorRenderer or RasterRenderer
  }
}

class Circle extends Shape {
  constructor(renderer, radius) {
    super(renderer);
    this.radius = radius;
  }
  draw() {
    this.renderer.renderCircle(this.radius); // this inherits from the renderer which each has a renderCircle method 
  }
  resize(factor) {
    this.radius *= factor;
    this.draw();
  }
}

let vector = new VectorRenderer()
let raster = new RasterRenderer()
let circleV = new Circle(vector, 5)
let circleR = new Circle(raster, 3)
circleV.draw()
circleV.resize(10)
console.log('------')
circleR.draw()
circleR.resize(5)

// Bridge is a structural design pattern that lets you split a large class or a set of closely related classes into two separate hierarchies — abstraction and implementation — which can be developed independently of each other.

