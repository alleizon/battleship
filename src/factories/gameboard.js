const Ship = require("./ship.js");

class Gameboard {
  constructor() {
    this.grid = Gameboard.initBoard();
    this.attacks = [];
    this.ships = [];
  }

  reset() {
    this.grid = Gameboard.initBoard();
  }

  static initBoard() {
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

  static isValidCoords(x, y) {
    return x >= 0 && y >= 0 && x <= 9 && y <= 9;
  }

  static isValidShipPlacemenet(x, y, length, direction) {
    if (direction === "horizontal")
      return x >= 0 && x <= 9 && y + length - 1 >= 0 && y + length - 1 <= 9;
    return x + length - 1 >= 0 && x + length - 1 <= 9 && y >= 0 && y <= 9;
  }

  shipsSunk() {
    return this.ships.every((ship) => ship.sunk);
  }

  placeShip(ship, start, direction) {
    const [x, y] = start;
    const validCoords = Gameboard.isValidShipPlacemenet(
      x,
      y,
      ship.length,
      direction
    );
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
    if (!Gameboard.isValidCoords(x, y)) return;
    if (this.attacks.includes(`${x}${y}`)) return;
    const cell = this.grid[x][y];
    if (cell instanceof Ship) cell.hit();
    else this.grid[x][y] = "X";
    this.attacks.push(`${x}${y}`);
  }
}

module.exports = Gameboard;
