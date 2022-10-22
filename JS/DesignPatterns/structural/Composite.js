class Employee {
  constructor(name, role) {
    this.name = name;
    this.role = role;
  }
  print() {
    console.log(`My name is ${this.name} and I am a ${this.role}.`)
  }
}

class EmployedGroup {
  constructor(name, group = []){
    this.name = name;
    this.group = group;
  }
  print() {
    console.log(`The ${this.name} group consists of:`)
      this.group.forEach(item => {
        item.print();
      });
  }
}

let lee = new Employee('Lee Stevens', 'SFED');
let mark = new Employee('Mark Condello', 'JFED');

let dcodeFEDs = new EmployedGroup('Front End Devs', [lee, mark]);
dcodeFEDs.print();
// The composite pattern describes a group of objects that are treated the same way as a single instance of the same type of object.

