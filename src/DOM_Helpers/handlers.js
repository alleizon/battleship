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
        gridCellsGlobal.forEach((gridCell) => {
          gridCell.classList.add("ship");
        });
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
