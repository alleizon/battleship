const Player = require("./factories/player.js");
const Ship = require("./factories/ship.js");

const Game = (() => {
  let human;
  let computer;

  const reset = () => {
    human.board.reset();
    computer.board.reset();
  };

  const newGame = (ships) => {
    human = new Player("player");
    computer = new Player("computer");

    ships.forEach((element) => {
      human.board.placeShip(element.ship, element.start, element.direction);
    });

    return [human, computer];
  };

  const result = (cell, player, enemy) => {
    const isShip = cell instanceof Ship;

    return {
      ship: isShip ? cell : false,
      winner: enemy.board.shipsSunk() ? player : null,
      sunkCoord: isShip
        ? ((ship, grid) => {
            const coords = [];
            if (ship.isSunk()) {
              grid.forEach((row, i) => {
                row.forEach((col, j) => {
                  if (col === cell) coords.push([i, j]);
                });
              });
            }
            return coords.length ? coords : null;
          })(cell, enemy.board.grid)
        : null,
    };
  };

  const playHuman = (x, y) => {
    const cell = human.sendAttack(computer.board, x, y);
    return result(cell, human, computer);
  };

  const playComputer = () => {
    const cell = computer.sendAttack(human.board);
    return [result(cell[0], computer, human), cell[1], cell[2]];
  };

  return { reset, newGame, playHuman, playComputer };
})();

module.exports = Game;
