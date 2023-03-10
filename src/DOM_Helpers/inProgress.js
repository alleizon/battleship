const Ship = require("../factories/ship.js");
const Game = require("../game.js");
const Utils = require("./utils.js");

const GameInProgress = (() => {
  const reset = () => {
    document.querySelector("body.in-progress").remove();
    const newBody = document.createElement("body");
    document.querySelector("html").appendChild(newBody);
    Game.reset();
  };

  const renderResetBtn = () => {
    const btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("reset-game");
    btn.textContent = "Reset";

    return btn;
  };

  const gameOver = (winner) => {
    const name = document.querySelector("body.in-progress > p");

    const strU = winner.name[0].toUpperCase() + winner.name.slice(1);
    const strL = winner.name;
    name.innerHTML = `<span class="${strL}">${strU}</span> wins`;
  };

  const setName = (player) => {
    const name = document.querySelector("body.in-progress > p");

    name.innerHTML =
      player === "Player"
        ? `<span class="player">Player</span> turn`
        : `<span class="computer">Computer</span> turn`;
  };

  const restoreGridListener = (element, cb) => {
    element.addEventListener("click", cb);
  };

  const displayComputerTurn = (res) => {
    const [result, x, y] = res;

    if (res instanceof Error) return;

    const cellDiv = document.querySelector(
      `#player > .grid > div[data-row="${x}"][data-col="${y}"]`
    );
    if (result.ship) {
      cellDiv.classList.add("ship-hit");
    } else {
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
      if (result.winner) {
        result.sunkCoord.forEach((pair) => {
          document
            .querySelector(
              `#computer div[data-row="${pair[0]}"][data-col="${pair[1]}"]`
            )
            .classList.add("ship-cell");
        });
        e.target.classList.add("ship-hit");
        gameOver(result.winner);
        this.removeEventListener("click", handler);
        return;
      }
      if (!result.ship) {
        e.target.classList.add("miss");
      }
      if (result.ship) {
        e.target.classList.add("ship-hit");
      }
      if (result.sunkCoord) {
        result.sunkCoord.forEach((pair) => {
          document
            .querySelector(
              `#computer div[data-row="${pair[0]}"][data-col="${pair[1]}"]`
            )
            .classList.add("ship-cell");
        });
      }

      this.removeEventListener("click", handler);
      setName("Computer");
      setTimeout(() => {
        const cresult = Game.playComputer();
        if (cresult.winner) {
          gameOver(cresult.winner);
          displayComputerTurn(cresult.result);
          this.removeEventListener("click", handler);
          return;
        }
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

  const getGridElement = (grid, playerName) => {
    const gridDiv = document.createElement("div");
    gridDiv.classList.add("grid");
    for (let row = 0; row < grid.length; row += 1) {
      for (let col = 0; col < grid[row].length; col += 1) {
        const div = document.createElement("div");
        if (grid[row][col] instanceof Ship) {
          if (playerName === "player") {
            div.classList.add("ship-cell");
          }
        }
        div.dataset.cell = "cell";
        div.dataset.row = row;
        div.dataset.col = col;
        gridDiv.appendChild(div);
      }
    }

    return gridDiv;
  };

  const renderPlayer = (playerObj, body, legend) => {
    const player = document.createElement("div");
    player.id = playerObj.name;
    player.classList.add("container");

    const playerName = getNameElement(playerObj.name);
    const grid = getGridElement(playerObj.board.grid, playerObj.name);
    if (playerObj.name === "computer") grid.addEventListener("click", handler);

    player.append(playerName, grid);
    body.appendChild(player);

    if (playerObj.name === "player") body.appendChild(renderResetBtn());
    if (playerObj.name === "computer") body.appendChild(legend);
  };

  const init = (players) => {
    const body = document.querySelector("body");
    body.classList.add("in-progress");

    const legend = document.createElement("div");
    legend.classList.add("legend");
    legend.innerHTML = Utils.legendHTML();

    const name = document.createElement("p");
    name.innerHTML = `<span class="player">Player</span> turn`;
    document.querySelector("body").appendChild(name);
    const [player, computer] = players;

    renderPlayer(player, body, legend);
    renderPlayer(computer, body, legend);

    return reset;
  };

  return { init };
})();

module.exports = GameInProgress;
