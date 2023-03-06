const Gameboard = require("../factories/gameboard.js");
const Player = require("../factories/player.js");

describe("Player", () => {
  let human = new Player("human");
  let computer = new Player("computer");

  afterEach(() => {
    human = new Player("human");
    computer = new Player("computer");
  });

  test("is instantiated correctly", () => {
    expect(human.board instanceof Gameboard).toBe(true);
    expect(computer.board instanceof Gameboard).toBe(true);
  });

  test("can attack enemy board", () => {
    human.sendAttack(computer.board, 0, 0);
    human.sendAttack(computer.board, 0, 10);
    human.sendAttack(computer.board, -0, 2);
    human.sendAttack(computer.board, -1, 3);

    expect(computer.board.attacks).toContain("00");
    expect(computer.board.attacks).not.toContain("-02");
    expect(human.attacks).not.toContain("-02");
    expect(computer.board.attacks).not.toContain("010");
    expect(human.attacks).not.toContain("010");
    expect(computer.board.attacks).not.toContain("-13");
    expect(human.attacks).not.toContain("-13");
  });

  test("computer can attack (randomly)", () => {
    computer.sendAttack(human.board);
    expect(human.board.attacks[0]).toMatch(/[\d]{2}/g);
    expect(human.board.attacks[0].length).toBe(2);
  });

  test("computer doesn't attack the same coordinates twice", () => {
    computer.attacks.push("01");
    computer.sendAttack(human.board);
    const regex = /01/g;
    const result = computer.attacks.toString().match(regex);
    expect(result.length).toBe(1);
  });
});
