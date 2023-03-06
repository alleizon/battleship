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

  const playTurn = (x, y) => {
    const enemy = currentPlayer === human ? computer : human;
    currentPlayer.sendAttack(enemy.board, x, y);
    currentPlayer = currentPlayer === human ? computer : human;

    // console.log(human, computer);
  };

  return { isOver, newGame, playTurn };
})();

module.exports = Game;
