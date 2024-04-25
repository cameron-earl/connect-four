import { getEmptyBoardArr } from '../utilities/gameFns';
import BoardClass from './BoardClass';
import GameClass from './GameClass';
import { _, BoardState, Column, emptyColumn, Line, R, Y } from './gameModels';

describe('constructor', () => {
  it('should create new empty board given no arguments', () => {
    const subject = new BoardClass();
    expect(subject.boardArr).toEqual(getEmptyBoardArr());
  });
  it('should copy board given BoardClass argument', () => {
    const otherGame = new GameClass();
    otherGame.move(1);
    otherGame.move(2);
    otherGame.move(4);
    otherGame.move(6);
    otherGame.move(5);
    const other = otherGame.board;

    const subject = new BoardClass(other);

    expect(subject.boardArr).not.toBe(other.boardArr);
    expect(subject.boardArr[0]).not.toBe(other.boardArr[0] as Column);
    expect(subject.boardArr).toEqual(other.boardArr);
  });
});

describe('move', () => {
  it('should successfully place piece in empty column', () => {
    const subject = new BoardClass();

    subject.move(1, R);

    expect(subject.boardArr[1]).toEqual([R, _, _, _, _, _]);
    for (let c of [0, 2, 3, 4, 5, 6]) {
      expect(subject.boardArr[c]).toEqual(emptyColumn);
    }
  });
});

describe('remove', () => {
  it('should remove the correct piece given full column', () => {
    const board: BoardState = [
      [R, R, R, Y, R, Y],
      [R, R, Y, R, R, R],
      [R, Y, R, R, R, R],
      [Y, R, Y, Y, R, R],
      [R, R, R, Y, R, Y],
      [R, Y, R, Y, Y, R],
      [R, R, R, Y, R, R],
    ];
    const expected = [
      [R, R, R, Y, R, _],
      [R, R, Y, R, R, R],
      [R, Y, R, R, R, R],
      [Y, R, Y, Y, R, R],
      [R, R, R, Y, R, Y],
      [R, Y, R, Y, Y, R],
      [R, R, R, Y, R, R],
    ];
    const subject = new BoardClass(board);
    subject.remove(0);
    expect(subject.boardArr).toEqual(expected);
  });

  it('should remove the correct piece given partially full column', () => {
    const board: BoardState = [
      [R, R, R, Y, R, _],
      [R, R, Y, R, R, R],
      [R, Y, R, R, R, R],
      [Y, R, Y, Y, R, R],
      [R, R, R, Y, R, Y],
      [R, Y, R, Y, Y, R],
      [R, R, R, Y, R, R],
    ];
    const expected = [
      [R, R, R, Y, _, _],
      [R, R, Y, R, R, R],
      [R, Y, R, R, R, R],
      [Y, R, Y, Y, R, R],
      [R, R, R, Y, R, Y],
      [R, Y, R, Y, Y, R],
      [R, R, R, Y, R, R],
    ];
    const subject = new BoardClass(board);
    subject.remove(0);
    expect(subject.boardArr).toEqual(expected);
  });

  it('should do nothing given empty column', () => {
    const board: BoardState = getEmptyBoardArr();
    const expected = getEmptyBoardArr();
    const subject = new BoardClass(board);
    subject.remove(0);
    expect(subject.boardArr).toEqual(expected);
  });
});

describe('idxInBounds', () => {
  let fixture = new BoardClass();

  describe('colIdxInBounds', () => {
    it('should return false for -1', () => {
      expect(fixture.colIdxInBounds(-1)).toBeFalsy();
    });
    it('should return false for 7', () => {
      expect(fixture.colIdxInBounds(7)).toBeFalsy();
    });
    it('should return true for 0', () => {
      expect(fixture.colIdxInBounds(0)).toBeTruthy();
    });
    it('should return true for 6', () => {
      expect(fixture.colIdxInBounds(6)).toBeTruthy();
    });
  });

  describe('rowIdxInBounds', () => {
    it('should return false for -1', () => {
      expect(fixture.rowIdxInBounds(-1)).toBeFalsy();
    });
    it('should return false for 7', () => {
      expect(fixture.rowIdxInBounds(6)).toBeFalsy();
    });
    it('should return true for 0', () => {
      expect(fixture.rowIdxInBounds(0)).toBeTruthy();
    });
    it('should return true for 6', () => {
      expect(fixture.rowIdxInBounds(5)).toBeTruthy();
    });
  });
});

describe('isMoveValid', () => {
  it.todo('should test isMoveValid');
});

describe('getRevealedRow', () => {
  it.todo('should test getRevealedRow');
});

describe('getRevealedRows', () => {
  it.todo('should test getRevealedRows');
});

describe('getTopFilledRow', () => {
  it.todo('should test getTopFilledRow');
});

describe('get lines', () => {
  const board: BoardState = [
    [R, R, R, Y, R, Y],
    [R, R, Y, R, R, R],
    [R, Y, R, R, R, R],
    [Y, R, Y, Y, R, R],
    [R, R, R, Y, R, Y],
    [R, Y, R, Y, Y, R],
    [R, R, R, Y, R, R],
  ];
  describe('getRow', () => {
    it.each([
      [0, [R, R, R, Y, R, R, R]],
      [1, [R, R, Y, R, R, Y, R]],
      [2, [R, Y, R, Y, R, R, R]],
      [3, [Y, R, R, Y, Y, Y, Y]],
      [4, [R, R, R, R, R, Y, R]],
      [5, [Y, R, R, R, Y, R, R]],
    ])('should return the correct row given %i', (given, expected) => {
      const subject = new BoardClass(board);

      expect(subject.getRow(given)).toEqual(expected);
    });
  });

  describe('getCol', () => {
    it.each([
      [0, [R, R, R, Y, R, Y]],
      [1, [R, R, Y, R, R, R]],
      [2, [R, Y, R, R, R, R]],
      [3, [Y, R, Y, Y, R, R]],
      [4, [R, R, R, Y, R, Y]],
      [5, [R, Y, R, Y, Y, R]],
      [6, [R, R, R, Y, R, R]],
    ])('should return the correct column given %i', (given, expected) => {
      const subject = new BoardClass(board);
      const actual = subject.getCol(given);

      expect(actual).toEqual(expected);
      expect(actual).not.toBe(board[given]);
    });
  });

  describe('getULDiagonal', () => {
    it.each([
      [0, [Y, Y, Y, Y]],
      [1, [R, R, R, R, R]],
      [2, [R, R, Y, R, R, Y]],
      [3, [R, Y, R, Y, R, R]],
      [4, [R, R, Y, R, R]],
      [5, [R, Y, R, R]],
    ])('should return the correct UL diagonal given %s', (given: number, expected: Line) => {
      const subject = new BoardClass(board);
      expect(subject.getULDiagonal(given)).toEqual(expected);
    });
  });

  describe('getURDiagonal', () => {
    it.each([
      [0, [Y, R, R, Y]],
      [1, [R, R, R, Y, R]],
      [2, [R, Y, Y, Y, Y, R]],
      [3, [R, R, R, Y, R, R]],
      [4, [R, Y, R, R, Y]],
      [5, [R, R, R, R]],
    ])('should return the correct UR diagonal given %i', (given, expected) => {
      const subject = new BoardClass(board);
      expect(subject.getURDiagonal(given)).toEqual(expected);
    });
  });

  describe('getAllLines', () => {
    it.todo('should test getAllLines');
  });
});

describe('identifyMajorThreats', () => {
  it.todo('should test identifyMajorThreats');
});

describe('countOpportunities', () => {
  it.todo('should test countOpportunities');
});
