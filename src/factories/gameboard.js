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

  static random(board) {
    let placedShips = 0;
    while (placedShips < 5) {
      const rnd = Math.floor(Math.random() * 2);
      const direction = rnd ? "vertical" : "horizontal";
      const ship = new Ship(Ship.types[placedShips]);
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const isShip = board.placeShip(ship, [x, y], direction);
      if (isShip) placedShips += 1;
    }
  }

  static initBoard() {
    const grid = [];

    for (let i = 0; i < 10; i += 1) {
      const row = [];
      for (let j = 0; j < 10; j += 1) {
        row.push("");
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
    if (!validCoords) return null;
    const addedShips = [];
    if (direction === "horizontal") {
      for (let i = 0; i < ship.length; i += 1) {
        if (!(this.grid[x][y + i] instanceof Ship)) {
          addedShips.push([x, y + i]);
        }
      }
    } else {
      for (let i = 0; i < ship.length; i += 1) {
        if (!(this.grid[x + i][y] instanceof Ship)) {
          addedShips.push([x + i, y]);
        }
      }
    }
    if (addedShips.length === ship.length) {
      addedShips.forEach((coords) => {
        const [nx, ny] = coords;
        this.grid[nx][ny] = ship;
      });
      this.ships.push(ship);
      return ship;
    }
    return null;
  }

  receiveAttack(x, y) {
    if (!Gameboard.isValidCoords(x, y)) return new Error("invalid coordinates");
    if (this.attacks.includes(`${x}${y}`))
      return new Error("attack already occured");
    const cell = this.grid[x][y];
    if (cell instanceof Ship) cell.hit();
    else this.grid[x][y] = "X";
    this.attacks.push(`${x}${y}`);
    return cell;
  }
}

module.exports = Gameboard;
