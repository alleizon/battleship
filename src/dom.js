const Ship = require("./factories/ship.js");
const Game = require("./game.js");

const DOM = (() => {
  const restoreListener = (element, cb) => {
    element.addEventListener("click", cb);
  };

  const getNameElement = (name) => {
    const nameP = document.createElement("p");
    nameP.classList.add("name");
    nameP.textContent = name[0].toUpperCase() + name.slice(1);

    return nameP;
  };

  const getGridElement = (grid) => {
    const gridDiv = document.createElement("div");
    // eslint-disable-next-line prefer-arrow-callback
    gridDiv.addEventListener("click", function handler(e) {
      if (e.target.dataset.cell) {
        console.log(e.target);
        const x = e.currentTarget.dataset.row;
        const y = e.currentTarget.dataset.col;
        Game.playTurn(x, y);
        this.removeEventListener("click", handler);
        setTimeout(() => {
          restoreListener(this, handler);
        }, 500);
      }
    });

    gridDiv.classList.add("grid");
    for (let row = 0; row < grid.length; row += 1) {
      for (let col = 0; col < grid[row].length; col += 1) {
        const div = document.createElement("div");
        if (grid[row][col] instanceof Ship) {
          div.classList.add("ship-cell");
        }
        div.dataset.cell = "cell";
        div.dataset.row = row;
        div.dataset.col = col;
        gridDiv.appendChild(div);
      }
    }

    return gridDiv;
  };

  const renderPlayer = (playerObj) => {
    const player = document.createElement("div");
    player.id = playerObj.name;

    const name = getNameElement(playerObj.name);
    const grid = getGridElement(playerObj.board.grid);

    player.append(name, grid);
    document.querySelector("body").appendChild(player);
  };

  return { renderPlayer };
})();

module.exports = DOM;
