const Ship = require("../factories/ship.js");

describe("Ship", () => {
  test("is instantiated correctly", () => {
    const ship = new Ship(Ship.types[4]);
    expect(ship.length).toBe(2);
    expect(ship.hits).toBe(0);
    expect(ship.isSunk()).toBe(false);
  });

  test("can take hits", () => {
    const ship = new Ship(4);
    ship.hit();
    expect(ship.hits).toBe(1);
  });

  test("can be sunk", () => {
    const ship = new Ship(Ship.types.find((shipO) => shipO.length === 2));
    expect(ship.isSunk()).toBe(false);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
  });
});
