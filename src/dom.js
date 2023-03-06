const Ship = require("./factories/ship.js");
const Game = require("./game.js");

const gameInProgress = require("./DOM_Helpers/inProgress.js");

const DOM = (() => {
  const [human, computer] = Game.newGame();

  gameInProgress.renderPlayer(human);
  gameInProgress.renderPlayer(computer);
})();

module.exports = DOM;
