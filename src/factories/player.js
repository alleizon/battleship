const Gameboard = require("./gameboard.js");

class Player {
  constructor(name) {
    this.name = name;
    this.board = new Gameboard();
    this.sendAttack = this.createSendAttack(name);
    this.attacks = [];
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
