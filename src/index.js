const BuildBoard = require("./DOM_Helpers/buildPlayerBoard.js");
const GameInProgress = require("./DOM_Helpers/inProgress.js");

function control() {
  const start = BuildBoard.init();
  document
    .querySelector("body#build-player-board > .buttons > button.start")
    .addEventListener("click", () => {
      const players = start();
      const reset = GameInProgress.init(players);
      document
        .querySelector("body.in-progress .reset-game")
        .addEventListener("click", () => {
          reset();
          control();
        });
    });
}

window.addEventListener("load", control);
