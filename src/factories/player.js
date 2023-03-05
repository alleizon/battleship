const Gameboard = require("./gameboard.js");

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.attacks = [];
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

  sendAttack(enemyBoard, x, y) {
    if (x === undefined && y === undefined) {
      const [cx, cy] = this.generateCompAttack();
      enemyBoard.receiveAttack(cx, cy);
    } else {
      enemyBoard.receiveAttack(x, y);
    }
    this.attacks.push(`${x}${y}`);
  }
}

module.exports = Player;
