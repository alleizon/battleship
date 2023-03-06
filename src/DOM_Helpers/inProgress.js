const Ship = require("../factories/ship.js");
const Game = require("../game.js");
const Utils = require("../utils.js");

const gameInProgress = (() => {
  const body = document.querySelector("body");
  body.classList.add("in-progress");

  const legend = document.createElement("div"); // r
  legend.classList.add("legend");
  legend.innerHTML = Utils.legendHTML();

  const name = document.createElement("p");
  name.innerHTML = `<span class="player">Player</span> turn`;
  document.querySelector("body").appendChild(name);

  const setName = (player) => {
    name.innerHTML =
      player === "Player"
        ? `<span class="player">Player</span> turn`
        : `<span class="computer">Computer</span> turn`;
  };

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
      if (result instanceof Ship) e.target.classList.add("ship-hit");

      this.removeEventListener("click", handler);
      setName("Computer");
      setTimeout(() => {
        const cresult = Game.playComputer();
        displayComputerTurn(cresult);
        restoreGridListener(this, handler);
        setName("Player");
      }, 1000);
    }
  }

  const getNameElement = (playerName) => {
    const nameP = document.createElement("p");
    nameP.classList.add("name");
    nameP.textContent = playerName[0].toUpperCase() + playerName.slice(1);

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

    const playerName = getNameElement(playerObj.name);
    const grid = getGridElement(playerObj.board.grid);
    if (playerObj.name === "computer") grid.addEventListener("click", handler);

    player.append(playerName, grid);
    body.appendChild(player);

    if (playerObj.name === "computer") body.appendChild(legend);
  };

  return { renderPlayer };
})();

module.exports = gameInProgress;
