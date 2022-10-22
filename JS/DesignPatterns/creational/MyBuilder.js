class House {
  constructor() {
    this.type = this.rooms = this.garageSpaces = '';
    this.address = this.postcode = this.city = '';
  }
  describe() {
    return `
    The ${this.type} home has ${this.rooms} rooms and ${this.garageSpaces} garage spaces.
    THis property is located at ${this.address}, ${this.postcode}, ${this.city}.`;
  }
}
class HouseBuilder {
  constructor(house = new House()){
    this.house = house;
  }
  get specs() {
    return new HouseBuilderSpecs(this.house); 
    // these getter classes needs a reference to the house object to be able to update it properly
  }
  get address() {
    return new HouseBuilderAddress(this.house);
  }
  build(){
    return this.house;
  }
}
class HouseBuilderSpecs extends HouseBuilder {
  constructor(house){
    super(house)
  }
  builderCo(co) {
    this.house.type = co;
    return this;
  }
  numberOfRooms(num) {
    this.house.rooms = num;
    return this;
  }
  numberOfGarageSpaces(num) {
    this.house.garageSpaces = num;
    return this;
  }
}
class HouseBuilderAddress extends HouseBuilder {
  constructor(house){
    super(house);
  }
  street(street) {
    this.house.address = street;
    return this;
  }
  postCode(pc) {
    this.house.postcode = pc;
    return this;
  }
  in(city) {
    this.house.city = city;
    return this;
  }
}

let houseBuilder = new HouseBuilder();
// console.log({houseBuilder})
let myHouse = houseBuilder
  .specs
    .builderCo('Henly Homes')
    .numberOfRooms('3')
    .numberOfGarageSpaces('2')
  .address
    .street('2 Marot Way')
    .postCode('3754')
    .in('Melbourne')
  .build();


console.log(myHouse.describe())
// let myHouse = 