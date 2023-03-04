const Gameboard = require("../factories/gameboard.js");
const Player = require("../factories/player.js");

describe("Player", () => {
  let human, computer;

  beforeEach(() => {
    human = new Player("human");
    computer = new Player("computer");

    human.enemyBoard = computer.board;
    computer.enemyBoard = human.board;
  });

  test("is instantiated correctly", () => {
    expect(human.board).toBe(computer.enemyBoard);
    expect(computer.board).toBe(human.enemyBoard);
  });

  test("can attack enemy board", () => {
    human.sendAttack(0, 0);
    human.sendAttack(0, 10);
    human.sendAttack(-0, 2);
    human.sendAttack(-1, 3);

    expect(computer.board.attacks).toContain("00");
    expect(computer.board.attacks).not.toContain("-02");
    expect(computer.board.attacks).not.toContain("-13");
  });

  test("computer can attack (randomly)", () => {
    computer.sendAttack();
    expect(computer.enemyBoard.attacks[0]).toMatch(/[\d]{2}/g);
    expect(computer.enemyBoard.attacks[0].length).toBe(2);
  });

  test("computer doesn't attack the same coordinates twice", () => {
    computer.enemyBoard.attacks.push("01");
    computer.attacks.push("01");
    computer.sendAttack();
    const regex = /01/g;
    const result = computer.attacks.toString().match(regex);
    const result2 = computer.enemyBoard.attacks.toString().match(regex);
    expect(result.length).toBe(1);
    expect(result2.length).toBe(1);
  });
});
