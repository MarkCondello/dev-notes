class Car {
  constructor(name, model) {
    this.name = name;
    this.model = model;
  }
  SetName(name) {
    this.name = name;
    console.log(`${this.name}`);
  }
  SetModel(model) {
    this.model = model;
    console.log(`${this.model}`);
  }
  clone() {
    return new Car(this.name, this.model); // this method creates a copy of the first created instance
  }
}

let car = new Car('Ford', 'XS');
console.log({car})
car.SetName('Holden');

let car2 = car.clone();
console.log({car2})
c//ar2.SetModel('SS');
car2.SetName('Ford');

// The prototype pattern is a creational design pattern in software development. It is used when the type of objects to create is determined by a prototypical instance, which is cloned to produce new objects.

