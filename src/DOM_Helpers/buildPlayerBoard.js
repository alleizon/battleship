const Utils = require("./utils.js");
const Handlers = require("./handlers.js");

const BuildBoard = (() => {
  const renderInfo = () => {
    const info = document.createElement("div");
    info.classList.add("info");
    info.innerHTML = Utils.infoHTML();

    return info;
  };

  const renderGrid = () => {
    const grid = document.createElement("div");
    grid.classList.add("grid");
    grid.addEventListener("dragenter", Handlers.drag);
    grid.addEventListener("dragleave", Handlers.drag);

    for (let row = 0; row < 10; row += 1) {
      for (let col = 0; col < 10; col += 1) {
        const cell = document.createElement("div");
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.dataset.occupied = false;
        cell.classList.add("grid-cell");
        grid.appendChild(cell);
      }
    }

    return grid;
  };

  const renderShips = () => {
    const ships = document.createElement("div");
    ships.classList.add("ships");
    ships.innerHTML = Utils.shipsHTML();

    const shipsChildren = Array.from(ships.children).slice(1);
    shipsChildren.forEach((shipD) => {
      const target = shipD.children[1];
      target.addEventListener("mousedown", Handlers.mouseDown);
      const length = Number(target.dataset.shipLength);

      for (let i = 0; i < length; i += 1) {
        const shipCell = document.createElement("div");
        shipCell.classList.add("ship-cell");
        shipCell.dataset.index = i;
        target.appendChild(shipCell);
      }
    });

    return ships;
  };

  const renderButtons = () => {
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    buttons.innerHTML = Utils.buttonsHTML();

    return buttons;
  };

  const init = () => {
    const body = document.querySelector("body");
    body.id = "build-player-board";

    const title = document.createElement("p");
    title.textContent = "Build your board";

    const grid = renderGrid();
    const info = renderInfo();
    const ships = renderShips();
    const buttons = renderButtons();
    body.append(title, ships, grid, info, buttons);
  };

  return { init };
})();

BuildBoard.init();

module.exports = BuildBoard;
