class Ship {
  types = {
    carrier: 5,
    battleship: 4,
    cruiser: 3,
    submarine: 3,
    destroyer: 2,
  };

  constructor(length) {
    this.length = length;
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
