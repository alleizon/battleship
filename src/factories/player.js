const Gameboard = require("./gameboard.js");

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.enemyBoard;
    this.attacks = [];
  }

  generateCompAttack() {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (this.attacks.includes(`${x}${y}`));

    return [x, y];
  }

  sendAttack(x, y) {
    if (x === undefined && y === undefined) {
      const [x, y] = this.generateCompAttack();
      this.enemyBoard.receiveAttack(x, y);
      this.attacks.push(`${x}${y}`);
    } else {
      this.enemyBoard.receiveAttack(x, y);
      this.attacks.push(`${x}${y}`);
    }
  }
}

module.exports = Player;
