class Shape {
  constructor(color) {
    this.color = color;
  }
}
class Circle extends Shape {
  constructor(radius = 0, unit = 'px') {
    super();
    this.radius = radius;
    this.unit = unit;
  }
  resize(factor) {
    this.radius *= factor;
  }
  toString() {
    return `A ${this.radius}${this.unit} circle`;
  }
}
class ColoredShape extends Shape {
  constructor(shape, color) {
    super();
    this.shape = shape;
    this.color = color;
  }
  toString() {
    return `${this.shape.toString()} has a ${this.color} color.`;
  }
}

let standardCircle = new Circle(25);
console.log(standardCircle.toString(), {standardCircle});
console.log('---Decorator applied below---')
let redCircle = new ColoredShape(standardCircle, 'red');
console.log(redCircle.toString(), {redCircle});
// The decorator pattern is a design pattern that allows behavior to be added to an individual object, dynamically, without affecting the behavior of other objects from the same class.

