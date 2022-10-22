class Person { // not directly accessed
  constructor() {
    this.name = '';
    this.streetAddress = this.postcode = this.city = '';
    this.companyName = this.position = '';
    this.annualIncome = 0;
  }
  toString() {
    return (
      `${this.name} lives at ${this.streetAddress}, ${this.city}, ${this.postcode} 
      and works at ${this.companyName} as a ${this.position} earning ${this.annualIncome}.`
    )
  }
}
class PersonBuilder { // 
  constructor (person = new Person()) {
    this.person = person;
  }
  get identity() {
    return new PersonIdentityBuilder(this.person)
  }
  get lives() {
    return new PersonAddressBuilder(this.person)
  }
  get works() {
    return new PersonJobBuilder(this.person)
  }
  build() {
    return this.person;
  }
}
class PersonJobBuilder extends PersonBuilder {
  constructor(person){
    super(person)
  }
  at(companyName) {
    this.person.companyName = companyName;
    return this;
  }
  asA(position) {
    this.person.position = position;
    return this;
  }
  earning(annualIncome) {
    this.person.annualIncome = annualIncome
    return this;
  }
}
class PersonAddressBuilder extends PersonBuilder {
  constructor(person){
    super(person)
  }
  at(streetAddress) {
    this.person.streetAddress = streetAddress;
    return this;
  }
  withPostcode(postcode) {
    this.person.postcode = postcode;
    return this;
  }
  in(city) {
    this.person.city = city;
    return this;
  }
}
class PersonIdentityBuilder extends PersonBuilder{
  constructor(person){
    super(person)
  }
  name(name){
    this.person.name = name;
    return this;
  }
}

let noone = new Person();
noone.name= 'Nobody';
noone.streetAddress = '615 oh I forget..';
console.log({noone})
let personBuilder = new PersonBuilder(noone);
let person = personBuilder
// .identity
// .name('Mark Condelllo')
  .lives
  // .at('2 Marot Way Mernda')
  .withPostcode('3074')
  .in('Melbourne')
  .works
  .at('DcodeGroup')
  .asA('lacky')
  .earning('70k')
  .build();
console.log(person.toString())

// The builder pattern is a design pattern designed to provide a flexible solution to various object creation problems in object-oriented programming.

