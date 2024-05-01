import GameClass from '../models/GameClass';
import { _, BoardState, PlayerColor, R, Y } from '../models/gameModels';
import { exposesMajorThreat, moveFns } from './aiFns';

// const createTestPersona =
//   (moveType: MoveType) =>
//   (fn: aiMoveFn): AiPersona => {
//     return {
//       description: 'test persona',
//       instructions: [
//         {
//           moveType,
//           fn,
//           chance: 1,
//         },
//       ],
//     };
//   };

describe('actFns', () => {
  // const createTestActPersona = createTestPersona(MoveType.act);
  it.todo('win');
  it.todo('blockLoss');
  describe('createImmediateTrap', () => {
    it('should return [1, 4] for simple first-row trap', () => {
      const board: BoardState = [
        [_, _, _, _, _, _],
        [_, _, _, _, _, _],
        [R, _, _, _, _, _],
        [R, Y, Y, _, _, _],
        [_, _, _, _, _, _],
        [_, _, _, _, _, _],
        [_, _, _, _, _, _],
      ];
      const testGame = new GameClass(board);
      const moveOptions = [0, 1, 2, 3, 4, 5, 6];

      const testGames = [];
      for (let move of moveOptions) {
        if (testGames[move]) continue;
        testGames[move] = new GameClass(testGame);
        testGames[move].move(move);
      }

      const actual = moveFns.createImmediateTrap.fn(testGame, moveOptions, testGames);
      expect(actual.length).toEqual(2);
      expect(actual[0]).toBe(1);
      expect(actual[1]).toBe(4);
    });
  });
  it.todo('enableVerticalTrap');
});

describe('filterFns', () => {
  it.todo('avoidEnablingLoss');
  it.todo('onlyProductive');
  describe('avoidEnablingBlock', () => {
    xit('should work for a major threat on row two', () => {
      const board: BoardState = [
        [_, _, _, _, _, _],
        [_, _, _, _, _, _],
        [R, Y, _, _, _, _],
        [R, Y, R, R, R, Y],
        [Y, Y, _, _, _, _],
        [_, _, _, _, _, _],
        [R, R, _, _, _, _],
      ];
      const testGame = new GameClass(board);
      const moveOptions = [0, 1, 2, 3, 4, 5, 6];
      const actual = moveFns.avoidEnablingBlock.fn(testGame, moveOptions, []);
      expect(actual).toEqual([1, 5]);
    });
  });
});

describe('aiMove', () => {
  it.todo('aiMove');
});

describe('exposesMajorThreat', () => {
  const board: BoardState = [
    [_, _, _, _, _, _],
    [R, Y, _, _, _, _],
    [_, _, _, _, _, _],
    [R, Y, R, R, R, Y],
    [Y, Y, Y, R, _, _],
    [_, _, _, _, _, _],
    [R, Y, _, _, _, _],
  ];
  it.each([
    [false, 0, R],
    [false, 1, R],
    [true, 2, R],
    [false, 3, R],
    [false, 4, R],
    [false, 5, R],
    [false, 6, R],
    [false, 0, Y],
    [false, 1, Y],
    [true, 2, Y],
    [false, 3, Y],
    [false, 4, Y],
    [true, 5, Y],
    [false, 6, Y],
  ])('should return %p for column %i given color %i ', (expected, col, color) => {
    const testGame = new GameClass(board);
    const actual = exposesMajorThreat(testGame, color as PlayerColor)(col);
    expect(actual).toBe(expected);
  });
});
