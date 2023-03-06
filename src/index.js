const Game = require("./game.js");
const DOM = require("./dom.js");

const [human, computer] = Game.newGame();
DOM.renderPlayer(human);
DOM.renderPlayer(computer);
