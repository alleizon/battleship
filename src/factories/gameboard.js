const Ship = require("../factories/ship.js");

class Gameboard {
  constructor() {
    this.grid = this.initBoard();
    this.attacks = [];
    this.ships = [];
  }

  initBoard() {
    const grid = [];

    for (let i = 0; i < 10; i += 1) {
      const row = [];
      for (let j = 0; j < 10; j += 1) {
        row.push(" ");
      }
      grid.push(row);
    }

    return grid;
  }

  isValid(x, y, length, direction) {
    if (direction === "horizontal")
      return x >= 0 && x <= 9 && y + length - 1 >= 0 && y + length - 1 <= 9;
    return x + length - 1 >= 0 && x + length - 1 <= 9 && y >= 0 && y <= 9;
  }

  gameOver() {
    return this.ships.every((ship) => ship.sunk);
  }

  placeShip(ship, start, direction) {
    const [x, y] = start;
    const validCoords = this.isValid(x, y, ship.length, direction);
    if (!validCoords) return;

    if (direction === "horizontal") {
      for (let i = 0; i < ship.length; i += 1) {
        this.grid[x][y + i] = ship;
      }
    } else {
      for (let i = 0; i < ship.length; i += 1) {
        this.grid[x + i][y] = ship;
      }
    }

    this.ships.push(ship);
  }

  receiveAttack(x, y) {
    if (this.attacks.includes(`${x}${y}`)) return;
    const cell = this.grid[x][y];
    if (cell instanceof Ship) cell.hit();
    else this.grid[x][y] = "X";
    this.attacks.push(`${x}${y}`);
  }
}

module.exports = Gameboard;
