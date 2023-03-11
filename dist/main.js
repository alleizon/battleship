/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/DOM_Helpers/buildPlayerBoard.js":
/*!*********************************************!*\
  !*** ./src/DOM_Helpers/buildPlayerBoard.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Utils = __webpack_require__(/*! ./utils.js */ "./src/DOM_Helpers/utils.js");
const Handlers = __webpack_require__(/*! ./handlers.js */ "./src/DOM_Helpers/handlers.js");
const ShipElement = __webpack_require__(/*! ../factories/ShipElement.js */ "./src/factories/ShipElement.js");
const Ship = __webpack_require__(/*! ../factories/ship.js */ "./src/factories/ship.js");
const Game = __webpack_require__(/*! ../game.js */ "./src/game.js");

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

  const start = () => {
    const shipsPlaced = document.querySelectorAll(".grid > .placed-ship");
    const btn = document.querySelector(
      "body#build-player-board > .buttons > button.start"
    );
    if (shipsPlaced.length !== 5) {
      btn.classList.add("err");
      setTimeout(() => {
        btn.classList.remove("err");
      }, 2000);
      return null;
    }
    const ships = [...shipsPlaced].map((ship) => {
      const shipObj = Ship.types.find((shipT) => shipT.name === ship.id);
      const shipInstance = new Ship(shipObj);
      const direction = ship.className.includes("flip")
        ? "vertical"
        : "horizontal";
      const coords = [
        +ship.children[0].dataset.placedRow,
        +ship.children[0].dataset.placedCol,
      ];
      return {
        ship: shipInstance,
        direction,
        start: coords,
      };
    });
    const players = Game.newGame(ships);
    document.querySelector("body#build-player-board").remove();
    const newBody = document.createElement("body");
    document.querySelector("html").appendChild(newBody);
    return players;
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

    return start;
  };

  return { init };
})();

module.exports = BuildBoard;


/***/ }),

/***/ "./src/DOM_Helpers/handlers.js":
/*!*************************************!*\
  !*** ./src/DOM_Helpers/handlers.js ***!
  \*************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const ShipElement = __webpack_require__(/*! ../factories/ShipElement.js */ "./src/factories/ShipElement.js");

const Handlers = (() => {
  let parentShip;
  let shipCell;
  let gridCellsGlobal = [];

  let absStartX;
  let absStartY;
  let absEndX;
  let absEndY;
  let absStartLeft;
  let absStartTop;
  let elementClicked;
  let clickedPlaced;
  let startGridCells;

  const updatePlacedShip = () => {
    if (absStartX === absEndX && absStartY === absEndY) return;
    const direction = elementClicked.className.includes("flip")
      ? "vertical"
      : "horizontal";
    const leftStart = +elementClicked.style.left.slice(0, -2);
    const topStart = +elementClicked.style.top.slice(0, -2);
    const { length } = elementClicked.children;
    const leftEnd =
      direction === "horizontal" ? leftStart + (length - 1) * 41 : leftStart;
    const topEnd =
      direction === "vertical" ? topStart + (length - 1) * 41 : topStart;

    const gridCells = Array.from(
      document.querySelectorAll(".grid > .grid-cell")
    );
    const toUpdate = [];

    gridCells.forEach((gridCell) => {
      if (
        gridCell.offsetLeft >= leftStart &&
        gridCell.offsetLeft <= leftEnd &&
        gridCell.offsetTop >= topStart &&
        gridCell.offsetTop <= topEnd
      ) {
        toUpdate.push(gridCell);
      }
    });

    toUpdate.forEach((gcell) => {
      const gcellCpy = gcell;
      gcellCpy.dataset.occupied = elementClicked.id;
    });

    const placedChildren = Array.from(elementClicked.children);
    placedChildren.forEach((oldPlacedC, i) => {
      const cpy = oldPlacedC;
      cpy.dataset.placedRow = toUpdate[i].dataset.row;
      cpy.dataset.placedCol = toUpdate[i].dataset.col;
    });
    const oldUpdate = [...startGridCells].filter(
      (gcOld) => !toUpdate.includes(gcOld)
    );
    oldUpdate.forEach((c) => {
      const cpy = c;
      cpy.dataset.occupied = "none";
    });
  };

  const stickAbsShip = (startCell) => {
    const i = [...elementClicked.children].findIndex(
      (el) => el === clickedPlaced
    );
    const direction = elementClicked.className.includes("flip")
      ? "vertical"
      : "horizontal";
    let left = +startCell.offsetLeft;
    let top = +startCell.offsetTop;
    if (direction === "horizontal") left -= i * 41;
    else top -= i * 41;
    elementClicked.style.left = `${left}px`;
    elementClicked.style.top = `${top}px`;
  };

  const validateAbsDrag = (gridCell) => {
    const children = Array.from(elementClicked.children);
    const { length } = children;
    const clickedIndex = children.findIndex((el) => el === clickedPlaced);
    const cellsToCheck = [];
    const afterCells = length - clickedIndex - 1;
    const beforeCells = clickedIndex;
    let i = afterCells;
    let j = beforeCells;
    const row = +gridCell.dataset.row;
    const col = +gridCell.dataset.col;
    const direction = elementClicked.className.includes("flip")
      ? "vertical"
      : "horizontal";
    cellsToCheck.push(gridCell);
    let curRow = row;
    let curCol = col;

    while (i) {
      if (direction === "horizontal") {
        curCol += 1;
        if (curCol < 10 && curCol >= 0) {
          const add = document.querySelector(
            `.grid > .grid-cell[data-row="${row}"][data-col="${curCol}"]`
          );
          cellsToCheck.push(add);
        }
      } else {
        curRow += 1;
        if (curRow < 10 && curRow >= 0) {
          const add = document.querySelector(
            `.grid > .grid-cell[data-row="${curRow}"][data-col="${col}"]`
          );
          cellsToCheck.push(add);
        }
      }
      i -= 1;
    }
    curCol = col;
    curRow = row;
    while (j) {
      if (direction === "horizontal") {
        curCol -= 1;
        if (curCol < 10 && curCol >= 0) {
          const add = document.querySelector(
            `.grid > .grid-cell[data-row="${row}"][data-col="${curCol}"]`
          );
          cellsToCheck.push(add);
        }
      } else {
        curRow -= 1;
        if (curRow < 10 && curRow >= 0) {
          const add = document.querySelector(
            `.grid > .grid-cell[data-row="${curRow}"][data-col="${col}"]`
          );
          cellsToCheck.push(add);
        }
      }
      j -= 1;
    }

    const addedCells = [];

    if (direction === "horizontal") {
      if (
        col + afterCells > 10 ||
        col - beforeCells < 0 ||
        cellsToCheck.length !== length
      ) {
        return false;
      }
      cellsToCheck.forEach((gridCellC) => {
        if (
          (gridCellC.dataset.occupied === elementClicked.id ||
            gridCellC.dataset.occupied === "none") &&
          +gridCellC.dataset.row === row
        )
          addedCells.push(gridCellC);
      });
    } else {
      if (
        row + afterCells > 10 ||
        row - beforeCells < 0 ||
        cellsToCheck.length !== length
      ) {
        return false;
      }
      cellsToCheck.forEach((gridCellC) => {
        if (
          (gridCellC.dataset.occupied === elementClicked.id ||
            gridCellC.dataset.occupied === "none") &&
          +gridCellC.dataset.col === col
        )
          addedCells.push(gridCellC);
      });
    }
    return addedCells.length === length;
  };

  const getGridCellByOffset = (mouseX, mouseY) => {
    const CELL_LENGTH = 41;
    const CELL_HEIGHT = 41;
    const diffX = mouseX % CELL_LENGTH;
    const diffY = mouseY % CELL_HEIGHT;
    const cellStartX = mouseX - diffX;
    const cellStartY = mouseY - diffY;

    const children = Array.from(
      document.querySelectorAll("body#build-player-board > .grid > .grid-cell")
    );

    let cell;
    for (let i = 0; i < children.length; i += 1) {
      if (
        children[i].offsetLeft === cellStartX &&
        children[i].offsetTop === cellStartY
      ) {
        cell = children[i];
        break;
      }
    }
    return cell;
  };

  const resetShipGlobals = () => {
    parentShip = undefined;
    shipCell = undefined;
    gridCellsGlobal = [];
  };

  const resetAbsGlobals = () => {
    absStartX = undefined;
    absStartY = undefined;
    absEndX = undefined;
    absEndY = undefined;
    absStartLeft = undefined;
    absStartTop = undefined;
    elementClicked = undefined;
    clickedPlaced = undefined;
    startGridCells = [];
  };

  const resetValidity = () => {
    const invalids = Array.from(document.querySelectorAll(".drag-invalid"));
    invalids.forEach((cell) => {
      cell.classList.remove("drag-invalid");
    });
    const valids = Array.from(document.querySelectorAll(".drag-valid"));
    valids.forEach((cell) => {
      cell.classList.remove("drag-valid");
    });
  };

  const flipError = (element) => {
    element.classList.add("flip-error");
    setTimeout(() => {
      element.classList.remove("flip-error");
    }, 1500);
  };

  const absFlip = (e) => {
    if (absStartX !== absEndX || absStartY !== absEndY) {
      resetAbsGlobals();
      return;
    }

    const isParent = !e.target.className.includes("placed-cell");

    const element = isParent ? e.target : e.target.parentElement;
    const { length } = element.children;
    const startX = +element.children[0].dataset.placedCol;
    const startY = +element.children[0].dataset.placedRow;

    const newOccupied = [];

    if (element.className.includes("flip")) {
      if (startX + length > 10) {
        flipError(element);
        return;
      }
      for (let i = 1; i < length; i += 1) {
        const cell = document.querySelector(
          `.grid-cell[data-row="${startY}"][data-col="${startX + i}"]`
        );
        if (cell.dataset.occupied !== "none") {
          flipError(element);
          return;
        }
        newOccupied.push(cell);
      }
    } else {
      if (startY + length > 10) {
        flipError(element);
        return;
      }
      for (let i = 1; i < length; i += 1) {
        const cell = document.querySelector(
          `.grid-cell[data-row="${startY + i}"][data-col="${startX}"]`
        );
        if (cell.dataset.occupied !== "none") {
          flipError(element);
          return;
        }
        newOccupied.push(cell);
      }
    }
    newOccupied.forEach((el, i) => {
      const gridCellE = el;
      gridCellE.dataset.occupied = element.id;
      const newRow = +gridCellE.dataset.row;
      const newCol = +gridCellE.dataset.col;
      const oldRow = element.children[i + 1].dataset.placedRow;
      const oldCol = element.children[i + 1].dataset.placedCol;
      element.children[i + 1].dataset.placedRow = newRow;
      element.children[i + 1].dataset.placedCol = newCol;
      const oldCell = document.querySelector(
        `.grid-cell[data-row="${oldRow}"][data-col="${oldCol}"]`
      );
      oldCell.dataset.occupied = "none";
    });
    element.classList.toggle("flip");
  };

  const absDrag = (e, type) => {
    const MIN_MOUSE = 0;
    const MAX_MOUSE = 10 * 41;
    let dragX;
    let dragY;

    if (type === "drop") {
      if (elementClicked.className.includes("invalid")) {
        elementClicked.style.left = `${absStartLeft}px`;
        elementClicked.style.top = `${absStartTop}px`;
        elementClicked.classList.remove("invalid");
        elementClicked = undefined;
        return;
      }
      absEndX = +e.x;
      absEndY = +e.y;
      updatePlacedShip();
      elementClicked = undefined;
      return;
    }

    if (type === "start") {
      elementClicked = e.target.className.includes("placed-cell")
        ? e.target.parentElement
        : e.target;
      if (e.target.className.includes("placed-cell")) {
        clickedPlaced = e.target;
      }
      startGridCells = document.querySelectorAll(
        `body > .grid > .grid-cell[data-occupied="${elementClicked.id}"]`
      );
      absStartX = +e.x;
      absStartY = +e.y;
      absStartLeft = +elementClicked.style.left.slice(0, -2);
      absStartTop = +elementClicked.style.top.slice(0, -2);
      return;
    }

    if (type === "drag") {
      if (!elementClicked) return;
      let isValid;
      let hoverGridCell;

      if (
        e.target.className.includes("placed-cell") &&
        e.target.parentElement === clickedPlaced.parentElement
      ) {
        const mouseX = elementClicked.offsetLeft + e.layerX;
        const mouseY = elementClicked.offsetTop + e.layerY;
        hoverGridCell = getGridCellByOffset(mouseX, mouseY);
        if (
          mouseX > MIN_MOUSE &&
          mouseX < MAX_MOUSE &&
          mouseY > MIN_MOUSE &&
          mouseY < MAX_MOUSE
        ) {
          isValid = validateAbsDrag(hoverGridCell);
        }
      } else if (e.target.className.includes("grid-cell")) {
        hoverGridCell = e.target;
        isValid = validateAbsDrag(hoverGridCell);
      }

      if (isValid) {
        elementClicked.classList.add("valid");
        elementClicked.classList.remove("invalid");
        stickAbsShip(hoverGridCell);
        return;
      }

      dragX = +e.x;
      dragY = +e.y;
      const newX = dragX - absStartX;
      const newY = dragY - absStartY;
      elementClicked.style.left = `${absStartLeft + newX}px`;
      elementClicked.style.top = `${absStartTop + newY}px`;
      elementClicked.classList.add("invalid");
      elementClicked.classList.remove("valid");
    }
  };

  const drag = (e) => {
    const leave = (leaveE) => {
      const { relatedTarget } = leaveE;
      if (relatedTarget === document.querySelector("body#build-player-board")) {
        gridCellsGlobal = [];
        resetValidity();
      }
    };
    const enter = (enterE) => {
      resetValidity();
      if (enterE.target.className.includes("grid-cell") && parentShip) {
        const length = Number(parentShip.dataset.shipLength);
        const shipCellIndex = Number(shipCell.dataset.index);
        const gridCellRow = Number(enterE.target.dataset.row);
        const gridCellCol = Number(enterE.target.dataset.col);

        const rightCells = length - shipCellIndex;
        const leftCells = shipCellIndex;
        const gridCells = [];

        for (let i = 0; i < rightCells; i += 1) {
          const current = document.querySelector(
            `div.grid > .grid-cell[data-row="${gridCellRow}"][data-col="${
              gridCellCol + i
            }"]`
          );
          if (current && current.dataset.occupied === "none")
            gridCells.push(current);
        }
        for (let i = 0; i < leftCells; i += 1) {
          const current = document.querySelector(
            `div.grid > .grid-cell[data-row="${gridCellRow}"][data-col="${
              gridCellCol - 1 - i
            }"]`
          );
          if (current) gridCells.unshift(current);
        }

        gridCellsGlobal = gridCells;
        if (gridCells.length !== length) {
          gridCells.forEach((gridCell) => {
            gridCell.classList.add("drag-invalid");
          });
        } else if (gridCells.length === length) {
          gridCells.forEach((gridCell) => {
            gridCell.classList.add("drag-valid");
          });
        }
      }
    };
    const end = () => {
      resetValidity();
      if (!gridCellsGlobal.length) return;
      if (gridCellsGlobal.length === +parentShip.dataset.shipLength) {
        const sName = parentShip.parentElement.id;
        const length = parentShip.dataset.shipLength;
        const xOff = +gridCellsGlobal[0].dataset.col;
        const yOff = +gridCellsGlobal[0].dataset.row;

        const absShip = new ShipElement(sName, length, xOff, yOff);
        document
          .querySelector("#build-player-board > div.grid")
          .appendChild(absShip.element);

        Array.from(absShip.element.children).forEach((child) => {
          const gridC = document.querySelector(
            `.grid-cell[data-row="${child.dataset.placedRow}"][data-col="${child.dataset.placedCol}"]`
          );
          gridC.dataset.occupied = absShip.element.id;
        });

        absShip.element.addEventListener("click", absFlip);
        absShip.element.addEventListener("mousedown", (eDragStart) =>
          absDrag(eDragStart, "start")
        );
        absShip.element.addEventListener("mouseup", (eDragEnd) =>
          absDrag(eDragEnd, "drop")
        );

        parentShip.classList.add("empty-box");
        parentShip.setAttribute("draggable", false);
        const parentChildren = Array.from(parentShip.children);
        parentChildren.forEach((child) => {
          child.classList.add("hidden");
        });
        const amount = document.querySelector(
          `#${parentShip.parentElement.id} span[data-ship="amount"]`
        );
        amount.textContent = "0x";

        parentShip.removeEventListener("dragstart", drag);
        parentShip.removeEventListener("dragend", drag);
      }

      resetShipGlobals();
    };

    if (e.type === "dragleave") leave(e);
    if (e.type === "dragenter") enter(e);
    if (e.type === "dragend") end(e);
  };

  const mouseDown = (e) => {
    shipCell = e.target;
    parentShip = e.target.parentElement;
    parentShip.addEventListener("dragstart", drag);
    parentShip.addEventListener("dragend", drag);
  };

  window.addEventListener("mousemove", (e) => absDrag(e, "drag"));

  return { mouseDown, drag, absDrag, absFlip };
})();

module.exports = Handlers;


/***/ }),

/***/ "./src/DOM_Helpers/inProgress.js":
/*!***************************************!*\
  !*** ./src/DOM_Helpers/inProgress.js ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Ship = __webpack_require__(/*! ../factories/ship.js */ "./src/factories/ship.js");
const Game = __webpack_require__(/*! ../game.js */ "./src/game.js");
const Utils = __webpack_require__(/*! ./utils.js */ "./src/DOM_Helpers/utils.js");

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


/***/ }),

/***/ "./src/DOM_Helpers/utils.js":
/*!**********************************!*\
  !*** ./src/DOM_Helpers/utils.js ***!
  \**********************************/
/***/ ((module) => {

const Utils = (() => {
  const legendHTML = () => `<p>Legend :</p>
    <div class="ship">
      <span>Sunk enemy ship</span>
      <div class="legend-ship">
      <div class="legend-ship-cell"></div>
      <div class="legend-ship-cell"></div>
      <div class="legend-ship-cell"></div>
      </div>
    </div>
    <div class="miss">
      <span>Missed hit</span>
      <div class="wrapper">
        Player <div class="legend-miss"></div>
        /
        Computer <div class="legend-hit"></div>
      </div>
    </div>
    <div class="hit">
      <span>Ship hit</span>
      <div class="wrapper">
        Player <div class="legend-hit"></div>
        /
        Computer <div class="legend-miss"></div>
      </div>
    </div>`;

  const infoHTML = () => `<h1>Info</h1>
    <p>Drag and drop the ships from the left of the grid to build your board.
      <br>
      By default, ships are placed horizontaly. Once placed on the board,
      click on the ship to flip it vertically, or drag and drop to reposition. 
      <br>
      Keep in mind the ships can't overlap with eachother.
      <br>
      Options:
    </p>
    <ul>
      <li><b>Start</b> (once all ships are placed)</li>
      <li><b>Reset</b></li>
      <li><b>Randomise</b> the board</li>
    </ul>
  </div>`;

  const shipsHTML = () => `<h1>Ships</h1>
    <div id="carrier">
      <span data-ship="name">Carrier <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="5"></div>
    </div>
    <div id="battleship">
      <span data-ship="name">Battleship <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="4"></div>
    </div>
    <div id="cruiser">
      <span data-ship="name">Cruiser <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="3"></div>
    </div>
    <div id="submarine">
      <span data-ship="name">Submarine <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="3"></div>
    </div>
    <div id="destroyer">
      <span data-ship="name">Destroyer <span data-ship="amount">x1</span></span>
      <div class="ship" draggable="true" data-ship-length="2"></div>
    </div>`;

  const buttonsHTML =
    () => `<button class="start" data-err-tip="You have not placed all ships" type="button">Start</button>
    <button class="randomise" type="button">Randomise</button>
    <button class="reset" type="button">Reset</button>`;

  return { legendHTML, infoHTML, shipsHTML, buttonsHTML };
})();

module.exports = Utils;


/***/ }),

/***/ "./src/factories/ShipElement.js":
/*!**************************************!*\
  !*** ./src/factories/ShipElement.js ***!
  \**************************************/
/***/ ((module) => {

class ShipElement {
  constructor(name, length, xOffset, yOffset, direction = "horizontal") {
    this.name = name;
    this.length = length;
    this.row = yOffset;
    this.col = xOffset;
    this.left = xOffset * 40 + xOffset;
    this.top = yOffset * 40 + yOffset;
    this.direction = direction;
    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement("div");
    element.id = this.name;
    element.classList.add("placed-ship");
    if (this.direction === "vertical") element.classList.add("flip");
    element.style.left = `${this.left}px`;
    element.style.top = `${this.top}px`;
    this.createChildren(element);

    return element;
  }

  createChildren(parent) {
    for (let i = 0; i < this.length; i += 1) {
      const child = document.createElement("div");
      if (this.direction === "horizontal") {
        child.dataset.placedRow = this.row;
        child.dataset.placedCol = this.col + i;
      } else {
        child.dataset.placedRow = this.row + i;
        child.dataset.placedCol = this.col;
      }

      child.classList.add("placed-cell");
      parent.appendChild(child);
    }
  }
}
module.exports = ShipElement;


/***/ }),

/***/ "./src/factories/gameboard.js":
/*!************************************!*\
  !*** ./src/factories/gameboard.js ***!
  \************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Ship = __webpack_require__(/*! ./ship.js */ "./src/factories/ship.js");

class Gameboard {
  constructor() {
    this.grid = Gameboard.initBoard();
    this.attacks = [];
    this.ships = [];
  }

  reset() {
    this.grid = Gameboard.initBoard();
  }

  static random(board) {
    let placedShips = 0;
    while (placedShips < 5) {
      const rnd = Math.floor(Math.random() * 2);
      const direction = rnd ? "vertical" : "horizontal";
      const ship = new Ship(Ship.types[placedShips]);
      const x = Math.floor(Math.random() * 10);
      const y = Math.floor(Math.random() * 10);
      const isShip = board.placeShip(ship, [x, y], direction);
      if (isShip) placedShips += 1;
    }
  }

  static initBoard() {
    const grid = [];

    for (let i = 0; i < 10; i += 1) {
      const row = [];
      for (let j = 0; j < 10; j += 1) {
        row.push("");
      }
      grid.push(row);
    }

    return grid;
  }

  static isValidCoords(x, y) {
    return x >= 0 && y >= 0 && x <= 9 && y <= 9;
  }

  static isValidShipPlacemenet(x, y, length, direction) {
    if (direction === "horizontal")
      return x >= 0 && x <= 9 && y + length - 1 >= 0 && y + length - 1 <= 9;
    return x + length - 1 >= 0 && x + length - 1 <= 9 && y >= 0 && y <= 9;
  }

  shipsSunk() {
    return this.ships.every((ship) => ship.sunk);
  }

  placeShip(ship, start, direction) {
    const [x, y] = start;
    const validCoords = Gameboard.isValidShipPlacemenet(
      x,
      y,
      ship.length,
      direction
    );
    if (!validCoords) return null;
    const addedShips = [];
    if (direction === "horizontal") {
      for (let i = 0; i < ship.length; i += 1) {
        if (!(this.grid[x][y + i] instanceof Ship)) {
          addedShips.push([x, y + i]);
        }
      }
    } else {
      for (let i = 0; i < ship.length; i += 1) {
        if (!(this.grid[x + i][y] instanceof Ship)) {
          addedShips.push([x + i, y]);
        }
      }
    }
    if (addedShips.length === ship.length) {
      addedShips.forEach((coords) => {
        const [nx, ny] = coords;
        this.grid[nx][ny] = ship;
      });
      this.ships.push(ship);
      return ship;
    }
    return null;
  }

  receiveAttack(x, y) {
    if (!Gameboard.isValidCoords(x, y)) return new Error("invalid coordinates");
    if (this.attacks.includes(`${x}${y}`))
      return new Error("attack already occured");
    const cell = this.grid[x][y];
    if (cell instanceof Ship) cell.hit();
    else this.grid[x][y] = "X";
    this.attacks.push(`${x}${y}`);
    return cell;
  }
}

module.exports = Gameboard;


/***/ }),

/***/ "./src/factories/player.js":
/*!*********************************!*\
  !*** ./src/factories/player.js ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Gameboard = __webpack_require__(/*! ./gameboard.js */ "./src/factories/gameboard.js");

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.sendAttack = this.createSendAttack(name);
    this.attacks = [];
    if (name === "computer") {
      Gameboard.random(this.board);
    }
  }

  createSendAttack(name) {
    return name === "player"
      ? (enemyBoard, x, y) => {
          const cell = enemyBoard.receiveAttack(x, y);
          if (Gameboard.isValidCoords(x, y)) {
            this.attacks.push(`${x}${y}`);
            return cell;
          }
          return new Error("invalid coordinates");
        }
      : (enemyBoard) => {
          const [cx, cy] = this.generateCompAttack();
          const cell = enemyBoard.receiveAttack(cx, cy);
          this.attacks.push(`${cx}${cy}`);
          return [cell, cx, cy];
        };
  }

  generateCompAttack() {
    let x;
    let y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (this.attacks.includes(`${x}${y}`));

    return [x, y];
  }
}

module.exports = Player;


/***/ }),

/***/ "./src/factories/ship.js":
/*!*******************************!*\
  !*** ./src/factories/ship.js ***!
  \*******************************/
/***/ ((module) => {

class Ship {
  static types = [
    { name: "carrier", length: 5 },
    { name: "battleship", length: 4 },
    { name: "cruiser", length: 3 },
    { name: "submarine", length: 3 },
    { name: "destroyer", length: 2 },
  ];

  constructor(typeObj) {
    this.name = typeObj.name;
    this.length = typeObj.length;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    this.hits += 1;
    this.sunk = this.hits === this.length;
  }

  isSunk() {
    return this.sunk;
  }
}

module.exports = Ship;


/***/ }),

/***/ "./src/game.js":
/*!*********************!*\
  !*** ./src/game.js ***!
  \*********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const Player = __webpack_require__(/*! ./factories/player.js */ "./src/factories/player.js");
const Ship = __webpack_require__(/*! ./factories/ship.js */ "./src/factories/ship.js");

const Game = (() => {
  let human;
  let computer;

  const reset = () => {
    human.board.reset();
    computer.board.reset();
  };

  const newGame = (ships) => {
    human = new Player("player");
    computer = new Player("computer");

    ships.forEach((element) => {
      human.board.placeShip(element.ship, element.start, element.direction);
    });

    return [human, computer];
  };

  const result = (cell, player, enemy) => {
    const isShip = cell instanceof Ship;

    return {
      ship: isShip ? cell : false,
      winner: enemy.board.shipsSunk() ? player : null,
      sunkCoord: isShip
        ? ((ship, grid) => {
            const coords = [];
            if (ship.isSunk()) {
              grid.forEach((row, i) => {
                row.forEach((col, j) => {
                  if (col === cell) coords.push([i, j]);
                });
              });
            }
            return coords.length ? coords : null;
          })(cell, enemy.board.grid)
        : null,
    };
  };

  const playHuman = (x, y) => {
    const cell = human.sendAttack(computer.board, x, y);
    return result(cell, human, computer);
  };

  const playComputer = () => {
    const cell = computer.sendAttack(human.board);
    return [result(cell[0], computer, human), cell[1], cell[2]];
  };

  return { reset, newGame, playHuman, playComputer };
})();

module.exports = Game;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
const BuildBoard = __webpack_require__(/*! ./DOM_Helpers/buildPlayerBoard.js */ "./src/DOM_Helpers/buildPlayerBoard.js");
const GameInProgress = __webpack_require__(/*! ./DOM_Helpers/inProgress.js */ "./src/DOM_Helpers/inProgress.js");

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

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixlQUFlO0FBQ2Y7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYLENBQUM7O0FBRUQ7Ozs7Ozs7VUMxREE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7Ozs7O0FDdEJBLG1CQUFtQixtQkFBTyxDQUFDLGdGQUFtQztBQUM5RCx1QkFBdUIsbUJBQU8sQ0FBQyxvRUFBNkI7O0FBRTVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxLQUFLO0FBQ0w7O0FBRUEiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL0RPTV9IZWxwZXJzL2J1aWxkUGxheWVyQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9ET01fSGVscGVycy9oYW5kbGVycy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL0RPTV9IZWxwZXJzL2luUHJvZ3Jlc3MuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9ET01fSGVscGVycy91dGlscy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9TaGlwRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwLy4vc3JjL2ZhY3Rvcmllcy9nYW1lYm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9mYWN0b3JpZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvLi9zcmMvZmFjdG9yaWVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXAvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzLmpzXCIpO1xuY29uc3QgSGFuZGxlcnMgPSByZXF1aXJlKFwiLi9oYW5kbGVycy5qc1wiKTtcbmNvbnN0IFNoaXBFbGVtZW50ID0gcmVxdWlyZShcIi4uL2ZhY3Rvcmllcy9TaGlwRWxlbWVudC5qc1wiKTtcbmNvbnN0IFNoaXAgPSByZXF1aXJlKFwiLi4vZmFjdG9yaWVzL3NoaXAuanNcIik7XG5jb25zdCBHYW1lID0gcmVxdWlyZShcIi4uL2dhbWUuanNcIik7XG5cbmNvbnN0IEJ1aWxkQm9hcmQgPSAoKCkgPT4ge1xuICBjb25zdCByZW5kZXJJbmZvID0gKCkgPT4ge1xuICAgIGNvbnN0IGluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGluZm8uY2xhc3NMaXN0LmFkZChcImluZm9cIik7XG4gICAgaW5mby5pbm5lckhUTUwgPSBVdGlscy5pbmZvSFRNTCgpO1xuXG4gICAgcmV0dXJuIGluZm87XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyR3JpZCA9ICgpID0+IHtcbiAgICBjb25zdCBncmlkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBncmlkLmNsYXNzTGlzdC5hZGQoXCJncmlkXCIpO1xuICAgIGdyaWQuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbnRlclwiLCBIYW5kbGVycy5kcmFnKTtcbiAgICBncmlkLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnbGVhdmVcIiwgSGFuZGxlcnMuZHJhZyk7XG5cbiAgICBmb3IgKGxldCByb3cgPSAwOyByb3cgPCAxMDsgcm93ICs9IDEpIHtcbiAgICAgIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IDEwOyBjb2wgKz0gMSkge1xuICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgY2VsbC5kYXRhc2V0LnJvdyA9IHJvdztcbiAgICAgICAgY2VsbC5kYXRhc2V0LmNvbCA9IGNvbDtcbiAgICAgICAgY2VsbC5kYXRhc2V0Lm9jY3VwaWVkID0gXCJub25lXCI7XG4gICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImdyaWQtY2VsbFwiKTtcbiAgICAgICAgZ3JpZC5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZ3JpZDtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTaGlwcyA9ICgpID0+IHtcbiAgICBjb25zdCBzaGlwcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc2hpcHMuY2xhc3NMaXN0LmFkZChcInNoaXBzXCIpO1xuICAgIHNoaXBzLmlubmVySFRNTCA9IFV0aWxzLnNoaXBzSFRNTCgpO1xuXG4gICAgY29uc3Qgc2hpcHNDaGlsZHJlbiA9IEFycmF5LmZyb20oc2hpcHMuY2hpbGRyZW4pLnNsaWNlKDEpO1xuICAgIHNoaXBzQ2hpbGRyZW4uZm9yRWFjaCgoc2hpcEQpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHNoaXBELmNoaWxkcmVuWzFdO1xuICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgSGFuZGxlcnMubW91c2VEb3duKTtcbiAgICAgIGNvbnN0IGxlbmd0aCA9IE51bWJlcih0YXJnZXQuZGF0YXNldC5zaGlwTGVuZ3RoKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBzaGlwQ2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIHNoaXBDZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwLWNlbGxcIik7XG4gICAgICAgIHNoaXBDZWxsLmRhdGFzZXQuaW5kZXggPSBpO1xuICAgICAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoc2hpcENlbGwpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHNoaXBzO1xuICB9O1xuXG4gIGNvbnN0IHN0YXJ0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHNoaXBzUGxhY2VkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5ncmlkID4gLnBsYWNlZC1zaGlwXCIpO1xuICAgIGNvbnN0IGJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBcImJvZHkjYnVpbGQtcGxheWVyLWJvYXJkID4gLmJ1dHRvbnMgPiBidXR0b24uc3RhcnRcIlxuICAgICk7XG4gICAgaWYgKHNoaXBzUGxhY2VkLmxlbmd0aCAhPT0gNSkge1xuICAgICAgYnRuLmNsYXNzTGlzdC5hZGQoXCJlcnJcIik7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgYnRuLmNsYXNzTGlzdC5yZW1vdmUoXCJlcnJcIik7XG4gICAgICB9LCAyMDAwKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBzaGlwcyA9IFsuLi5zaGlwc1BsYWNlZF0ubWFwKChzaGlwKSA9PiB7XG4gICAgICBjb25zdCBzaGlwT2JqID0gU2hpcC50eXBlcy5maW5kKChzaGlwVCkgPT4gc2hpcFQubmFtZSA9PT0gc2hpcC5pZCk7XG4gICAgICBjb25zdCBzaGlwSW5zdGFuY2UgPSBuZXcgU2hpcChzaGlwT2JqKTtcbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHNoaXAuY2xhc3NOYW1lLmluY2x1ZGVzKFwiZmxpcFwiKVxuICAgICAgICA/IFwidmVydGljYWxcIlxuICAgICAgICA6IFwiaG9yaXpvbnRhbFwiO1xuICAgICAgY29uc3QgY29vcmRzID0gW1xuICAgICAgICArc2hpcC5jaGlsZHJlblswXS5kYXRhc2V0LnBsYWNlZFJvdyxcbiAgICAgICAgK3NoaXAuY2hpbGRyZW5bMF0uZGF0YXNldC5wbGFjZWRDb2wsXG4gICAgICBdO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hpcDogc2hpcEluc3RhbmNlLFxuICAgICAgICBkaXJlY3Rpb24sXG4gICAgICAgIHN0YXJ0OiBjb29yZHMsXG4gICAgICB9O1xuICAgIH0pO1xuICAgIGNvbnN0IHBsYXllcnMgPSBHYW1lLm5ld0dhbWUoc2hpcHMpO1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5I2J1aWxkLXBsYXllci1ib2FyZFwiKS5yZW1vdmUoKTtcbiAgICBjb25zdCBuZXdCb2R5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJvZHlcIik7XG4gICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImh0bWxcIikuYXBwZW5kQ2hpbGQobmV3Qm9keSk7XG4gICAgcmV0dXJuIHBsYXllcnM7XG4gIH07XG5cbiAgY29uc3QgcmVzZXQgPSAoKSA9PiB7XG4gICAgY29uc3QgZ3JpZCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5I2J1aWxkLXBsYXllci1ib2FyZCA+IC5ncmlkXCIpO1xuICAgIFsuLi5ncmlkLmNoaWxkcmVuXS5mb3JFYWNoKChnQykgPT4ge1xuICAgICAgY29uc3QgZ3JpZENlbGwgPSBnQztcbiAgICAgIGdyaWRDZWxsLmRhdGFzZXQub2NjdXBpZWQgPSBcIm5vbmVcIjtcbiAgICB9KTtcbiAgICBjb25zdCBhYnNTaGlwcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5wbGFjZWQtc2hpcFwiKSk7XG4gICAgYWJzU2hpcHMuZm9yRWFjaCgocGxhY2VkU2hpcCkgPT4gcGxhY2VkU2hpcC5yZW1vdmUoKSk7XG4gICAgY29uc3Qgc2hpcHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnNoaXBzXCIpO1xuICAgIHNoaXBzLnJlbW92ZSgpO1xuICAgIGNvbnN0IG5TaGlwcyA9IHJlbmRlclNoaXBzKCk7XG4gICAgZ3JpZC5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJiZWZvcmViZWdpblwiLCBuU2hpcHMpO1xuICB9O1xuXG4gIGNvbnN0IHJhbmRvbWlzZSA9ICgpID0+IHtcbiAgICByZXNldCgpO1xuICAgIGNvbnN0IGdyaWQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keSNidWlsZC1wbGF5ZXItYm9hcmQgPiAuZ3JpZFwiKTtcblxuICAgIGNvbnN0IHBsYWNlZFNoaXBzID0gW107XG4gICAgd2hpbGUgKHBsYWNlZFNoaXBzLmxlbmd0aCA8IDUpIHtcbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9XG4gICAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDIpID09PSAwID8gXCJob3Jpem9udGFsXCIgOiBcInZlcnRpY2FsXCI7XG4gICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBjb25zdCBjb2wgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBjb25zdCBzaGlwVHlwZSA9IFNoaXAudHlwZXNbcGxhY2VkU2hpcHMubGVuZ3RoXTtcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGlmIChjb2wgKyBzaGlwVHlwZS5sZW5ndGggPCAxMCkge1xuICAgICAgICAgIGNvbnN0IG5ld1NoaXAgPSBuZXcgU2hpcEVsZW1lbnQoXG4gICAgICAgICAgICBzaGlwVHlwZS5uYW1lLFxuICAgICAgICAgICAgc2hpcFR5cGUubGVuZ3RoLFxuICAgICAgICAgICAgY29sLFxuICAgICAgICAgICAgcm93XG4gICAgICAgICAgKTtcbiAgICAgICAgICBjb25zdCBlbXB0eUdyaWRDZWxscyA9IFtdO1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFR5cGUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGNvbnN0IGdyaWRDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgYC5ncmlkID4gLmdyaWQtY2VsbFtkYXRhLXJvdz1cIiR7cm93fVwiXVtkYXRhLWNvbD1cIiR7Y29sICsgaX1cIl1gXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKGdyaWRDZWxsLmRhdGFzZXQub2NjdXBpZWQgPT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgICAgIGVtcHR5R3JpZENlbGxzLnB1c2goZ3JpZENlbGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZW1wdHlHcmlkQ2VsbHMubGVuZ3RoID09PSBzaGlwVHlwZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGVtcHR5R3JpZENlbGxzLmZvckVhY2goKGdDZWxsLCBpKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGNlbGxDcHkgPSBnQ2VsbDtcbiAgICAgICAgICAgICAgY2VsbENweS5kYXRhc2V0Lm9jY3VwaWVkID0gc2hpcFR5cGUubmFtZTtcbiAgICAgICAgICAgICAgY2VsbENweS5kYXRhc2V0LnJvdyA9IHJvdztcbiAgICAgICAgICAgICAgY2VsbENweS5kYXRhc2V0LmNvbCA9IGNvbCArIGk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGdyaWQuYXBwZW5kQ2hpbGQobmV3U2hpcC5lbGVtZW50KTtcbiAgICAgICAgICAgIG5ld1NoaXAuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgSGFuZGxlcnMuYWJzRmxpcCk7XG4gICAgICAgICAgICBuZXdTaGlwLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCAoZURyYWdTdGFydCkgPT4ge1xuICAgICAgICAgICAgICBIYW5kbGVycy5hYnNEcmFnKGVEcmFnU3RhcnQsIFwic3RhcnRcIik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIG5ld1NoaXAuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZURyYWdFbmQpID0+IHtcbiAgICAgICAgICAgICAgSGFuZGxlcnMuYWJzRHJhZyhlRHJhZ0VuZCwgXCJkcm9wXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBwbGFjZWRTaGlwcy5wdXNoKG5ld1NoaXApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChyb3cgKyBzaGlwVHlwZS5sZW5ndGggPCAxMCkge1xuICAgICAgICBjb25zdCBuZXdTaGlwID0gbmV3IFNoaXBFbGVtZW50KFxuICAgICAgICAgIHNoaXBUeXBlLm5hbWUsXG4gICAgICAgICAgc2hpcFR5cGUubGVuZ3RoLFxuICAgICAgICAgIGNvbCxcbiAgICAgICAgICByb3csXG4gICAgICAgICAgXCJ2ZXJ0aWNhbFwiXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGVtcHR5R3JpZENlbGxzID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcFR5cGUubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBncmlkQ2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICBgLmdyaWQgPiAuZ3JpZC1jZWxsW2RhdGEtcm93PVwiJHtyb3cgKyBpfVwiXVtkYXRhLWNvbD1cIiR7Y29sfVwiXWBcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChncmlkQ2VsbC5kYXRhc2V0Lm9jY3VwaWVkID09PSBcIm5vbmVcIikge1xuICAgICAgICAgICAgZW1wdHlHcmlkQ2VsbHMucHVzaChncmlkQ2VsbCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChlbXB0eUdyaWRDZWxscy5sZW5ndGggPT09IHNoaXBUeXBlLmxlbmd0aCkge1xuICAgICAgICAgIGVtcHR5R3JpZENlbGxzLmZvckVhY2goKGdDZWxsLCBpKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjZWxsQ3B5ID0gZ0NlbGw7XG4gICAgICAgICAgICBjZWxsQ3B5LmRhdGFzZXQub2NjdXBpZWQgPSBzaGlwVHlwZS5uYW1lO1xuICAgICAgICAgICAgY2VsbENweS5kYXRhc2V0LnJvdyA9IHJvdyArIGk7XG4gICAgICAgICAgICBjZWxsQ3B5LmRhdGFzZXQuY29sID0gY29sO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGdyaWQuYXBwZW5kQ2hpbGQobmV3U2hpcC5lbGVtZW50KTtcbiAgICAgICAgICBuZXdTaGlwLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIEhhbmRsZXJzLmFic0ZsaXApO1xuICAgICAgICAgIG5ld1NoaXAuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlRHJhZ1N0YXJ0KSA9PiB7XG4gICAgICAgICAgICBIYW5kbGVycy5hYnNEcmFnKGVEcmFnU3RhcnQsIFwic3RhcnRcIik7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbmV3U2hpcC5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlRHJhZ0VuZCkgPT4ge1xuICAgICAgICAgICAgSGFuZGxlcnMuYWJzRHJhZyhlRHJhZ0VuZCwgXCJkcm9wXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHBsYWNlZFNoaXBzLnB1c2gobmV3U2hpcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3QgbGVmdFNoaXBzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcbiAgICAgIFwiYm9keSNidWlsZC1wbGF5ZXItYm9hcmQgPiAuc2hpcHMgPiBkaXYgPiAuc2hpcFwiXG4gICAgKTtcbiAgICBbLi4ubGVmdFNoaXBzXS5mb3JFYWNoKChsZWZ0U2hpcCkgPT4ge1xuICAgICAgbGVmdFNoaXAucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBIYW5kbGVycy5tb3VzZURvd24pO1xuICAgICAgbGVmdFNoaXAuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIFwiZmFsc2VcIik7XG4gICAgICBsZWZ0U2hpcC5jbGFzc0xpc3QuYWRkKFwiZW1wdHktYm94XCIpO1xuICAgICAgY29uc3QgYW1vdW50ID0gbGVmdFNoaXAucHJldmlvdXNFbGVtZW50U2libGluZy5jaGlsZHJlblswXTtcbiAgICAgIGFtb3VudC50ZXh0Q29udGVudCA9IFwiMHhcIjtcbiAgICAgIFsuLi5sZWZ0U2hpcC5jaGlsZHJlbl0uZm9yRWFjaCgoY2hpbGQpID0+IGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJoaWRkZW5cIikpO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckJ1dHRvbnMgPSAoKSA9PiB7XG4gICAgY29uc3QgYnV0dG9ucyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYnV0dG9ucy5jbGFzc0xpc3QuYWRkKFwiYnV0dG9uc1wiKTtcbiAgICBidXR0b25zLmlubmVySFRNTCA9IFV0aWxzLmJ1dHRvbnNIVE1MKCk7XG5cbiAgICBidXR0b25zLmNoaWxkcmVuWzFdLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCByYW5kb21pc2UpO1xuICAgIGJ1dHRvbnMuY2hpbGRyZW5bMl0uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIHJlc2V0KTtcblxuICAgIHJldHVybiBidXR0b25zO1xuICB9O1xuXG4gIGNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuICAgIGJvZHkuaWQgPSBcImJ1aWxkLXBsYXllci1ib2FyZFwiO1xuXG4gICAgY29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcbiAgICB0aXRsZS50ZXh0Q29udGVudCA9IFwiQnVpbGQgeW91ciBib2FyZFwiO1xuXG4gICAgY29uc3QgZ3JpZCA9IHJlbmRlckdyaWQoKTtcbiAgICBjb25zdCBpbmZvID0gcmVuZGVySW5mbygpO1xuICAgIGNvbnN0IHNoaXBzID0gcmVuZGVyU2hpcHMoKTtcbiAgICBjb25zdCBidXR0b25zID0gcmVuZGVyQnV0dG9ucygpO1xuICAgIGJvZHkuYXBwZW5kKHRpdGxlLCBzaGlwcywgZ3JpZCwgaW5mbywgYnV0dG9ucyk7XG5cbiAgICByZXR1cm4gc3RhcnQ7XG4gIH07XG5cbiAgcmV0dXJuIHsgaW5pdCB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBCdWlsZEJvYXJkO1xuIiwiY29uc3QgU2hpcEVsZW1lbnQgPSByZXF1aXJlKFwiLi4vZmFjdG9yaWVzL1NoaXBFbGVtZW50LmpzXCIpO1xuXG5jb25zdCBIYW5kbGVycyA9ICgoKSA9PiB7XG4gIGxldCBwYXJlbnRTaGlwO1xuICBsZXQgc2hpcENlbGw7XG4gIGxldCBncmlkQ2VsbHNHbG9iYWwgPSBbXTtcblxuICBsZXQgYWJzU3RhcnRYO1xuICBsZXQgYWJzU3RhcnRZO1xuICBsZXQgYWJzRW5kWDtcbiAgbGV0IGFic0VuZFk7XG4gIGxldCBhYnNTdGFydExlZnQ7XG4gIGxldCBhYnNTdGFydFRvcDtcbiAgbGV0IGVsZW1lbnRDbGlja2VkO1xuICBsZXQgY2xpY2tlZFBsYWNlZDtcbiAgbGV0IHN0YXJ0R3JpZENlbGxzO1xuXG4gIGNvbnN0IHVwZGF0ZVBsYWNlZFNoaXAgPSAoKSA9PiB7XG4gICAgaWYgKGFic1N0YXJ0WCA9PT0gYWJzRW5kWCAmJiBhYnNTdGFydFkgPT09IGFic0VuZFkpIHJldHVybjtcbiAgICBjb25zdCBkaXJlY3Rpb24gPSBlbGVtZW50Q2xpY2tlZC5jbGFzc05hbWUuaW5jbHVkZXMoXCJmbGlwXCIpXG4gICAgICA/IFwidmVydGljYWxcIlxuICAgICAgOiBcImhvcml6b250YWxcIjtcbiAgICBjb25zdCBsZWZ0U3RhcnQgPSArZWxlbWVudENsaWNrZWQuc3R5bGUubGVmdC5zbGljZSgwLCAtMik7XG4gICAgY29uc3QgdG9wU3RhcnQgPSArZWxlbWVudENsaWNrZWQuc3R5bGUudG9wLnNsaWNlKDAsIC0yKTtcbiAgICBjb25zdCB7IGxlbmd0aCB9ID0gZWxlbWVudENsaWNrZWQuY2hpbGRyZW47XG4gICAgY29uc3QgbGVmdEVuZCA9XG4gICAgICBkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiID8gbGVmdFN0YXJ0ICsgKGxlbmd0aCAtIDEpICogNDEgOiBsZWZ0U3RhcnQ7XG4gICAgY29uc3QgdG9wRW5kID1cbiAgICAgIGRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiID8gdG9wU3RhcnQgKyAobGVuZ3RoIC0gMSkgKiA0MSA6IHRvcFN0YXJ0O1xuXG4gICAgY29uc3QgZ3JpZENlbGxzID0gQXJyYXkuZnJvbShcbiAgICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZ3JpZCA+IC5ncmlkLWNlbGxcIilcbiAgICApO1xuICAgIGNvbnN0IHRvVXBkYXRlID0gW107XG5cbiAgICBncmlkQ2VsbHMuZm9yRWFjaCgoZ3JpZENlbGwpID0+IHtcbiAgICAgIGlmIChcbiAgICAgICAgZ3JpZENlbGwub2Zmc2V0TGVmdCA+PSBsZWZ0U3RhcnQgJiZcbiAgICAgICAgZ3JpZENlbGwub2Zmc2V0TGVmdCA8PSBsZWZ0RW5kICYmXG4gICAgICAgIGdyaWRDZWxsLm9mZnNldFRvcCA+PSB0b3BTdGFydCAmJlxuICAgICAgICBncmlkQ2VsbC5vZmZzZXRUb3AgPD0gdG9wRW5kXG4gICAgICApIHtcbiAgICAgICAgdG9VcGRhdGUucHVzaChncmlkQ2VsbCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0b1VwZGF0ZS5mb3JFYWNoKChnY2VsbCkgPT4ge1xuICAgICAgY29uc3QgZ2NlbGxDcHkgPSBnY2VsbDtcbiAgICAgIGdjZWxsQ3B5LmRhdGFzZXQub2NjdXBpZWQgPSBlbGVtZW50Q2xpY2tlZC5pZDtcbiAgICB9KTtcblxuICAgIGNvbnN0IHBsYWNlZENoaWxkcmVuID0gQXJyYXkuZnJvbShlbGVtZW50Q2xpY2tlZC5jaGlsZHJlbik7XG4gICAgcGxhY2VkQ2hpbGRyZW4uZm9yRWFjaCgob2xkUGxhY2VkQywgaSkgPT4ge1xuICAgICAgY29uc3QgY3B5ID0gb2xkUGxhY2VkQztcbiAgICAgIGNweS5kYXRhc2V0LnBsYWNlZFJvdyA9IHRvVXBkYXRlW2ldLmRhdGFzZXQucm93O1xuICAgICAgY3B5LmRhdGFzZXQucGxhY2VkQ29sID0gdG9VcGRhdGVbaV0uZGF0YXNldC5jb2w7XG4gICAgfSk7XG4gICAgY29uc3Qgb2xkVXBkYXRlID0gWy4uLnN0YXJ0R3JpZENlbGxzXS5maWx0ZXIoXG4gICAgICAoZ2NPbGQpID0+ICF0b1VwZGF0ZS5pbmNsdWRlcyhnY09sZClcbiAgICApO1xuICAgIG9sZFVwZGF0ZS5mb3JFYWNoKChjKSA9PiB7XG4gICAgICBjb25zdCBjcHkgPSBjO1xuICAgICAgY3B5LmRhdGFzZXQub2NjdXBpZWQgPSBcIm5vbmVcIjtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBzdGlja0Fic1NoaXAgPSAoc3RhcnRDZWxsKSA9PiB7XG4gICAgY29uc3QgaSA9IFsuLi5lbGVtZW50Q2xpY2tlZC5jaGlsZHJlbl0uZmluZEluZGV4KFxuICAgICAgKGVsKSA9PiBlbCA9PT0gY2xpY2tlZFBsYWNlZFxuICAgICk7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gZWxlbWVudENsaWNrZWQuY2xhc3NOYW1lLmluY2x1ZGVzKFwiZmxpcFwiKVxuICAgICAgPyBcInZlcnRpY2FsXCJcbiAgICAgIDogXCJob3Jpem9udGFsXCI7XG4gICAgbGV0IGxlZnQgPSArc3RhcnRDZWxsLm9mZnNldExlZnQ7XG4gICAgbGV0IHRvcCA9ICtzdGFydENlbGwub2Zmc2V0VG9wO1xuICAgIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSBsZWZ0IC09IGkgKiA0MTtcbiAgICBlbHNlIHRvcCAtPSBpICogNDE7XG4gICAgZWxlbWVudENsaWNrZWQuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICAgIGVsZW1lbnRDbGlja2VkLnN0eWxlLnRvcCA9IGAke3RvcH1weGA7XG4gIH07XG5cbiAgY29uc3QgdmFsaWRhdGVBYnNEcmFnID0gKGdyaWRDZWxsKSA9PiB7XG4gICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5mcm9tKGVsZW1lbnRDbGlja2VkLmNoaWxkcmVuKTtcbiAgICBjb25zdCB7IGxlbmd0aCB9ID0gY2hpbGRyZW47XG4gICAgY29uc3QgY2xpY2tlZEluZGV4ID0gY2hpbGRyZW4uZmluZEluZGV4KChlbCkgPT4gZWwgPT09IGNsaWNrZWRQbGFjZWQpO1xuICAgIGNvbnN0IGNlbGxzVG9DaGVjayA9IFtdO1xuICAgIGNvbnN0IGFmdGVyQ2VsbHMgPSBsZW5ndGggLSBjbGlja2VkSW5kZXggLSAxO1xuICAgIGNvbnN0IGJlZm9yZUNlbGxzID0gY2xpY2tlZEluZGV4O1xuICAgIGxldCBpID0gYWZ0ZXJDZWxscztcbiAgICBsZXQgaiA9IGJlZm9yZUNlbGxzO1xuICAgIGNvbnN0IHJvdyA9ICtncmlkQ2VsbC5kYXRhc2V0LnJvdztcbiAgICBjb25zdCBjb2wgPSArZ3JpZENlbGwuZGF0YXNldC5jb2w7XG4gICAgY29uc3QgZGlyZWN0aW9uID0gZWxlbWVudENsaWNrZWQuY2xhc3NOYW1lLmluY2x1ZGVzKFwiZmxpcFwiKVxuICAgICAgPyBcInZlcnRpY2FsXCJcbiAgICAgIDogXCJob3Jpem9udGFsXCI7XG4gICAgY2VsbHNUb0NoZWNrLnB1c2goZ3JpZENlbGwpO1xuICAgIGxldCBjdXJSb3cgPSByb3c7XG4gICAgbGV0IGN1ckNvbCA9IGNvbDtcblxuICAgIHdoaWxlIChpKSB7XG4gICAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgICBjdXJDb2wgKz0gMTtcbiAgICAgICAgaWYgKGN1ckNvbCA8IDEwICYmIGN1ckNvbCA+PSAwKSB7XG4gICAgICAgICAgY29uc3QgYWRkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGAuZ3JpZCA+IC5ncmlkLWNlbGxbZGF0YS1yb3c9XCIke3Jvd31cIl1bZGF0YS1jb2w9XCIke2N1ckNvbH1cIl1gXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjZWxsc1RvQ2hlY2sucHVzaChhZGQpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJSb3cgKz0gMTtcbiAgICAgICAgaWYgKGN1clJvdyA8IDEwICYmIGN1clJvdyA+PSAwKSB7XG4gICAgICAgICAgY29uc3QgYWRkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGAuZ3JpZCA+IC5ncmlkLWNlbGxbZGF0YS1yb3c9XCIke2N1clJvd31cIl1bZGF0YS1jb2w9XCIke2NvbH1cIl1gXG4gICAgICAgICAgKTtcbiAgICAgICAgICBjZWxsc1RvQ2hlY2sucHVzaChhZGQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpIC09IDE7XG4gICAgfVxuICAgIGN1ckNvbCA9IGNvbDtcbiAgICBjdXJSb3cgPSByb3c7XG4gICAgd2hpbGUgKGopIHtcbiAgICAgIGlmIChkaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGN1ckNvbCAtPSAxO1xuICAgICAgICBpZiAoY3VyQ29sIDwgMTAgJiYgY3VyQ29sID49IDApIHtcbiAgICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYC5ncmlkID4gLmdyaWQtY2VsbFtkYXRhLXJvdz1cIiR7cm93fVwiXVtkYXRhLWNvbD1cIiR7Y3VyQ29sfVwiXWBcbiAgICAgICAgICApO1xuICAgICAgICAgIGNlbGxzVG9DaGVjay5wdXNoKGFkZCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1clJvdyAtPSAxO1xuICAgICAgICBpZiAoY3VyUm93IDwgMTAgJiYgY3VyUm93ID49IDApIHtcbiAgICAgICAgICBjb25zdCBhZGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYC5ncmlkID4gLmdyaWQtY2VsbFtkYXRhLXJvdz1cIiR7Y3VyUm93fVwiXVtkYXRhLWNvbD1cIiR7Y29sfVwiXWBcbiAgICAgICAgICApO1xuICAgICAgICAgIGNlbGxzVG9DaGVjay5wdXNoKGFkZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGogLT0gMTtcbiAgICB9XG5cbiAgICBjb25zdCBhZGRlZENlbGxzID0gW107XG5cbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgaWYgKFxuICAgICAgICBjb2wgKyBhZnRlckNlbGxzID4gMTAgfHxcbiAgICAgICAgY29sIC0gYmVmb3JlQ2VsbHMgPCAwIHx8XG4gICAgICAgIGNlbGxzVG9DaGVjay5sZW5ndGggIT09IGxlbmd0aFxuICAgICAgKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGNlbGxzVG9DaGVjay5mb3JFYWNoKChncmlkQ2VsbEMpID0+IHtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIChncmlkQ2VsbEMuZGF0YXNldC5vY2N1cGllZCA9PT0gZWxlbWVudENsaWNrZWQuaWQgfHxcbiAgICAgICAgICAgIGdyaWRDZWxsQy5kYXRhc2V0Lm9jY3VwaWVkID09PSBcIm5vbmVcIikgJiZcbiAgICAgICAgICArZ3JpZENlbGxDLmRhdGFzZXQucm93ID09PSByb3dcbiAgICAgICAgKVxuICAgICAgICAgIGFkZGVkQ2VsbHMucHVzaChncmlkQ2VsbEMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChcbiAgICAgICAgcm93ICsgYWZ0ZXJDZWxscyA+IDEwIHx8XG4gICAgICAgIHJvdyAtIGJlZm9yZUNlbGxzIDwgMCB8fFxuICAgICAgICBjZWxsc1RvQ2hlY2subGVuZ3RoICE9PSBsZW5ndGhcbiAgICAgICkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBjZWxsc1RvQ2hlY2suZm9yRWFjaCgoZ3JpZENlbGxDKSA9PiB7XG4gICAgICAgIGlmIChcbiAgICAgICAgICAoZ3JpZENlbGxDLmRhdGFzZXQub2NjdXBpZWQgPT09IGVsZW1lbnRDbGlja2VkLmlkIHx8XG4gICAgICAgICAgICBncmlkQ2VsbEMuZGF0YXNldC5vY2N1cGllZCA9PT0gXCJub25lXCIpICYmXG4gICAgICAgICAgK2dyaWRDZWxsQy5kYXRhc2V0LmNvbCA9PT0gY29sXG4gICAgICAgIClcbiAgICAgICAgICBhZGRlZENlbGxzLnB1c2goZ3JpZENlbGxDKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gYWRkZWRDZWxscy5sZW5ndGggPT09IGxlbmd0aDtcbiAgfTtcblxuICBjb25zdCBnZXRHcmlkQ2VsbEJ5T2Zmc2V0ID0gKG1vdXNlWCwgbW91c2VZKSA9PiB7XG4gICAgY29uc3QgQ0VMTF9MRU5HVEggPSA0MTtcbiAgICBjb25zdCBDRUxMX0hFSUdIVCA9IDQxO1xuICAgIGNvbnN0IGRpZmZYID0gbW91c2VYICUgQ0VMTF9MRU5HVEg7XG4gICAgY29uc3QgZGlmZlkgPSBtb3VzZVkgJSBDRUxMX0hFSUdIVDtcbiAgICBjb25zdCBjZWxsU3RhcnRYID0gbW91c2VYIC0gZGlmZlg7XG4gICAgY29uc3QgY2VsbFN0YXJ0WSA9IG1vdXNlWSAtIGRpZmZZO1xuXG4gICAgY29uc3QgY2hpbGRyZW4gPSBBcnJheS5mcm9tKFxuICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcImJvZHkjYnVpbGQtcGxheWVyLWJvYXJkID4gLmdyaWQgPiAuZ3JpZC1jZWxsXCIpXG4gICAgKTtcblxuICAgIGxldCBjZWxsO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGlmIChcbiAgICAgICAgY2hpbGRyZW5baV0ub2Zmc2V0TGVmdCA9PT0gY2VsbFN0YXJ0WCAmJlxuICAgICAgICBjaGlsZHJlbltpXS5vZmZzZXRUb3AgPT09IGNlbGxTdGFydFlcbiAgICAgICkge1xuICAgICAgICBjZWxsID0gY2hpbGRyZW5baV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2VsbDtcbiAgfTtcblxuICBjb25zdCByZXNldFNoaXBHbG9iYWxzID0gKCkgPT4ge1xuICAgIHBhcmVudFNoaXAgPSB1bmRlZmluZWQ7XG4gICAgc2hpcENlbGwgPSB1bmRlZmluZWQ7XG4gICAgZ3JpZENlbGxzR2xvYmFsID0gW107XG4gIH07XG5cbiAgY29uc3QgcmVzZXRBYnNHbG9iYWxzID0gKCkgPT4ge1xuICAgIGFic1N0YXJ0WCA9IHVuZGVmaW5lZDtcbiAgICBhYnNTdGFydFkgPSB1bmRlZmluZWQ7XG4gICAgYWJzRW5kWCA9IHVuZGVmaW5lZDtcbiAgICBhYnNFbmRZID0gdW5kZWZpbmVkO1xuICAgIGFic1N0YXJ0TGVmdCA9IHVuZGVmaW5lZDtcbiAgICBhYnNTdGFydFRvcCA9IHVuZGVmaW5lZDtcbiAgICBlbGVtZW50Q2xpY2tlZCA9IHVuZGVmaW5lZDtcbiAgICBjbGlja2VkUGxhY2VkID0gdW5kZWZpbmVkO1xuICAgIHN0YXJ0R3JpZENlbGxzID0gW107XG4gIH07XG5cbiAgY29uc3QgcmVzZXRWYWxpZGl0eSA9ICgpID0+IHtcbiAgICBjb25zdCBpbnZhbGlkcyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5kcmFnLWludmFsaWRcIikpO1xuICAgIGludmFsaWRzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImRyYWctaW52YWxpZFwiKTtcbiAgICB9KTtcbiAgICBjb25zdCB2YWxpZHMgPSBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuZHJhZy12YWxpZFwiKSk7XG4gICAgdmFsaWRzLmZvckVhY2goKGNlbGwpID0+IHtcbiAgICAgIGNlbGwuY2xhc3NMaXN0LnJlbW92ZShcImRyYWctdmFsaWRcIik7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgZmxpcEVycm9yID0gKGVsZW1lbnQpID0+IHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmbGlwLWVycm9yXCIpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFwiZmxpcC1lcnJvclwiKTtcbiAgICB9LCAxNTAwKTtcbiAgfTtcblxuICBjb25zdCBhYnNGbGlwID0gKGUpID0+IHtcbiAgICBpZiAoYWJzU3RhcnRYICE9PSBhYnNFbmRYIHx8IGFic1N0YXJ0WSAhPT0gYWJzRW5kWSkge1xuICAgICAgcmVzZXRBYnNHbG9iYWxzKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNQYXJlbnQgPSAhZS50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKFwicGxhY2VkLWNlbGxcIik7XG5cbiAgICBjb25zdCBlbGVtZW50ID0gaXNQYXJlbnQgPyBlLnRhcmdldCA6IGUudGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgY29uc3QgeyBsZW5ndGggfSA9IGVsZW1lbnQuY2hpbGRyZW47XG4gICAgY29uc3Qgc3RhcnRYID0gK2VsZW1lbnQuY2hpbGRyZW5bMF0uZGF0YXNldC5wbGFjZWRDb2w7XG4gICAgY29uc3Qgc3RhcnRZID0gK2VsZW1lbnQuY2hpbGRyZW5bMF0uZGF0YXNldC5wbGFjZWRSb3c7XG5cbiAgICBjb25zdCBuZXdPY2N1cGllZCA9IFtdO1xuXG4gICAgaWYgKGVsZW1lbnQuY2xhc3NOYW1lLmluY2x1ZGVzKFwiZmxpcFwiKSkge1xuICAgICAgaWYgKHN0YXJ0WCArIGxlbmd0aCA+IDEwKSB7XG4gICAgICAgIGZsaXBFcnJvcihlbGVtZW50KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgLmdyaWQtY2VsbFtkYXRhLXJvdz1cIiR7c3RhcnRZfVwiXVtkYXRhLWNvbD1cIiR7c3RhcnRYICsgaX1cIl1gXG4gICAgICAgICk7XG4gICAgICAgIGlmIChjZWxsLmRhdGFzZXQub2NjdXBpZWQgIT09IFwibm9uZVwiKSB7XG4gICAgICAgICAgZmxpcEVycm9yKGVsZW1lbnQpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBuZXdPY2N1cGllZC5wdXNoKGNlbGwpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoc3RhcnRZICsgbGVuZ3RoID4gMTApIHtcbiAgICAgICAgZmxpcEVycm9yKGVsZW1lbnQpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGAuZ3JpZC1jZWxsW2RhdGEtcm93PVwiJHtzdGFydFkgKyBpfVwiXVtkYXRhLWNvbD1cIiR7c3RhcnRYfVwiXWBcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGNlbGwuZGF0YXNldC5vY2N1cGllZCAhPT0gXCJub25lXCIpIHtcbiAgICAgICAgICBmbGlwRXJyb3IoZWxlbWVudCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIG5ld09jY3VwaWVkLnB1c2goY2VsbCk7XG4gICAgICB9XG4gICAgfVxuICAgIG5ld09jY3VwaWVkLmZvckVhY2goKGVsLCBpKSA9PiB7XG4gICAgICBjb25zdCBncmlkQ2VsbEUgPSBlbDtcbiAgICAgIGdyaWRDZWxsRS5kYXRhc2V0Lm9jY3VwaWVkID0gZWxlbWVudC5pZDtcbiAgICAgIGNvbnN0IG5ld1JvdyA9ICtncmlkQ2VsbEUuZGF0YXNldC5yb3c7XG4gICAgICBjb25zdCBuZXdDb2wgPSArZ3JpZENlbGxFLmRhdGFzZXQuY29sO1xuICAgICAgY29uc3Qgb2xkUm93ID0gZWxlbWVudC5jaGlsZHJlbltpICsgMV0uZGF0YXNldC5wbGFjZWRSb3c7XG4gICAgICBjb25zdCBvbGRDb2wgPSBlbGVtZW50LmNoaWxkcmVuW2kgKyAxXS5kYXRhc2V0LnBsYWNlZENvbDtcbiAgICAgIGVsZW1lbnQuY2hpbGRyZW5baSArIDFdLmRhdGFzZXQucGxhY2VkUm93ID0gbmV3Um93O1xuICAgICAgZWxlbWVudC5jaGlsZHJlbltpICsgMV0uZGF0YXNldC5wbGFjZWRDb2wgPSBuZXdDb2w7XG4gICAgICBjb25zdCBvbGRDZWxsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS1yb3c9XCIke29sZFJvd31cIl1bZGF0YS1jb2w9XCIke29sZENvbH1cIl1gXG4gICAgICApO1xuICAgICAgb2xkQ2VsbC5kYXRhc2V0Lm9jY3VwaWVkID0gXCJub25lXCI7XG4gICAgfSk7XG4gICAgZWxlbWVudC5jbGFzc0xpc3QudG9nZ2xlKFwiZmxpcFwiKTtcbiAgfTtcblxuICBjb25zdCBhYnNEcmFnID0gKGUsIHR5cGUpID0+IHtcbiAgICBjb25zdCBNSU5fTU9VU0UgPSAwO1xuICAgIGNvbnN0IE1BWF9NT1VTRSA9IDEwICogNDE7XG4gICAgbGV0IGRyYWdYO1xuICAgIGxldCBkcmFnWTtcblxuICAgIGlmICh0eXBlID09PSBcImRyb3BcIikge1xuICAgICAgaWYgKGVsZW1lbnRDbGlja2VkLmNsYXNzTmFtZS5pbmNsdWRlcyhcImludmFsaWRcIikpIHtcbiAgICAgICAgZWxlbWVudENsaWNrZWQuc3R5bGUubGVmdCA9IGAke2Fic1N0YXJ0TGVmdH1weGA7XG4gICAgICAgIGVsZW1lbnRDbGlja2VkLnN0eWxlLnRvcCA9IGAke2Fic1N0YXJ0VG9wfXB4YDtcbiAgICAgICAgZWxlbWVudENsaWNrZWQuY2xhc3NMaXN0LnJlbW92ZShcImludmFsaWRcIik7XG4gICAgICAgIGVsZW1lbnRDbGlja2VkID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhYnNFbmRYID0gK2UueDtcbiAgICAgIGFic0VuZFkgPSArZS55O1xuICAgICAgdXBkYXRlUGxhY2VkU2hpcCgpO1xuICAgICAgZWxlbWVudENsaWNrZWQgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09IFwic3RhcnRcIikge1xuICAgICAgZWxlbWVudENsaWNrZWQgPSBlLnRhcmdldC5jbGFzc05hbWUuaW5jbHVkZXMoXCJwbGFjZWQtY2VsbFwiKVxuICAgICAgICA/IGUudGFyZ2V0LnBhcmVudEVsZW1lbnRcbiAgICAgICAgOiBlLnRhcmdldDtcbiAgICAgIGlmIChlLnRhcmdldC5jbGFzc05hbWUuaW5jbHVkZXMoXCJwbGFjZWQtY2VsbFwiKSkge1xuICAgICAgICBjbGlja2VkUGxhY2VkID0gZS50YXJnZXQ7XG4gICAgICB9XG4gICAgICBzdGFydEdyaWRDZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXG4gICAgICAgIGBib2R5ID4gLmdyaWQgPiAuZ3JpZC1jZWxsW2RhdGEtb2NjdXBpZWQ9XCIke2VsZW1lbnRDbGlja2VkLmlkfVwiXWBcbiAgICAgICk7XG4gICAgICBhYnNTdGFydFggPSArZS54O1xuICAgICAgYWJzU3RhcnRZID0gK2UueTtcbiAgICAgIGFic1N0YXJ0TGVmdCA9ICtlbGVtZW50Q2xpY2tlZC5zdHlsZS5sZWZ0LnNsaWNlKDAsIC0yKTtcbiAgICAgIGFic1N0YXJ0VG9wID0gK2VsZW1lbnRDbGlja2VkLnN0eWxlLnRvcC5zbGljZSgwLCAtMik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09IFwiZHJhZ1wiKSB7XG4gICAgICBpZiAoIWVsZW1lbnRDbGlja2VkKSByZXR1cm47XG4gICAgICBsZXQgaXNWYWxpZDtcbiAgICAgIGxldCBob3ZlckdyaWRDZWxsO1xuXG4gICAgICBpZiAoXG4gICAgICAgIGUudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcyhcInBsYWNlZC1jZWxsXCIpICYmXG4gICAgICAgIGUudGFyZ2V0LnBhcmVudEVsZW1lbnQgPT09IGNsaWNrZWRQbGFjZWQucGFyZW50RWxlbWVudFxuICAgICAgKSB7XG4gICAgICAgIGNvbnN0IG1vdXNlWCA9IGVsZW1lbnRDbGlja2VkLm9mZnNldExlZnQgKyBlLmxheWVyWDtcbiAgICAgICAgY29uc3QgbW91c2VZID0gZWxlbWVudENsaWNrZWQub2Zmc2V0VG9wICsgZS5sYXllclk7XG4gICAgICAgIGhvdmVyR3JpZENlbGwgPSBnZXRHcmlkQ2VsbEJ5T2Zmc2V0KG1vdXNlWCwgbW91c2VZKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgIG1vdXNlWCA+IE1JTl9NT1VTRSAmJlxuICAgICAgICAgIG1vdXNlWCA8IE1BWF9NT1VTRSAmJlxuICAgICAgICAgIG1vdXNlWSA+IE1JTl9NT1VTRSAmJlxuICAgICAgICAgIG1vdXNlWSA8IE1BWF9NT1VTRVxuICAgICAgICApIHtcbiAgICAgICAgICBpc1ZhbGlkID0gdmFsaWRhdGVBYnNEcmFnKGhvdmVyR3JpZENlbGwpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGUudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcyhcImdyaWQtY2VsbFwiKSkge1xuICAgICAgICBob3ZlckdyaWRDZWxsID0gZS50YXJnZXQ7XG4gICAgICAgIGlzVmFsaWQgPSB2YWxpZGF0ZUFic0RyYWcoaG92ZXJHcmlkQ2VsbCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChpc1ZhbGlkKSB7XG4gICAgICAgIGVsZW1lbnRDbGlja2VkLmNsYXNzTGlzdC5hZGQoXCJ2YWxpZFwiKTtcbiAgICAgICAgZWxlbWVudENsaWNrZWQuY2xhc3NMaXN0LnJlbW92ZShcImludmFsaWRcIik7XG4gICAgICAgIHN0aWNrQWJzU2hpcChob3ZlckdyaWRDZWxsKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBkcmFnWCA9ICtlLng7XG4gICAgICBkcmFnWSA9ICtlLnk7XG4gICAgICBjb25zdCBuZXdYID0gZHJhZ1ggLSBhYnNTdGFydFg7XG4gICAgICBjb25zdCBuZXdZID0gZHJhZ1kgLSBhYnNTdGFydFk7XG4gICAgICBlbGVtZW50Q2xpY2tlZC5zdHlsZS5sZWZ0ID0gYCR7YWJzU3RhcnRMZWZ0ICsgbmV3WH1weGA7XG4gICAgICBlbGVtZW50Q2xpY2tlZC5zdHlsZS50b3AgPSBgJHthYnNTdGFydFRvcCArIG5ld1l9cHhgO1xuICAgICAgZWxlbWVudENsaWNrZWQuY2xhc3NMaXN0LmFkZChcImludmFsaWRcIik7XG4gICAgICBlbGVtZW50Q2xpY2tlZC5jbGFzc0xpc3QucmVtb3ZlKFwidmFsaWRcIik7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGRyYWcgPSAoZSkgPT4ge1xuICAgIGNvbnN0IGxlYXZlID0gKGxlYXZlRSkgPT4ge1xuICAgICAgY29uc3QgeyByZWxhdGVkVGFyZ2V0IH0gPSBsZWF2ZUU7XG4gICAgICBpZiAocmVsYXRlZFRhcmdldCA9PT0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHkjYnVpbGQtcGxheWVyLWJvYXJkXCIpKSB7XG4gICAgICAgIGdyaWRDZWxsc0dsb2JhbCA9IFtdO1xuICAgICAgICByZXNldFZhbGlkaXR5KCk7XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBlbnRlciA9IChlbnRlckUpID0+IHtcbiAgICAgIHJlc2V0VmFsaWRpdHkoKTtcbiAgICAgIGlmIChlbnRlckUudGFyZ2V0LmNsYXNzTmFtZS5pbmNsdWRlcyhcImdyaWQtY2VsbFwiKSAmJiBwYXJlbnRTaGlwKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IE51bWJlcihwYXJlbnRTaGlwLmRhdGFzZXQuc2hpcExlbmd0aCk7XG4gICAgICAgIGNvbnN0IHNoaXBDZWxsSW5kZXggPSBOdW1iZXIoc2hpcENlbGwuZGF0YXNldC5pbmRleCk7XG4gICAgICAgIGNvbnN0IGdyaWRDZWxsUm93ID0gTnVtYmVyKGVudGVyRS50YXJnZXQuZGF0YXNldC5yb3cpO1xuICAgICAgICBjb25zdCBncmlkQ2VsbENvbCA9IE51bWJlcihlbnRlckUudGFyZ2V0LmRhdGFzZXQuY29sKTtcblxuICAgICAgICBjb25zdCByaWdodENlbGxzID0gbGVuZ3RoIC0gc2hpcENlbGxJbmRleDtcbiAgICAgICAgY29uc3QgbGVmdENlbGxzID0gc2hpcENlbGxJbmRleDtcbiAgICAgICAgY29uc3QgZ3JpZENlbGxzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByaWdodENlbGxzOyBpICs9IDEpIHtcbiAgICAgICAgICBjb25zdCBjdXJyZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgIGBkaXYuZ3JpZCA+IC5ncmlkLWNlbGxbZGF0YS1yb3c9XCIke2dyaWRDZWxsUm93fVwiXVtkYXRhLWNvbD1cIiR7XG4gICAgICAgICAgICAgIGdyaWRDZWxsQ29sICsgaVxuICAgICAgICAgICAgfVwiXWBcbiAgICAgICAgICApO1xuICAgICAgICAgIGlmIChjdXJyZW50ICYmIGN1cnJlbnQuZGF0YXNldC5vY2N1cGllZCA9PT0gXCJub25lXCIpXG4gICAgICAgICAgICBncmlkQ2VsbHMucHVzaChjdXJyZW50KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlZnRDZWxsczsgaSArPSAxKSB7XG4gICAgICAgICAgY29uc3QgY3VycmVudCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgICBgZGl2LmdyaWQgPiAuZ3JpZC1jZWxsW2RhdGEtcm93PVwiJHtncmlkQ2VsbFJvd31cIl1bZGF0YS1jb2w9XCIke1xuICAgICAgICAgICAgICBncmlkQ2VsbENvbCAtIDEgLSBpXG4gICAgICAgICAgICB9XCJdYFxuICAgICAgICAgICk7XG4gICAgICAgICAgaWYgKGN1cnJlbnQpIGdyaWRDZWxscy51bnNoaWZ0KGN1cnJlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZ3JpZENlbGxzR2xvYmFsID0gZ3JpZENlbGxzO1xuICAgICAgICBpZiAoZ3JpZENlbGxzLmxlbmd0aCAhPT0gbGVuZ3RoKSB7XG4gICAgICAgICAgZ3JpZENlbGxzLmZvckVhY2goKGdyaWRDZWxsKSA9PiB7XG4gICAgICAgICAgICBncmlkQ2VsbC5jbGFzc0xpc3QuYWRkKFwiZHJhZy1pbnZhbGlkXCIpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKGdyaWRDZWxscy5sZW5ndGggPT09IGxlbmd0aCkge1xuICAgICAgICAgIGdyaWRDZWxscy5mb3JFYWNoKChncmlkQ2VsbCkgPT4ge1xuICAgICAgICAgICAgZ3JpZENlbGwuY2xhc3NMaXN0LmFkZChcImRyYWctdmFsaWRcIik7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IGVuZCA9ICgpID0+IHtcbiAgICAgIHJlc2V0VmFsaWRpdHkoKTtcbiAgICAgIGlmICghZ3JpZENlbGxzR2xvYmFsLmxlbmd0aCkgcmV0dXJuO1xuICAgICAgaWYgKGdyaWRDZWxsc0dsb2JhbC5sZW5ndGggPT09ICtwYXJlbnRTaGlwLmRhdGFzZXQuc2hpcExlbmd0aCkge1xuICAgICAgICBjb25zdCBzTmFtZSA9IHBhcmVudFNoaXAucGFyZW50RWxlbWVudC5pZDtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gcGFyZW50U2hpcC5kYXRhc2V0LnNoaXBMZW5ndGg7XG4gICAgICAgIGNvbnN0IHhPZmYgPSArZ3JpZENlbGxzR2xvYmFsWzBdLmRhdGFzZXQuY29sO1xuICAgICAgICBjb25zdCB5T2ZmID0gK2dyaWRDZWxsc0dsb2JhbFswXS5kYXRhc2V0LnJvdztcblxuICAgICAgICBjb25zdCBhYnNTaGlwID0gbmV3IFNoaXBFbGVtZW50KHNOYW1lLCBsZW5ndGgsIHhPZmYsIHlPZmYpO1xuICAgICAgICBkb2N1bWVudFxuICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiI2J1aWxkLXBsYXllci1ib2FyZCA+IGRpdi5ncmlkXCIpXG4gICAgICAgICAgLmFwcGVuZENoaWxkKGFic1NoaXAuZWxlbWVudCk7XG5cbiAgICAgICAgQXJyYXkuZnJvbShhYnNTaGlwLmVsZW1lbnQuY2hpbGRyZW4pLmZvckVhY2goKGNoaWxkKSA9PiB7XG4gICAgICAgICAgY29uc3QgZ3JpZEMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYC5ncmlkLWNlbGxbZGF0YS1yb3c9XCIke2NoaWxkLmRhdGFzZXQucGxhY2VkUm93fVwiXVtkYXRhLWNvbD1cIiR7Y2hpbGQuZGF0YXNldC5wbGFjZWRDb2x9XCJdYFxuICAgICAgICAgICk7XG4gICAgICAgICAgZ3JpZEMuZGF0YXNldC5vY2N1cGllZCA9IGFic1NoaXAuZWxlbWVudC5pZDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYWJzU2hpcC5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhYnNGbGlwKTtcbiAgICAgICAgYWJzU2hpcC5lbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGVEcmFnU3RhcnQpID0+XG4gICAgICAgICAgYWJzRHJhZyhlRHJhZ1N0YXJ0LCBcInN0YXJ0XCIpXG4gICAgICAgICk7XG4gICAgICAgIGFic1NoaXAuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCAoZURyYWdFbmQpID0+XG4gICAgICAgICAgYWJzRHJhZyhlRHJhZ0VuZCwgXCJkcm9wXCIpXG4gICAgICAgICk7XG5cbiAgICAgICAgcGFyZW50U2hpcC5jbGFzc0xpc3QuYWRkKFwiZW1wdHktYm94XCIpO1xuICAgICAgICBwYXJlbnRTaGlwLnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBmYWxzZSk7XG4gICAgICAgIGNvbnN0IHBhcmVudENoaWxkcmVuID0gQXJyYXkuZnJvbShwYXJlbnRTaGlwLmNoaWxkcmVuKTtcbiAgICAgICAgcGFyZW50Q2hpbGRyZW4uZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgICAgICBjaGlsZC5jbGFzc0xpc3QuYWRkKFwiaGlkZGVuXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgYW1vdW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgIyR7cGFyZW50U2hpcC5wYXJlbnRFbGVtZW50LmlkfSBzcGFuW2RhdGEtc2hpcD1cImFtb3VudFwiXWBcbiAgICAgICAgKTtcbiAgICAgICAgYW1vdW50LnRleHRDb250ZW50ID0gXCIweFwiO1xuXG4gICAgICAgIHBhcmVudFNoaXAucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCBkcmFnKTtcbiAgICAgICAgcGFyZW50U2hpcC5yZW1vdmVFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCBkcmFnKTtcbiAgICAgIH1cblxuICAgICAgcmVzZXRTaGlwR2xvYmFscygpO1xuICAgIH07XG5cbiAgICBpZiAoZS50eXBlID09PSBcImRyYWdsZWF2ZVwiKSBsZWF2ZShlKTtcbiAgICBpZiAoZS50eXBlID09PSBcImRyYWdlbnRlclwiKSBlbnRlcihlKTtcbiAgICBpZiAoZS50eXBlID09PSBcImRyYWdlbmRcIikgZW5kKGUpO1xuICB9O1xuXG4gIGNvbnN0IG1vdXNlRG93biA9IChlKSA9PiB7XG4gICAgc2hpcENlbGwgPSBlLnRhcmdldDtcbiAgICBwYXJlbnRTaGlwID0gZS50YXJnZXQucGFyZW50RWxlbWVudDtcbiAgICBwYXJlbnRTaGlwLmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnc3RhcnRcIiwgZHJhZyk7XG4gICAgcGFyZW50U2hpcC5hZGRFdmVudExpc3RlbmVyKFwiZHJhZ2VuZFwiLCBkcmFnKTtcbiAgfTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4gYWJzRHJhZyhlLCBcImRyYWdcIikpO1xuXG4gIHJldHVybiB7IG1vdXNlRG93biwgZHJhZywgYWJzRHJhZywgYWJzRmxpcCB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBIYW5kbGVycztcbiIsImNvbnN0IFNoaXAgPSByZXF1aXJlKFwiLi4vZmFjdG9yaWVzL3NoaXAuanNcIik7XG5jb25zdCBHYW1lID0gcmVxdWlyZShcIi4uL2dhbWUuanNcIik7XG5jb25zdCBVdGlscyA9IHJlcXVpcmUoXCIuL3V0aWxzLmpzXCIpO1xuXG5jb25zdCBHYW1lSW5Qcm9ncmVzcyA9ICgoKSA9PiB7XG4gIGNvbnN0IHJlc2V0ID0gKCkgPT4ge1xuICAgIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5LmluLXByb2dyZXNzXCIpLnJlbW92ZSgpO1xuICAgIGNvbnN0IG5ld0JvZHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYm9keVwiKTtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaHRtbFwiKS5hcHBlbmRDaGlsZChuZXdCb2R5KTtcbiAgICBHYW1lLnJlc2V0KCk7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUmVzZXRCdG4gPSAoKSA9PiB7XG4gICAgY29uc3QgYnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcbiAgICBidG4uc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcImJ1dHRvblwiKTtcbiAgICBidG4uY2xhc3NMaXN0LmFkZChcInJlc2V0LWdhbWVcIik7XG4gICAgYnRuLnRleHRDb250ZW50ID0gXCJSZXNldFwiO1xuXG4gICAgcmV0dXJuIGJ0bjtcbiAgfTtcblxuICBjb25zdCBnYW1lT3ZlciA9ICh3aW5uZXIpID0+IHtcbiAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHkuaW4tcHJvZ3Jlc3MgPiBwXCIpO1xuXG4gICAgY29uc3Qgc3RyVSA9IHdpbm5lci5uYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyB3aW5uZXIubmFtZS5zbGljZSgxKTtcbiAgICBjb25zdCBzdHJMID0gd2lubmVyLm5hbWU7XG4gICAgbmFtZS5pbm5lckhUTUwgPSBgPHNwYW4gY2xhc3M9XCIke3N0ckx9XCI+JHtzdHJVfTwvc3Bhbj4gd2luc2A7XG4gIH07XG5cbiAgY29uc3Qgc2V0TmFtZSA9IChwbGF5ZXIpID0+IHtcbiAgICBjb25zdCBuYW1lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImJvZHkuaW4tcHJvZ3Jlc3MgPiBwXCIpO1xuXG4gICAgbmFtZS5pbm5lckhUTUwgPVxuICAgICAgcGxheWVyID09PSBcIlBsYXllclwiXG4gICAgICAgID8gYDxzcGFuIGNsYXNzPVwicGxheWVyXCI+UGxheWVyPC9zcGFuPiB0dXJuYFxuICAgICAgICA6IGA8c3BhbiBjbGFzcz1cImNvbXB1dGVyXCI+Q29tcHV0ZXI8L3NwYW4+IHR1cm5gO1xuICB9O1xuXG4gIGNvbnN0IHJlc3RvcmVHcmlkTGlzdGVuZXIgPSAoZWxlbWVudCwgY2IpID0+IHtcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBjYik7XG4gIH07XG5cbiAgY29uc3QgZGlzcGxheUNvbXB1dGVyVHVybiA9IChyZXMpID0+IHtcbiAgICBjb25zdCBbcmVzdWx0LCB4LCB5XSA9IHJlcztcblxuICAgIGlmIChyZXMgaW5zdGFuY2VvZiBFcnJvcikgcmV0dXJuO1xuXG4gICAgY29uc3QgY2VsbERpdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICBgI3BsYXllciA+IC5ncmlkID4gZGl2W2RhdGEtcm93PVwiJHt4fVwiXVtkYXRhLWNvbD1cIiR7eX1cIl1gXG4gICAgKTtcbiAgICBpZiAocmVzdWx0LnNoaXApIHtcbiAgICAgIGNlbGxEaXYuY2xhc3NMaXN0LmFkZChcInNoaXAtaGl0XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjZWxsRGl2LmNsYXNzTGlzdC5hZGQoXCJtaXNzXCIpO1xuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBoYW5kbGVyKGUpIHtcbiAgICBpZiAoZS50YXJnZXQuZGF0YXNldC5jZWxsKSB7XG4gICAgICBpZiAoZS50YXJnZXQuY2xhc3NOYW1lLmluY2x1ZGVzKFwiaGl0XCIpKSByZXR1cm47XG4gICAgICBlLnRhcmdldC5jbGFzc0xpc3QuYWRkKFwiaGl0XCIpO1xuXG4gICAgICBjb25zdCB4ID0gTnVtYmVyKGUudGFyZ2V0LmRhdGFzZXQucm93KTtcbiAgICAgIGNvbnN0IHkgPSBOdW1iZXIoZS50YXJnZXQuZGF0YXNldC5jb2wpO1xuXG4gICAgICBjb25zdCByZXN1bHQgPSBHYW1lLnBsYXlIdW1hbih4LCB5KTtcbiAgICAgIGlmIChyZXN1bHQud2lubmVyKSB7XG4gICAgICAgIHJlc3VsdC5zdW5rQ29vcmQuZm9yRWFjaCgocGFpcikgPT4ge1xuICAgICAgICAgIGRvY3VtZW50XG4gICAgICAgICAgICAucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICAgICAgYCNjb21wdXRlciBkaXZbZGF0YS1yb3c9XCIke3BhaXJbMF19XCJdW2RhdGEtY29sPVwiJHtwYWlyWzFdfVwiXWBcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIC5jbGFzc0xpc3QuYWRkKFwic2hpcC1jZWxsXCIpO1xuICAgICAgICB9KTtcbiAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcInNoaXAtaGl0XCIpO1xuICAgICAgICBnYW1lT3ZlcihyZXN1bHQud2lubmVyKTtcbiAgICAgICAgdGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgaGFuZGxlcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmICghcmVzdWx0LnNoaXApIHtcbiAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcIm1pc3NcIik7XG4gICAgICB9XG4gICAgICBpZiAocmVzdWx0LnNoaXApIHtcbiAgICAgICAgZS50YXJnZXQuY2xhc3NMaXN0LmFkZChcInNoaXAtaGl0XCIpO1xuICAgICAgfVxuICAgICAgaWYgKHJlc3VsdC5zdW5rQ29vcmQpIHtcbiAgICAgICAgcmVzdWx0LnN1bmtDb29yZC5mb3JFYWNoKChwYWlyKSA9PiB7XG4gICAgICAgICAgZG9jdW1lbnRcbiAgICAgICAgICAgIC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgICBgI2NvbXB1dGVyIGRpdltkYXRhLXJvdz1cIiR7cGFpclswXX1cIl1bZGF0YS1jb2w9XCIke3BhaXJbMV19XCJdYFxuICAgICAgICAgICAgKVxuICAgICAgICAgICAgLmNsYXNzTGlzdC5hZGQoXCJzaGlwLWNlbGxcIik7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcbiAgICAgIHNldE5hbWUoXCJDb21wdXRlclwiKTtcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCBjcmVzdWx0ID0gR2FtZS5wbGF5Q29tcHV0ZXIoKTtcbiAgICAgICAgaWYgKGNyZXN1bHQud2lubmVyKSB7XG4gICAgICAgICAgZ2FtZU92ZXIoY3Jlc3VsdC53aW5uZXIpO1xuICAgICAgICAgIGRpc3BsYXlDb21wdXRlclR1cm4oY3Jlc3VsdC5yZXN1bHQpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZXIpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBkaXNwbGF5Q29tcHV0ZXJUdXJuKGNyZXN1bHQpO1xuICAgICAgICByZXN0b3JlR3JpZExpc3RlbmVyKHRoaXMsIGhhbmRsZXIpO1xuICAgICAgICBzZXROYW1lKFwiUGxheWVyXCIpO1xuICAgICAgfSwgMTAwMCk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0TmFtZUVsZW1lbnQgPSAocGxheWVyTmFtZSkgPT4ge1xuICAgIGNvbnN0IG5hbWVQID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG4gICAgbmFtZVAuY2xhc3NMaXN0LmFkZChcIm5hbWVcIik7XG4gICAgbmFtZVAudGV4dENvbnRlbnQgPSBwbGF5ZXJOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBwbGF5ZXJOYW1lLnNsaWNlKDEpO1xuXG4gICAgcmV0dXJuIG5hbWVQO1xuICB9O1xuXG4gIGNvbnN0IGdldEdyaWRFbGVtZW50ID0gKGdyaWQsIHBsYXllck5hbWUpID0+IHtcbiAgICBjb25zdCBncmlkRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBncmlkRGl2LmNsYXNzTGlzdC5hZGQoXCJncmlkXCIpO1xuICAgIGZvciAobGV0IHJvdyA9IDA7IHJvdyA8IGdyaWQubGVuZ3RoOyByb3cgKz0gMSkge1xuICAgICAgZm9yIChsZXQgY29sID0gMDsgY29sIDwgZ3JpZFtyb3ddLmxlbmd0aDsgY29sICs9IDEpIHtcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgaWYgKGdyaWRbcm93XVtjb2xdIGluc3RhbmNlb2YgU2hpcCkge1xuICAgICAgICAgIGlmIChwbGF5ZXJOYW1lID09PSBcInBsYXllclwiKSB7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChcInNoaXAtY2VsbFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZGl2LmRhdGFzZXQuY2VsbCA9IFwiY2VsbFwiO1xuICAgICAgICBkaXYuZGF0YXNldC5yb3cgPSByb3c7XG4gICAgICAgIGRpdi5kYXRhc2V0LmNvbCA9IGNvbDtcbiAgICAgICAgZ3JpZERpdi5hcHBlbmRDaGlsZChkaXYpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBncmlkRGl2O1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclBsYXllciA9IChwbGF5ZXJPYmosIGJvZHksIGxlZ2VuZCkgPT4ge1xuICAgIGNvbnN0IHBsYXllciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcGxheWVyLmlkID0gcGxheWVyT2JqLm5hbWU7XG4gICAgcGxheWVyLmNsYXNzTGlzdC5hZGQoXCJjb250YWluZXJcIik7XG5cbiAgICBjb25zdCBwbGF5ZXJOYW1lID0gZ2V0TmFtZUVsZW1lbnQocGxheWVyT2JqLm5hbWUpO1xuICAgIGNvbnN0IGdyaWQgPSBnZXRHcmlkRWxlbWVudChwbGF5ZXJPYmouYm9hcmQuZ3JpZCwgcGxheWVyT2JqLm5hbWUpO1xuICAgIGlmIChwbGF5ZXJPYmoubmFtZSA9PT0gXCJjb21wdXRlclwiKSBncmlkLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVyKTtcblxuICAgIHBsYXllci5hcHBlbmQocGxheWVyTmFtZSwgZ3JpZCk7XG4gICAgYm9keS5hcHBlbmRDaGlsZChwbGF5ZXIpO1xuXG4gICAgaWYgKHBsYXllck9iai5uYW1lID09PSBcInBsYXllclwiKSBib2R5LmFwcGVuZENoaWxkKHJlbmRlclJlc2V0QnRuKCkpO1xuICAgIGlmIChwbGF5ZXJPYmoubmFtZSA9PT0gXCJjb21wdXRlclwiKSBib2R5LmFwcGVuZENoaWxkKGxlZ2VuZCk7XG4gIH07XG5cbiAgY29uc3QgaW5pdCA9IChwbGF5ZXJzKSA9PiB7XG4gICAgY29uc3QgYm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJib2R5XCIpO1xuICAgIGJvZHkuY2xhc3NMaXN0LmFkZChcImluLXByb2dyZXNzXCIpO1xuXG4gICAgY29uc3QgbGVnZW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBsZWdlbmQuY2xhc3NMaXN0LmFkZChcImxlZ2VuZFwiKTtcbiAgICBsZWdlbmQuaW5uZXJIVE1MID0gVXRpbHMubGVnZW5kSFRNTCgpO1xuXG4gICAgY29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuICAgIG5hbWUuaW5uZXJIVE1MID0gYDxzcGFuIGNsYXNzPVwicGxheWVyXCI+UGxheWVyPC9zcGFuPiB0dXJuYDtcbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKS5hcHBlbmRDaGlsZChuYW1lKTtcbiAgICBjb25zdCBbcGxheWVyLCBjb21wdXRlcl0gPSBwbGF5ZXJzO1xuXG4gICAgcmVuZGVyUGxheWVyKHBsYXllciwgYm9keSwgbGVnZW5kKTtcbiAgICByZW5kZXJQbGF5ZXIoY29tcHV0ZXIsIGJvZHksIGxlZ2VuZCk7XG5cbiAgICByZXR1cm4gcmVzZXQ7XG4gIH07XG5cbiAgcmV0dXJuIHsgaW5pdCB9O1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lSW5Qcm9ncmVzcztcbiIsImNvbnN0IFV0aWxzID0gKCgpID0+IHtcbiAgY29uc3QgbGVnZW5kSFRNTCA9ICgpID0+IGA8cD5MZWdlbmQgOjwvcD5cbiAgICA8ZGl2IGNsYXNzPVwic2hpcFwiPlxuICAgICAgPHNwYW4+U3VuayBlbmVteSBzaGlwPC9zcGFuPlxuICAgICAgPGRpdiBjbGFzcz1cImxlZ2VuZC1zaGlwXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwibGVnZW5kLXNoaXAtY2VsbFwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cImxlZ2VuZC1zaGlwLWNlbGxcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJsZWdlbmQtc2hpcC1jZWxsXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwibWlzc1wiPlxuICAgICAgPHNwYW4+TWlzc2VkIGhpdDwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ3cmFwcGVyXCI+XG4gICAgICAgIFBsYXllciA8ZGl2IGNsYXNzPVwibGVnZW5kLW1pc3NcIj48L2Rpdj5cbiAgICAgICAgL1xuICAgICAgICBDb21wdXRlciA8ZGl2IGNsYXNzPVwibGVnZW5kLWhpdFwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cImhpdFwiPlxuICAgICAgPHNwYW4+U2hpcCBoaXQ8L3NwYW4+XG4gICAgICA8ZGl2IGNsYXNzPVwid3JhcHBlclwiPlxuICAgICAgICBQbGF5ZXIgPGRpdiBjbGFzcz1cImxlZ2VuZC1oaXRcIj48L2Rpdj5cbiAgICAgICAgL1xuICAgICAgICBDb21wdXRlciA8ZGl2IGNsYXNzPVwibGVnZW5kLW1pc3NcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PmA7XG5cbiAgY29uc3QgaW5mb0hUTUwgPSAoKSA9PiBgPGgxPkluZm88L2gxPlxuICAgIDxwPkRyYWcgYW5kIGRyb3AgdGhlIHNoaXBzIGZyb20gdGhlIGxlZnQgb2YgdGhlIGdyaWQgdG8gYnVpbGQgeW91ciBib2FyZC5cbiAgICAgIDxicj5cbiAgICAgIEJ5IGRlZmF1bHQsIHNoaXBzIGFyZSBwbGFjZWQgaG9yaXpvbnRhbHkuIE9uY2UgcGxhY2VkIG9uIHRoZSBib2FyZCxcbiAgICAgIGNsaWNrIG9uIHRoZSBzaGlwIHRvIGZsaXAgaXQgdmVydGljYWxseSwgb3IgZHJhZyBhbmQgZHJvcCB0byByZXBvc2l0aW9uLiBcbiAgICAgIDxicj5cbiAgICAgIEtlZXAgaW4gbWluZCB0aGUgc2hpcHMgY2FuJ3Qgb3ZlcmxhcCB3aXRoIGVhY2hvdGhlci5cbiAgICAgIDxicj5cbiAgICAgIE9wdGlvbnM6XG4gICAgPC9wPlxuICAgIDx1bD5cbiAgICAgIDxsaT48Yj5TdGFydDwvYj4gKG9uY2UgYWxsIHNoaXBzIGFyZSBwbGFjZWQpPC9saT5cbiAgICAgIDxsaT48Yj5SZXNldDwvYj48L2xpPlxuICAgICAgPGxpPjxiPlJhbmRvbWlzZTwvYj4gdGhlIGJvYXJkPC9saT5cbiAgICA8L3VsPlxuICA8L2Rpdj5gO1xuXG4gIGNvbnN0IHNoaXBzSFRNTCA9ICgpID0+IGA8aDE+U2hpcHM8L2gxPlxuICAgIDxkaXYgaWQ9XCJjYXJyaWVyXCI+XG4gICAgICA8c3BhbiBkYXRhLXNoaXA9XCJuYW1lXCI+Q2FycmllciA8c3BhbiBkYXRhLXNoaXA9XCJhbW91bnRcIj54MTwvc3Bhbj48L3NwYW4+XG4gICAgICA8ZGl2IGNsYXNzPVwic2hpcFwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLXNoaXAtbGVuZ3RoPVwiNVwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgaWQ9XCJiYXR0bGVzaGlwXCI+XG4gICAgICA8c3BhbiBkYXRhLXNoaXA9XCJuYW1lXCI+QmF0dGxlc2hpcCA8c3BhbiBkYXRhLXNoaXA9XCJhbW91bnRcIj54MTwvc3Bhbj48L3NwYW4+XG4gICAgICA8ZGl2IGNsYXNzPVwic2hpcFwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLXNoaXAtbGVuZ3RoPVwiNFwiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgaWQ9XCJjcnVpc2VyXCI+XG4gICAgICA8c3BhbiBkYXRhLXNoaXA9XCJuYW1lXCI+Q3J1aXNlciA8c3BhbiBkYXRhLXNoaXA9XCJhbW91bnRcIj54MTwvc3Bhbj48L3NwYW4+XG4gICAgICA8ZGl2IGNsYXNzPVwic2hpcFwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLXNoaXAtbGVuZ3RoPVwiM1wiPjwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgaWQ9XCJzdWJtYXJpbmVcIj5cbiAgICAgIDxzcGFuIGRhdGEtc2hpcD1cIm5hbWVcIj5TdWJtYXJpbmUgPHNwYW4gZGF0YS1zaGlwPVwiYW1vdW50XCI+eDE8L3NwYW4+PC9zcGFuPlxuICAgICAgPGRpdiBjbGFzcz1cInNoaXBcIiBkcmFnZ2FibGU9XCJ0cnVlXCIgZGF0YS1zaGlwLWxlbmd0aD1cIjNcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGlkPVwiZGVzdHJveWVyXCI+XG4gICAgICA8c3BhbiBkYXRhLXNoaXA9XCJuYW1lXCI+RGVzdHJveWVyIDxzcGFuIGRhdGEtc2hpcD1cImFtb3VudFwiPngxPC9zcGFuPjwvc3Bhbj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzaGlwXCIgZHJhZ2dhYmxlPVwidHJ1ZVwiIGRhdGEtc2hpcC1sZW5ndGg9XCIyXCI+PC9kaXY+XG4gICAgPC9kaXY+YDtcblxuICBjb25zdCBidXR0b25zSFRNTCA9XG4gICAgKCkgPT4gYDxidXR0b24gY2xhc3M9XCJzdGFydFwiIGRhdGEtZXJyLXRpcD1cIllvdSBoYXZlIG5vdCBwbGFjZWQgYWxsIHNoaXBzXCIgdHlwZT1cImJ1dHRvblwiPlN0YXJ0PC9idXR0b24+XG4gICAgPGJ1dHRvbiBjbGFzcz1cInJhbmRvbWlzZVwiIHR5cGU9XCJidXR0b25cIj5SYW5kb21pc2U8L2J1dHRvbj5cbiAgICA8YnV0dG9uIGNsYXNzPVwicmVzZXRcIiB0eXBlPVwiYnV0dG9uXCI+UmVzZXQ8L2J1dHRvbj5gO1xuXG4gIHJldHVybiB7IGxlZ2VuZEhUTUwsIGluZm9IVE1MLCBzaGlwc0hUTUwsIGJ1dHRvbnNIVE1MIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWxzO1xuIiwiY2xhc3MgU2hpcEVsZW1lbnQge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBsZW5ndGgsIHhPZmZzZXQsIHlPZmZzZXQsIGRpcmVjdGlvbiA9IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICB0aGlzLnJvdyA9IHlPZmZzZXQ7XG4gICAgdGhpcy5jb2wgPSB4T2Zmc2V0O1xuICAgIHRoaXMubGVmdCA9IHhPZmZzZXQgKiA0MCArIHhPZmZzZXQ7XG4gICAgdGhpcy50b3AgPSB5T2Zmc2V0ICogNDAgKyB5T2Zmc2V0O1xuICAgIHRoaXMuZGlyZWN0aW9uID0gZGlyZWN0aW9uO1xuICAgIHRoaXMuZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudCgpO1xuICB9XG5cbiAgY3JlYXRlRWxlbWVudCgpIHtcbiAgICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBlbGVtZW50LmlkID0gdGhpcy5uYW1lO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZChcInBsYWNlZC1zaGlwXCIpO1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gXCJ2ZXJ0aWNhbFwiKSBlbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJmbGlwXCIpO1xuICAgIGVsZW1lbnQuc3R5bGUubGVmdCA9IGAke3RoaXMubGVmdH1weGA7XG4gICAgZWxlbWVudC5zdHlsZS50b3AgPSBgJHt0aGlzLnRvcH1weGA7XG4gICAgdGhpcy5jcmVhdGVDaGlsZHJlbihlbGVtZW50KTtcblxuICAgIHJldHVybiBlbGVtZW50O1xuICB9XG5cbiAgY3JlYXRlQ2hpbGRyZW4ocGFyZW50KSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09IFwiaG9yaXpvbnRhbFwiKSB7XG4gICAgICAgIGNoaWxkLmRhdGFzZXQucGxhY2VkUm93ID0gdGhpcy5yb3c7XG4gICAgICAgIGNoaWxkLmRhdGFzZXQucGxhY2VkQ29sID0gdGhpcy5jb2wgKyBpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2hpbGQuZGF0YXNldC5wbGFjZWRSb3cgPSB0aGlzLnJvdyArIGk7XG4gICAgICAgIGNoaWxkLmRhdGFzZXQucGxhY2VkQ29sID0gdGhpcy5jb2w7XG4gICAgICB9XG5cbiAgICAgIGNoaWxkLmNsYXNzTGlzdC5hZGQoXCJwbGFjZWQtY2VsbFwiKTtcbiAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgfVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IFNoaXBFbGVtZW50O1xuIiwiY29uc3QgU2hpcCA9IHJlcXVpcmUoXCIuL3NoaXAuanNcIik7XG5cbmNsYXNzIEdhbWVib2FyZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZ3JpZCA9IEdhbWVib2FyZC5pbml0Qm9hcmQoKTtcbiAgICB0aGlzLmF0dGFja3MgPSBbXTtcbiAgICB0aGlzLnNoaXBzID0gW107XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmdyaWQgPSBHYW1lYm9hcmQuaW5pdEJvYXJkKCk7XG4gIH1cblxuICBzdGF0aWMgcmFuZG9tKGJvYXJkKSB7XG4gICAgbGV0IHBsYWNlZFNoaXBzID0gMDtcbiAgICB3aGlsZSAocGxhY2VkU2hpcHMgPCA1KSB7XG4gICAgICBjb25zdCBybmQgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAyKTtcbiAgICAgIGNvbnN0IGRpcmVjdGlvbiA9IHJuZCA/IFwidmVydGljYWxcIiA6IFwiaG9yaXpvbnRhbFwiO1xuICAgICAgY29uc3Qgc2hpcCA9IG5ldyBTaGlwKFNoaXAudHlwZXNbcGxhY2VkU2hpcHNdKTtcbiAgICAgIGNvbnN0IHggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMCk7XG4gICAgICBjb25zdCB5ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgY29uc3QgaXNTaGlwID0gYm9hcmQucGxhY2VTaGlwKHNoaXAsIFt4LCB5XSwgZGlyZWN0aW9uKTtcbiAgICAgIGlmIChpc1NoaXApIHBsYWNlZFNoaXBzICs9IDE7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGluaXRCb2FyZCgpIHtcbiAgICBjb25zdCBncmlkID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDEwOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHJvdyA9IFtdO1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAxMDsgaiArPSAxKSB7XG4gICAgICAgIHJvdy5wdXNoKFwiXCIpO1xuICAgICAgfVxuICAgICAgZ3JpZC5wdXNoKHJvdyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdyaWQ7XG4gIH1cblxuICBzdGF0aWMgaXNWYWxpZENvb3Jkcyh4LCB5KSB7XG4gICAgcmV0dXJuIHggPj0gMCAmJiB5ID49IDAgJiYgeCA8PSA5ICYmIHkgPD0gOTtcbiAgfVxuXG4gIHN0YXRpYyBpc1ZhbGlkU2hpcFBsYWNlbWVuZXQoeCwgeSwgbGVuZ3RoLCBkaXJlY3Rpb24pIHtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIilcbiAgICAgIHJldHVybiB4ID49IDAgJiYgeCA8PSA5ICYmIHkgKyBsZW5ndGggLSAxID49IDAgJiYgeSArIGxlbmd0aCAtIDEgPD0gOTtcbiAgICByZXR1cm4geCArIGxlbmd0aCAtIDEgPj0gMCAmJiB4ICsgbGVuZ3RoIC0gMSA8PSA5ICYmIHkgPj0gMCAmJiB5IDw9IDk7XG4gIH1cblxuICBzaGlwc1N1bmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuc3Vuayk7XG4gIH1cblxuICBwbGFjZVNoaXAoc2hpcCwgc3RhcnQsIGRpcmVjdGlvbikge1xuICAgIGNvbnN0IFt4LCB5XSA9IHN0YXJ0O1xuICAgIGNvbnN0IHZhbGlkQ29vcmRzID0gR2FtZWJvYXJkLmlzVmFsaWRTaGlwUGxhY2VtZW5ldChcbiAgICAgIHgsXG4gICAgICB5LFxuICAgICAgc2hpcC5sZW5ndGgsXG4gICAgICBkaXJlY3Rpb25cbiAgICApO1xuICAgIGlmICghdmFsaWRDb29yZHMpIHJldHVybiBudWxsO1xuICAgIGNvbnN0IGFkZGVkU2hpcHMgPSBbXTtcbiAgICBpZiAoZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIikge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgIGlmICghKHRoaXMuZ3JpZFt4XVt5ICsgaV0gaW5zdGFuY2VvZiBTaGlwKSkge1xuICAgICAgICAgIGFkZGVkU2hpcHMucHVzaChbeCwgeSArIGldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKCEodGhpcy5ncmlkW3ggKyBpXVt5XSBpbnN0YW5jZW9mIFNoaXApKSB7XG4gICAgICAgICAgYWRkZWRTaGlwcy5wdXNoKFt4ICsgaSwgeV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChhZGRlZFNoaXBzLmxlbmd0aCA9PT0gc2hpcC5sZW5ndGgpIHtcbiAgICAgIGFkZGVkU2hpcHMuZm9yRWFjaCgoY29vcmRzKSA9PiB7XG4gICAgICAgIGNvbnN0IFtueCwgbnldID0gY29vcmRzO1xuICAgICAgICB0aGlzLmdyaWRbbnhdW255XSA9IHNoaXA7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc2hpcHMucHVzaChzaGlwKTtcbiAgICAgIHJldHVybiBzaGlwO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJlY2VpdmVBdHRhY2soeCwgeSkge1xuICAgIGlmICghR2FtZWJvYXJkLmlzVmFsaWRDb29yZHMoeCwgeSkpIHJldHVybiBuZXcgRXJyb3IoXCJpbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xuICAgIGlmICh0aGlzLmF0dGFja3MuaW5jbHVkZXMoYCR7eH0ke3l9YCkpXG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiYXR0YWNrIGFscmVhZHkgb2NjdXJlZFwiKTtcbiAgICBjb25zdCBjZWxsID0gdGhpcy5ncmlkW3hdW3ldO1xuICAgIGlmIChjZWxsIGluc3RhbmNlb2YgU2hpcCkgY2VsbC5oaXQoKTtcbiAgICBlbHNlIHRoaXMuZ3JpZFt4XVt5XSA9IFwiWFwiO1xuICAgIHRoaXMuYXR0YWNrcy5wdXNoKGAke3h9JHt5fWApO1xuICAgIHJldHVybiBjZWxsO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZWJvYXJkO1xuIiwiY29uc3QgR2FtZWJvYXJkID0gcmVxdWlyZShcIi4vZ2FtZWJvYXJkLmpzXCIpO1xuXG5jbGFzcyBQbGF5ZXIge1xuICBjb25zdHJ1Y3RvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmJvYXJkID0gbmV3IEdhbWVib2FyZCgpO1xuICAgIHRoaXMuc2VuZEF0dGFjayA9IHRoaXMuY3JlYXRlU2VuZEF0dGFjayhuYW1lKTtcbiAgICB0aGlzLmF0dGFja3MgPSBbXTtcbiAgICBpZiAobmFtZSA9PT0gXCJjb21wdXRlclwiKSB7XG4gICAgICBHYW1lYm9hcmQucmFuZG9tKHRoaXMuYm9hcmQpO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVNlbmRBdHRhY2sobmFtZSkge1xuICAgIHJldHVybiBuYW1lID09PSBcInBsYXllclwiXG4gICAgICA/IChlbmVteUJvYXJkLCB4LCB5KSA9PiB7XG4gICAgICAgICAgY29uc3QgY2VsbCA9IGVuZW15Qm9hcmQucmVjZWl2ZUF0dGFjayh4LCB5KTtcbiAgICAgICAgICBpZiAoR2FtZWJvYXJkLmlzVmFsaWRDb29yZHMoeCwgeSkpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNrcy5wdXNoKGAke3h9JHt5fWApO1xuICAgICAgICAgICAgcmV0dXJuIGNlbGw7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXCJpbnZhbGlkIGNvb3JkaW5hdGVzXCIpO1xuICAgICAgICB9XG4gICAgICA6IChlbmVteUJvYXJkKSA9PiB7XG4gICAgICAgICAgY29uc3QgW2N4LCBjeV0gPSB0aGlzLmdlbmVyYXRlQ29tcEF0dGFjaygpO1xuICAgICAgICAgIGNvbnN0IGNlbGwgPSBlbmVteUJvYXJkLnJlY2VpdmVBdHRhY2soY3gsIGN5KTtcbiAgICAgICAgICB0aGlzLmF0dGFja3MucHVzaChgJHtjeH0ke2N5fWApO1xuICAgICAgICAgIHJldHVybiBbY2VsbCwgY3gsIGN5XTtcbiAgICAgICAgfTtcbiAgfVxuXG4gIGdlbmVyYXRlQ29tcEF0dGFjaygpIHtcbiAgICBsZXQgeDtcbiAgICBsZXQgeTtcbiAgICBkbyB7XG4gICAgICB4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTApO1xuICAgICAgeSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEwKTtcbiAgICB9IHdoaWxlICh0aGlzLmF0dGFja3MuaW5jbHVkZXMoYCR7eH0ke3l9YCkpO1xuXG4gICAgcmV0dXJuIFt4LCB5XTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFBsYXllcjtcbiIsImNsYXNzIFNoaXAge1xuICBzdGF0aWMgdHlwZXMgPSBbXG4gICAgeyBuYW1lOiBcImNhcnJpZXJcIiwgbGVuZ3RoOiA1IH0sXG4gICAgeyBuYW1lOiBcImJhdHRsZXNoaXBcIiwgbGVuZ3RoOiA0IH0sXG4gICAgeyBuYW1lOiBcImNydWlzZXJcIiwgbGVuZ3RoOiAzIH0sXG4gICAgeyBuYW1lOiBcInN1Ym1hcmluZVwiLCBsZW5ndGg6IDMgfSxcbiAgICB7IG5hbWU6IFwiZGVzdHJveWVyXCIsIGxlbmd0aDogMiB9LFxuICBdO1xuXG4gIGNvbnN0cnVjdG9yKHR5cGVPYmopIHtcbiAgICB0aGlzLm5hbWUgPSB0eXBlT2JqLm5hbWU7XG4gICAgdGhpcy5sZW5ndGggPSB0eXBlT2JqLmxlbmd0aDtcbiAgICB0aGlzLmhpdHMgPSAwO1xuICAgIHRoaXMuc3VuayA9IGZhbHNlO1xuICB9XG5cbiAgaGl0KCkge1xuICAgIHRoaXMuaGl0cyArPSAxO1xuICAgIHRoaXMuc3VuayA9IHRoaXMuaGl0cyA9PT0gdGhpcy5sZW5ndGg7XG4gIH1cblxuICBpc1N1bmsoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3VuaztcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFNoaXA7XG4iLCJjb25zdCBQbGF5ZXIgPSByZXF1aXJlKFwiLi9mYWN0b3JpZXMvcGxheWVyLmpzXCIpO1xuY29uc3QgU2hpcCA9IHJlcXVpcmUoXCIuL2ZhY3Rvcmllcy9zaGlwLmpzXCIpO1xuXG5jb25zdCBHYW1lID0gKCgpID0+IHtcbiAgbGV0IGh1bWFuO1xuICBsZXQgY29tcHV0ZXI7XG5cbiAgY29uc3QgcmVzZXQgPSAoKSA9PiB7XG4gICAgaHVtYW4uYm9hcmQucmVzZXQoKTtcbiAgICBjb21wdXRlci5ib2FyZC5yZXNldCgpO1xuICB9O1xuXG4gIGNvbnN0IG5ld0dhbWUgPSAoc2hpcHMpID0+IHtcbiAgICBodW1hbiA9IG5ldyBQbGF5ZXIoXCJwbGF5ZXJcIik7XG4gICAgY29tcHV0ZXIgPSBuZXcgUGxheWVyKFwiY29tcHV0ZXJcIik7XG5cbiAgICBzaGlwcy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XG4gICAgICBodW1hbi5ib2FyZC5wbGFjZVNoaXAoZWxlbWVudC5zaGlwLCBlbGVtZW50LnN0YXJ0LCBlbGVtZW50LmRpcmVjdGlvbik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gW2h1bWFuLCBjb21wdXRlcl07XG4gIH07XG5cbiAgY29uc3QgcmVzdWx0ID0gKGNlbGwsIHBsYXllciwgZW5lbXkpID0+IHtcbiAgICBjb25zdCBpc1NoaXAgPSBjZWxsIGluc3RhbmNlb2YgU2hpcDtcblxuICAgIHJldHVybiB7XG4gICAgICBzaGlwOiBpc1NoaXAgPyBjZWxsIDogZmFsc2UsXG4gICAgICB3aW5uZXI6IGVuZW15LmJvYXJkLnNoaXBzU3VuaygpID8gcGxheWVyIDogbnVsbCxcbiAgICAgIHN1bmtDb29yZDogaXNTaGlwXG4gICAgICAgID8gKChzaGlwLCBncmlkKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb29yZHMgPSBbXTtcbiAgICAgICAgICAgIGlmIChzaGlwLmlzU3VuaygpKSB7XG4gICAgICAgICAgICAgIGdyaWQuZm9yRWFjaCgocm93LCBpKSA9PiB7XG4gICAgICAgICAgICAgICAgcm93LmZvckVhY2goKGNvbCwgaikgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKGNvbCA9PT0gY2VsbCkgY29vcmRzLnB1c2goW2ksIGpdKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY29vcmRzLmxlbmd0aCA/IGNvb3JkcyA6IG51bGw7XG4gICAgICAgICAgfSkoY2VsbCwgZW5lbXkuYm9hcmQuZ3JpZClcbiAgICAgICAgOiBudWxsLFxuICAgIH07XG4gIH07XG5cbiAgY29uc3QgcGxheUh1bWFuID0gKHgsIHkpID0+IHtcbiAgICBjb25zdCBjZWxsID0gaHVtYW4uc2VuZEF0dGFjayhjb21wdXRlci5ib2FyZCwgeCwgeSk7XG4gICAgcmV0dXJuIHJlc3VsdChjZWxsLCBodW1hbiwgY29tcHV0ZXIpO1xuICB9O1xuXG4gIGNvbnN0IHBsYXlDb21wdXRlciA9ICgpID0+IHtcbiAgICBjb25zdCBjZWxsID0gY29tcHV0ZXIuc2VuZEF0dGFjayhodW1hbi5ib2FyZCk7XG4gICAgcmV0dXJuIFtyZXN1bHQoY2VsbFswXSwgY29tcHV0ZXIsIGh1bWFuKSwgY2VsbFsxXSwgY2VsbFsyXV07XG4gIH07XG5cbiAgcmV0dXJuIHsgcmVzZXQsIG5ld0dhbWUsIHBsYXlIdW1hbiwgcGxheUNvbXB1dGVyIH07XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiY29uc3QgQnVpbGRCb2FyZCA9IHJlcXVpcmUoXCIuL0RPTV9IZWxwZXJzL2J1aWxkUGxheWVyQm9hcmQuanNcIik7XG5jb25zdCBHYW1lSW5Qcm9ncmVzcyA9IHJlcXVpcmUoXCIuL0RPTV9IZWxwZXJzL2luUHJvZ3Jlc3MuanNcIik7XG5cbmZ1bmN0aW9uIGNvbnRyb2woKSB7XG4gIGNvbnN0IHN0YXJ0ID0gQnVpbGRCb2FyZC5pbml0KCk7XG4gIGRvY3VtZW50XG4gICAgLnF1ZXJ5U2VsZWN0b3IoXCJib2R5I2J1aWxkLXBsYXllci1ib2FyZCA+IC5idXR0b25zID4gYnV0dG9uLnN0YXJ0XCIpXG4gICAgLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICBjb25zdCBwbGF5ZXJzID0gc3RhcnQoKTtcbiAgICAgIGNvbnN0IHJlc2V0ID0gR2FtZUluUHJvZ3Jlc3MuaW5pdChwbGF5ZXJzKTtcbiAgICAgIGRvY3VtZW50XG4gICAgICAgIC5xdWVyeVNlbGVjdG9yKFwiYm9keS5pbi1wcm9ncmVzcyAucmVzZXQtZ2FtZVwiKVxuICAgICAgICAuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgICByZXNldCgpO1xuICAgICAgICAgIGNvbnRyb2woKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwibG9hZFwiLCBjb250cm9sKTtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==