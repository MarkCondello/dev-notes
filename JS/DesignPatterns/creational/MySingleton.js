class Singleton {
  constructor (name){
    let single = this.constructor.instance;
    if(single) {
      return single;
    }
    this.foo = name;
    this.constructor.instance = this;
  }
}

let s1 = new Singleton("s1")
let s2 = new Singleton("s2")

console.log({ s1, s2})