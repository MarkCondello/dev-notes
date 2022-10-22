class Drink {
  consume() {} // contract
}
class Tea extends Drink {
  consume(id = 0) {
    console.log("Consume tea..", id)
  }
}
class Coffee extends Drink {
  consume() {
    console.log("Consume coffee..")
  }
}
class DrinkFactory {
  constructor() {
    this.amount = 0;
  }
  prepare(amount) {
    this.amount = amount
  } 
}
class TeaFactory extends DrinkFactory {
  makeTea() {
    console.log(this.amount, "tea instances being created..." );
    if(this.amount > 0){
      let teas = [];
      for(let i = 0; i < this.amount; i++){
        teas.push(new Tea());
      }
      return teas;
    }
    return new Tea();
  }
}
class CoffeeFactory extends DrinkFactory {
  makeCoffee() {
    console.log("Coffee created");
    return new Coffee();
  }
}
let teaFctry = new TeaFactory();
teaFctry.prepare(4) // used for more than 1 teas item
let teas = teaFctry.makeTea();
//teas.consume() // used for single tea object
 console.log({teaFctry, teas})
 teas.forEach((tea, id) => tea.consume(id + 1))

//  The abstract factory pattern provides a way to encapsulate a group of individual factories that have a common theme without specifying their concrete classes

