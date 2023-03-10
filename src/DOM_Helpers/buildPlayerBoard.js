const Utils = require("./utils.js");
const Handlers = require("./handlers.js");
const ShipElement = require("../factories/ShipElement.js");
const Ship = require("../factories/ship.js");
const Game = require("../game.js");
const gameInProgress = require("./inProgress.js");

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
        cell.dataset.occupied = "none";
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

  const start = (e) => {
    const shipsPlaced = document.querySelectorAll(".grid > .placed-ship");
    if (shipsPlaced.length !== 5) {
      e.target.classList.add("error");
      return;
      // style error + remove;
    }
    const ships = [...shipsPlaced].map((ship) => {
      const shipObj = Ship.types.find((shipT) => shipT.name === ship.id);
      const direction = ship.className.includes("flip")
        ? "vertical"
        : "horizontal";
      const coords = [
        +ship.children[0].dataset.placedRow,
        +ship.children[0].dataset.placedCol,
      ];
      return {
        type: shipObj,
        direction,
        start: coords,
      };
    });
    const players = Game.newGame(ships);
    document.querySelector("body#build-player-board").remove();
    const newBody = document.createElement("body");
    document.querySelector("html").appendChild(newBody);
    gameInProgress.init(players);
  };

  const reset = () => {
    const grid = document.querySelector("body#build-player-board > .grid");
    [...grid.children].forEach((gC) => {
      const gridCell = gC;
      gridCell.dataset.occupied = "none";
    });
    const absShips = Array.from(document.querySelectorAll(".placed-ship"));
    absShips.forEach((placedShip) => placedShip.remove());
    const ships = document.querySelector(".ships");
    ships.remove();
    const nShips = renderShips();
    grid.insertAdjacentElement("beforebegin", nShips);
  };

  const randomise = () => {
    reset();
    const grid = document.querySelector("body#build-player-board > .grid");

    const placedShips = [];
    while (placedShips.length < 5) {
      const direction =
        Math.floor(Math.random() * 2) === 0 ? "horizontal" : "vertical";
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const shipType = Ship.types[placedShips.length];
      if (direction === "horizontal") {
        if (col + shipType.length < 10) {
          const newShip = new ShipElement(
            shipType.name,
            shipType.length,
            col,
            row
          );
          const emptyGridCells = [];
          for (let i = 0; i < shipType.length; i += 1) {
            const gridCell = document.querySelector(
              `.grid > .grid-cell[data-row="${row}"][data-col="${col + i}"]`
            );
            if (gridCell.dataset.occupied === "none") {
              emptyGridCells.push(gridCell);
            }
          }
          if (emptyGridCells.length === shipType.length) {
            emptyGridCells.forEach((gCell, i) => {
              const cellCpy = gCell;
              cellCpy.dataset.occupied = shipType.name;
              cellCpy.dataset.row = row;
              cellCpy.dataset.col = col + i;
            });
            grid.appendChild(newShip.element);
            newShip.element.addEventListener("click", Handlers.absFlip);
            newShip.element.addEventListener("mousedown", (eDragStart) => {
              Handlers.absDrag(eDragStart, "start");
            });
            newShip.element.addEventListener("mouseup", (eDragEnd) => {
              Handlers.absDrag(eDragEnd, "drop");
            });
            placedShips.push(newShip);
          }
        }
      } else if (row + shipType.length < 10) {
        const newShip = new ShipElement(
          shipType.name,
          shipType.length,
          col,
          row,
          "vertical"
        );
        const emptyGridCells = [];
        for (let i = 0; i < shipType.length; i += 1) {
          const gridCell = document.querySelector(
            `.grid > .grid-cell[data-row="${row + i}"][data-col="${col}"]`
          );
          if (gridCell.dataset.occupied === "none") {
            emptyGridCells.push(gridCell);
          }
        }
        if (emptyGridCells.length === shipType.length) {
          emptyGridCells.forEach((gCell, i) => {
            const cellCpy = gCell;
            cellCpy.dataset.occupied = shipType.name;
            cellCpy.dataset.row = row + i;
            cellCpy.dataset.col = col;
          });
          grid.appendChild(newShip.element);
          newShip.element.addEventListener("click", Handlers.absFlip);
          newShip.element.addEventListener("mousedown", (eDragStart) => {
            Handlers.absDrag(eDragStart, "start");
          });
          newShip.element.addEventListener("mouseup", (eDragEnd) => {
            Handlers.absDrag(eDragEnd, "drop");
          });
          placedShips.push(newShip);
        }
      }
    }
    const leftShips = document.querySelectorAll(
      "body#build-player-board > .ships > div > .ship"
    );
    [...leftShips].forEach((leftShip) => {
      leftShip.removeEventListener("mousedown", Handlers.mouseDown);
      leftShip.setAttribute("draggable", "false");
      leftShip.classList.add("empty-box");
      const amount = leftShip.previousElementSibling.children[0];
      amount.textContent = "0x";
      [...leftShip.children].forEach((child) => child.classList.add("hidden"));
    });
  };

  const renderButtons = () => {
    const buttons = document.createElement("div");
    buttons.classList.add("buttons");
    buttons.innerHTML = Utils.buttonsHTML();

    buttons.children[0].addEventListener("click", start);
    buttons.children[1].addEventListener("click", randomise);
    buttons.children[2].addEventListener("click", reset);

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
