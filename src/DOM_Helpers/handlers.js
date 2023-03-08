const ShipElement = require("../factories/ShipElement.js");

const Handlers = (() => {
  let parentShip;
  let shipCell;
  let enterCell;
  let gridCellsGlobal;

  const resetGlobals = () => {
    parentShip = undefined;
    shipCell = undefined;
    enterCell = undefined;
    gridCellsGlobal = undefined;
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

  // fix placing when dropping outside the area

  const flipError = (element) => {
    element.classList.add("flip-error");
    setTimeout(() => {
      element.classList.remove("flip-error");
    }, 1500);
  };

  const absFlip = (e) => {
    const isParent = !e.target.className.includes("placed-cell");

    const element = isParent ? e.target : e.target.parentElement;
    const { length } = element.children;
    const startX = +element.children[0].dataset.placedCol;
    const startY = +element.children[0].dataset.placedRow;

    const newOccupied = [];

    if (element.className.includes("flip")) {
      for (let i = 1; i < length; i += 1) {
        const cell = document.querySelector(
          `.grid-cell[data-row="${startY}"][data-col="${startX + i}"]`
        );
        if (cell.dataset.occupied === "true") {
          flipError(element);
          return;
        }
        newOccupied.push(cell);
      }
    } else {
      for (let i = 1; i < length; i += 1) {
        const cell = document.querySelector(
          `.grid-cell[data-row="${startY + i}"][data-col="${startX}"]`
        );
        if (!cell) debugger;
        if (cell.dataset.occupied === "true") {
          flipError(element);
          return;
        }
        newOccupied.push(cell);
      }
    }
    newOccupied.forEach((el, i) => {
      const gridCellE = el;
      gridCellE.dataset.occupied = "true";
      const newRow = +gridCellE.dataset.row;
      const newCol = +gridCellE.dataset.col;
      const oldRow = element.children[i + 1].dataset.placedRow;
      const oldCol = element.children[i + 1].dataset.placedCol;
      element.children[i + 1].dataset.placedRow = newRow;
      element.children[i + 1].dataset.placedCol = newCol;
      const oldCell = document.querySelector(
        `.grid-cell[data-row="${oldRow}"][data-col="${oldCol}"]`
      );
      oldCell.dataset.occupied = "false";
    });
    element.classList.toggle("flip");
  };

  const absDrag = (e) => {
    //
  };

  const drag = (e) => {
    const start = (startE) => {
      //
    };
    const leave = (leaveE) => {
      const { relatedTarget } = leaveE;
      if (relatedTarget === document.querySelector("body#build-player-board")) {
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
          if (current) gridCells.push(current);
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
    const end = (endE) => {
      resetValidity();
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
          gridC.dataset.occupied = true;
        });

        absShip.element.addEventListener("mousedown", absDrag);
        absShip.element.addEventListener("click", absFlip);

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
        parentShip.removeEventListener("dragstend", drag);
      }

      resetGlobals();
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

  return { mouseDown, drag };
})();

module.exports = Handlers;
