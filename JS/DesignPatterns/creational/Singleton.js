class Singleton {
  constructor(name = 'Singleton') { // can still use the constructor for the first instance
    const instance = this.constructor.instance;
    if(instance) {
      return instance;
    }
    this.name = name;
    this.constructor.instance = this;
  }
  say() {
    console.log(`This is the ${this.name} singleton class...`)
  }
}

let s1 = new Singleton('Foo');
let s2 = new Singleton('Barr');
console.log('Are the instances identical: ' + (s1 === s2), {s1, s2})
s1.say()

// In software engineering, the singleton pattern is a software design pattern that restricts the instantiation of a class to one “single” instance. This is useful when exactly one object is needed to coordinate actions across the system.

