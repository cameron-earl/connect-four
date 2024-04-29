import { getEmptyBoardArr } from '../utilities/gameFns';
import Coord from './Coord';
import GameClass from './GameClass';
import { _, BoardState, emptyColumn, R, Y } from './gameModels';

describe('constructor', () => {
  it("initializes with an empty board and red's turn", () => {
    const game = new GameClass();
    expect(game.currentPlayer).toBe(R);
    expect(game.moveCount).toBe(0);
  });

  it("should copy another game's values by value rather than by reference", () => {
    const game1 = new GameClass();
    const game2 = new GameClass(game1);
    expect(game1.board).not.toBe(game2.board);

    game2.move(0);
    expect(game1.currentPlayer).not.toBe(game2.currentPlayer);
  });
});

describe('move', () => {
  it('performs moves correctly', () => {
    const game = new GameClass(getEmptyBoardArr(), R);
    game.move(0);
    game.move(6);
    game.move(1);
    game.move(5);
    game.move(2);
    game.move(5);

    expect(game.board.boardArr[0][0]).toBe(R);
    expect(game.board.boardArr[1][0]).toBe(R);
    expect(game.board.boardArr[2][0]).toBe(R);
    expect(game.board.boardArr[6][0]).toBe(Y);
    expect(game.board.boardArr[5][0]).toBe(Y);
    expect(game.board.boardArr[5][1]).toBe(Y);
    expect(game.board.boardArr[3][0]).toBe(_);
    expect(game.moveCount).toBe(6);
  });
});

describe('checkForVictory', () => {
  it('returns null given empty board', () => {
    const game = new GameClass();
    game.checkForVictory();
    expect(game.gameOver).toBeNull();
  });

  it('returns PlayerToken.Empty for stalemate', () => {
    const board = [
      [R, Y, R, Y, R, Y],
      [R, Y, R, Y, R, Y],
      [R, Y, R, Y, R, Y],
      [Y, R, Y, R, Y, R],
      [R, Y, R, Y, R, Y],
      [R, Y, R, Y, R, Y],
      [R, Y, R, Y, R, Y],
    ] as BoardState;

    const game = new GameClass(board);
    game.checkForVictory();
    const actual = game.gameOver;

    expect(actual).not.toBeNull();
    expect(actual?.player).toBe(_);
    expect(actual?.coordinates).toBe(null);
  });

  it('returns Red for vertical Red win', () => {
    const board: BoardState = [
      [R, R, R, R, _, _],
      [Y, Y, Y, _, _, _],
      [...emptyColumn],
      [...emptyColumn],
      [...emptyColumn],
      [...emptyColumn],
      [...emptyColumn],
    ];

    const game = new GameClass(board);
    game.checkForVictory();
    const actual = game.gameOver;

    expect(actual).not.toBeNull();
    expect(actual?.player).toBe(R);
    expect(actual?.coordinates).toEqual([new Coord(0, 0), new Coord(0, 1), new Coord(0, 2), new Coord(0, 3)]);
  });

  it('returns Red for horizontal red win', () => {
    const board: BoardState = [
      [R, Y, _, _, _, _],
      [R, Y, _, _, _, _],
      [R, Y, _, _, _, _],
      [R, _, _, _, _, _],
      [...emptyColumn],
      [...emptyColumn],
      [...emptyColumn],
    ];

    const game = new GameClass(board);
    game.checkForVictory();
    const actual = game.gameOver;

    expect(actual).not.toBeNull();
    expect(actual?.player).toBe(R);
    expect(actual?.coordinates).toEqual([new Coord(0, 0), new Coord(1, 0), new Coord(2, 0), new Coord(3, 0)]);
  });

  it('returns Yellow for horizontal yellow win', () => {
    const board: BoardState = [
      [...emptyColumn],
      [...emptyColumn],
      [Y, R, _, _, _, _],
      [Y, R, _, _, _, _],
      [Y, _, _, _, _, _],
      [Y, R, _, _, _, _],
      [R, _, _, _, _, _],
    ];

    const game = new GameClass(board);
    game.checkForVictory();
    const actual = game.gameOver;

    expect(actual).not.toBeNull();
    expect(actual?.player).toBe(Y);
    expect(actual?.coordinates).toEqual([new Coord(2, 0), new Coord(3, 0), new Coord(4, 0), new Coord(5, 0)]);
  });
});

describe('getMajorThreats', () => {
  // TODO: move to board tests
  it('should return proper response for newly constructed class', () => {
    const board: BoardState = [
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [R, _, _, _, _, _],
      [R, Y, Y, _, _, _],
      [R, _, _, _, _, _],
      [Y, _, _, _, _, _],
      [_, _, _, _, _, _],
    ];
    const testGame = new GameClass(board);
    const actual = testGame.board.majorThreatMap;
    expect(actual[1][0]).toBe(R);
    expect(actual[0][0]).toBe(_);
  });
  it.todo('should have more tests');
});
describe('reset', () => {
  it.todo('reset');
});
describe('getValidMoveOptions', () => {
  it.todo('getValidMoveOptions');
});
describe('isMoveValid', () => {
  it.todo('isMoveValid');
});

describe('isWinningCoord', () => {
  it.todo('isWinningCoord');
});
describe('isWinningMove', () => {
  it.todo('isWinningMove');
});

describe('countRevealedTraps', () => {
  it('should return 0 if no traps exist for either player', () => {
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
    const actual = testGame.countRevealedThreats(R);
    expect(actual).toBe(0);
  });
  it('should return 1 if a trap exists for correct player', () => {
    const board: BoardState = [
      [_, _, _, _, _, _],
      [_, _, _, _, _, _],
      [R, _, _, _, _, _],
      [R, Y, Y, _, _, _],
      [R, _, _, _, _, _],
      [Y, _, _, _, _, _],
      [_, _, _, _, _, _],
    ];
    const testGame = new GameClass(board);
    const actual = testGame.countRevealedThreats(R);
    expect(actual).toBe(1);
  });

  it.todo('should return 0 if only trap exists for other player');
  it.todo('should return 2 if only 2 traps exist for player');
  it.todo('should return 1 if only trap exists for both players');
  it.todo('should return correct number when asking about non-current-player');
});
