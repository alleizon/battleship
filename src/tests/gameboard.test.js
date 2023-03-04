const Gameboard = require("../factories/gameboard.js");
const Ship = require("../factories/ship.js");

describe("Gameboard", () => {
  let board;

  let ship1;
  let ship2;
  let ship3;
  let ship4;

  beforeEach(() => {
    board = new Gameboard();

    ship1 = new Ship(Ship.types.find((ship) => ship.length === 5));
    ship2 = new Ship(Ship.types.find((ship) => ship.length === 4));
    ship3 = new Ship(Ship.types.find((ship) => ship.length === 3));
    ship4 = new Ship(Ship.types.find((ship) => ship.length === 2));
  });

  test("creates valid 10x10 board", () => {
    expect(board.grid.length).toBe(10);
    board.grid.forEach((row) => {
      expect(row.length).toBe(10);
    });
  });

  test("place ship at coordinates, horizontally", () => {
    const start = [9, 0];
    const direction = "horizontal";
    board.placeShip(ship4, start, direction);

    for (let i = 0; i < ship4.length; i += 1) {
      expect(board.grid[9][0 + i]).toBe(ship4);
    }
  });

  test("place ship at coordinates, vertically", () => {
    const start = [0, 0];
    const direction = "vertical";
    board.placeShip(ship3, start, direction);

    const col = [];
    for (let i = start[0]; i < ship3.length; i += 1) {
      col.push(board.grid[i][start[1]]);
    }

    expect(col).toEqual([ship3, ship3, ship3]);
  });

  test("rejects invalid coordinates horizontally", () => {
    const direction = "horizontal";

    board.placeShip(ship1, [9, 6], direction);
    board.placeShip(ship2, [9, 7], direction);
    board.placeShip(ship3, [9, 8], direction);
    board.placeShip(ship4, [9, 9], direction);

    expect(board.grid[9][7]).toBe(" ");
    expect(board.grid[9][8]).toBe(" ");
    expect(board.grid[9][9]).toBe(" ");
    expect(board.grid[9][9]).toBe(" ");
  });

  test("rejects invalid coordinates vertically", () => {
    board.placeShip(ship1, [6, 0], "vertical");
    board.placeShip(ship2, [7, 0], "vertical");
    board.placeShip(ship3, [8, 0], "vertical");
    board.placeShip(ship4, [9, 0], "vertical");

    expect(board.grid[9][0]).toBe(" ");
    expect(board.grid[8][0]).toBe(" ");
    expect(board.grid[7][0]).toBe(" ");
    expect(board.grid[6][0]).toBe(" ");
  });

  test("ships can receive hits", () => {
    board.placeShip(ship3, [5, 6], "horizontal");
    board.receiveAttack(5, 6);
    expect(board.grid[5][6].hits).toBe(1);
    board.receiveAttack(5, 6);
    expect(board.grid[5][6].hits).toBe(1);
    board.receiveAttack(5, 7);
    expect(board.grid[5][6].hits).toBe(2);
  });

  test("board tracks missed attacks", () => {
    board.receiveAttack(0, 0);
    expect(board.grid[0][0]).toBe("X");
  });

  test("report game over", () => {
    board.placeShip(ship2, [0, 0], "horizontal");
    board.receiveAttack(0, 0);
    board.receiveAttack(0, 1);
    board.receiveAttack(0, 2);
    expect(board.shipsLeft()).toBe(false);

    board.receiveAttack(0, 3);
    expect(board.shipsLeft()).toBe(true);
  });
});
