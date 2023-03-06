const Player = require("./factories/player.js");
const Utils = require("./utils.js");

const Game = (() => {
  const human = new Player("player");
  const computer = new Player("computer");

  let currentPlayer;

  const isOver = () => currentPlayer.board.shipsSunk();

  const newGame = () => {
    human.board.reset();
    computer.board.reset();

    Utils.populateBoards(human.board, computer.board); // to remove. add placement

    currentPlayer = human;

    return [human, computer]; // to remove
  };

  const playHuman = (x, y) => {
    console.log(human, computer);
    const cell = human.sendAttack(computer.board, x, y);
    return cell;
  };

  const playComputer = () => {
    const result = computer.sendAttack(human.board);
    return result;
  };

  return { isOver, newGame, playHuman, playComputer };
})();

module.exports = Game;
