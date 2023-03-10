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
