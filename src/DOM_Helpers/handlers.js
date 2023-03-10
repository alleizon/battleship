const ShipElement = require("../factories/ShipElement.js");

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
        parentShip.removeEventListener("dragstend", drag);
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

  window.addEventListener("load", () => {
    document
      .querySelector("body > .grid")
      .addEventListener("mousemove", (e) => absDrag(e, "drag"));
  });

  return { mouseDown, drag, absDrag };
})();

module.exports = Handlers;
