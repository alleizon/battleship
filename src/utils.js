const Ship = require("./factories/ship.js");

const Utils = (() => {
  const populateBoards = (humanB, computerB) => {
    let row = 0;
    Ship.types.forEach((ship) => {
      humanB.placeShip(new Ship(ship), [row, 0], "horizontal");
      computerB.placeShip(new Ship(ship), [row, 0], "horizontal");
      row += 1;
    });
  };

  const legendHTML = () => `<p>Legend :</p>
  <div class="ship">
    <span>Ship</span>
    <div class="legend-ship"></div>
  </div>
  <div class="miss">
    <span>Missed hit</span>
    <div class="wrapper">
      Player <div class="legend-miss"></div>
      /
      Computer <div class="legend-hit"></div>
    </div>
  </div>
  <div class="hit">
    <span>Ship hit</span>
    <div class="wrapper">
      Player <div class="legend-hit"></div>
      /
      Computer <div class="legend-miss"></div>
    </div>
  </div>`;

  return { populateBoards, legendHTML };
})();

module.exports = Utils;
