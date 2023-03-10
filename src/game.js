const Player = require("./factories/player.js");
const mock = require("./mock.js");

const Game = (() => {
  const human = new Player("player");
  const computer = new Player("computer");

  const reset = () => {
    human.board.reset();
    computer.board.reset();
  };

  const newGame = (ships) => {
    reset();

    mock.populateBoards(computer.board); // randomise

    ships.forEach((element) => {
      human.board.placeShip(element.ship, element.start, element.direction);
    });

    return [human, computer];
  };

  const playHuman = (x, y) => {
    const cell = human.sendAttack(computer.board, x, y);
    if (computer.board.shipsSunk())
      return { winner: human, loser: computer, cell };
    return cell;
  };

  const playComputer = () => {
    const result = computer.sendAttack(human.board);
    if (human.board.shipsSunk())
      return { winner: computer, loser: human, result };
    return result;
  };

  return { reset, newGame, playHuman, playComputer };
})();

module.exports = Game;
