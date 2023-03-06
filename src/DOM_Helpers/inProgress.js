const Ship = require("../factories/ship.js");
const Game = require("../game.js");

const gameInProgress = (() => {
  const restoreGridListener = (element, cb) => {
    element.addEventListener("click", cb);
  };

  const displayComputerTurn = (res) => {
    const [cell, x, y] = res;

    if (cell instanceof Error) return;

    const cellDiv = document.querySelector(
      `#player > .grid > div[data-row="${x}"][data-col="${y}"]`
    );
    if (cell instanceof Ship) {
      cellDiv.classList.add("ship-hit");
    } else if (cell === "") {
      cellDiv.classList.add("miss");
    }
  };

  function handler(e) {
    if (e.target.dataset.cell) {
      if (e.target.className.includes("hit")) return;
      e.target.classList.add("hit");

      const x = Number(e.target.dataset.row);
      const y = Number(e.target.dataset.col);

      const result = Game.playHuman(x, y);
      if (!(result instanceof Ship)) {
        e.target.classList.add("miss");
      }

      this.removeEventListener("click", handler);
      setTimeout(() => {
        const cresult = Game.playComputer();
        displayComputerTurn(cresult);
        restoreGridListener(this, handler);
      }, 1000);
    }
  }

  const getNameElement = (name) => {
    const nameP = document.createElement("p");
    nameP.classList.add("name");
    nameP.textContent = name[0].toUpperCase() + name.slice(1);

    return nameP;
  };

  const getGridElement = (grid) => {
    const gridDiv = document.createElement("div");

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
    player.classList.add("container");

    const name = getNameElement(playerObj.name);
    const grid = getGridElement(playerObj.board.grid);
    if (playerObj.name === "computer") grid.addEventListener("click", handler);

    player.append(name, grid);
    document.querySelector("body").appendChild(player);
  };

  return { renderPlayer };
})();

module.exports = gameInProgress;
