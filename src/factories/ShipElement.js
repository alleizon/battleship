class ShipElement {
  constructor(name, length, xOffset, yOffset) {
    this.name = name;
    this.length = length;
    this.row = yOffset;
    this.col = xOffset;
    this.left = xOffset * 40 + xOffset;
    this.top = yOffset * 40 + yOffset;
    this.element = this.createElement();
  }

  createElement() {
    const element = document.createElement("div");
    element.id = this.name;
    element.classList.add("placed-ship");
    element.style.left = `${this.left}px`;
    element.style.top = `${this.top}px`;
    this.createChildren(element);

    return element;
  }

  createChildren(parent) {
    for (let i = 0; i < this.length; i += 1) {
      const child = document.createElement("div");
      child.dataset.placedRow = this.row;
      child.dataset.placedCol = this.col + i;
      child.classList.add("placed-cell");
      parent.appendChild(child);
    }
  }
}

module.exports = ShipElement;
