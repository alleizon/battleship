const Ship = require("./factories/ship.js");

const mock = (() => {
  const populateBoards = (humanB, computerB) => {
    let row = 0;
    Ship.types.forEach((ship) => {
      humanB.placeShip(new Ship(ship), [row, 0], "horizontal");
      computerB.placeShip(new Ship(ship), [row, 0], "horizontal");
      row += 1;
    });
  };

  return { populateBoards };
})();

module.exports = mock;
