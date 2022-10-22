class CPU {
  freeze() {console.log('Freezed...')}
  jump(position) {console.log(`Go ${position}...`)}
  execute() {console.log('Run...')}
}
class Memory {
  load(position, data) {console.log(`Loading ${position} with ${data}...`)}
}
class HardDrive {
  read(lba, size) {console.log(`Reading ${lba} lba with a size of ${size}...`); return (`${lba} ${size}`)}
}

class ComputerFacade {
  constructor(bootAddress, bootSector, sectorSize){
    this.processor = new CPU();
    this.ram = new Memory();
    this.hd = new HardDrive();

    this.bootAddress = bootAddress;
    this.bootSector = bootSector;
    this.sectorSize = sectorSize;
  }
  start() {
    this.processor.freeze();
    this.ram.load(this.bootAddress, this.hd.read(this.bootSector, this.sectorSize))
    this.processor.jump(this.bootAddress)
    this.processor.execute();
  }
}

let mac = new ComputerFacade('D drive', 'Other', '80Gig')
mac.start();

// The facade pattern (also spelled façade) is a software-design pattern commonly used in object-oriented programming. Analogous to a facade in architecture, a facade is an object that serves as a front-facing interface masking more complex underlying or structural code.

