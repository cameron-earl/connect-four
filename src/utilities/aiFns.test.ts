import GameClass from '../models/Game';
import { _, BoardState, R, Y } from '../models/gameModels';
import { moveFns } from './aiFns';

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
});

describe('aiMove', () => {
  it.todo('aiMove');
});
