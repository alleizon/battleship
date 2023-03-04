class Ship {
  static types = [
    { name: "carrier", length: 5 },
    { name: "battleship", length: 4 },
    { name: "cruiser", length: 3 },
    { name: "submarine", length: 3 },
    { name: "destroyer", length: 2 },
  ];

  constructor(typeObj) {
    this.name = typeObj.name;
    this.length = typeObj.length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits += 1;
    this.sunk = this.hits === this.length ? true : false;
  }

  isSunk() {
    return this.sunk;
  }
}

module.exports = Ship;
