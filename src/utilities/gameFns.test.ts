import { _, BoardState, emptyColumn, R, Y } from '../models/gameModels';
import {
  checkLineForWin,
  colIdxInBounds,
  getCol,
  getCoordFromLine,
  getOtherPlayer,
  getRow,
  getULDiagonal,
  getULDiagonalObj,
  getURDiagonal,
  getURDiagonalObj,
  rowIdxInBounds,
} from './gameFns';

describe('getRow', () => {
  const board: BoardState = [
    [R, R, R, Y, R, R],
    [R, R, Y, R, R, R],
    [R, Y, R, R, R, R],
    [Y, R, R, R, R, R],
    [R, R, R, R, R, Y],
    [R, R, R, R, Y, R],
    [R, R, R, Y, R, R],
  ];
  it('should return the correct row', () => {
    const actual = getRow(board, 0);
    expect(actual).toEqual([R, R, R, Y, R, R, R]);
  });
});

describe('getCol', () => {
  const board: BoardState = [
    [R, R, R, Y, R, R],
    [R, R, Y, R, R, R],
    [R, Y, R, R, R, R],
    [Y, R, R, R, R, R],
    [R, R, R, R, R, Y],
    [R, R, R, R, Y, R],
    [R, R, R, Y, R, R],
  ];

  it('should return the correct col', () => {
    const actual = getCol(board, 0);
    expect(actual).toEqual([R, R, R, Y, R, R]);
    expect(actual).not.toBe(board[0]);
  });
});

describe('colIdxInBounds', () => {
  it('should return false for -1', () => {
    expect(colIdxInBounds(-1)).toBeFalsy();
  });
  it('should return false for 7', () => {
    expect(colIdxInBounds(7)).toBeFalsy();
  });
  it('should return true for 0', () => {
    expect(colIdxInBounds(0)).toBeTruthy();
  });
  it('should return true for 6', () => {
    expect(colIdxInBounds(6)).toBeTruthy();
  });
});

describe('rowIdxInBounds', () => {
  it('should return false for -1', () => {
    expect(rowIdxInBounds(-1)).toBeFalsy();
  });
  it('should return false for 7', () => {
    expect(rowIdxInBounds(6)).toBeFalsy();
  });
  it('should return true for 0', () => {
    expect(rowIdxInBounds(0)).toBeTruthy();
  });
  it('should return true for 6', () => {
    expect(rowIdxInBounds(5)).toBeTruthy();
  });
});

describe('getULDiagonal', () => {
  it('should return the correct UL diagonals', () => {
    const board: BoardState = [
      [R, R, R, Y, R, Y],
      [R, R, Y, R, R, R],
      [R, Y, R, R, R, R],
      [Y, R, Y, Y, R, R],
      [R, R, R, R, R, Y],
      [R, Y, R, Y, Y, R],
      [R, R, R, Y, R, R],
    ];
    expect(getULDiagonal(board, 3, 0)).toEqual([Y, Y, Y, Y]);
    expect(getULDiagonal(board, 1, 4)).toEqual([R, R, Y, R, R, Y]);
    expect(getULDiagonal(board, 5, 1)).toEqual([R, Y, R, Y, R, R]);
    expect(getULDiagonal(board, 5, 3)).toEqual([R, Y, R, R]);
  });
});

describe('getURDiagonal', () => {
  it('should return the correct UR diagonals', () => {
    const board: BoardState = [
      [R, R, R, Y, R, Y],
      [R, R, Y, R, R, R],
      [R, Y, R, R, R, R],
      [Y, R, Y, Y, R, R],
      [R, R, R, R, R, Y],
      [R, Y, R, Y, Y, R],
      [R, R, R, Y, R, R],
    ];
    expect(getURDiagonal(board, 3, 0)).toEqual([Y, R, R, Y]);
    expect(getURDiagonal(board, 5, 4)).toEqual([R, Y, Y, R, Y, R]);
    expect(getURDiagonal(board, 1, 1)).toEqual([R, R, R, Y, R, R]);
    expect(getURDiagonal(board, 1, 3)).toEqual([R, R, R, R]);
  });
});

describe('getULDiagonalObj', () => {
  it('should return single value from 2D array of 1', () => {
    const arr = [['A']];
    const actual = getULDiagonalObj(arr, 0, 0);

    expect(actual.line).toEqual(['A']);
    expect(actual.index).toEqual(0);
  });

  it('should return correct values from 2D array of 2, 2', () => {
    const arr = [
      ['A', 'B'],
      ['C', 'D'],
    ];

    const actual = getULDiagonalObj(arr, 1, 0);

    expect(actual.line).toEqual(['C', 'B']);
    expect(actual.index).toEqual(0);
  });

  it('should return correct values from 2D array of 7, 6', () => {
    const board: BoardState = [
      [R, R, R, Y, R, R],
      [R, R, R, R, R, R],
      [R, Y, R, R, R, R],
      [Y, R, R, R, R, R],
      [R, R, R, R, R, R],
      [R, R, R, R, R, R],
      [R, R, R, R, R, R],
    ];

    const actual = getULDiagonalObj(board, 2, 1);
    expect(actual.line).toEqual([Y, Y, R, Y]);
    expect(actual.index).toEqual(1);
  });
});

describe('getURiagonalObj', () => {
  it('should return correct values from 2D array of 7, 6', () => {
    const board: BoardState = [
      [R, R, R, R, R, R],
      [Y, R, R, R, R, R],
      [R, Y, R, R, R, R],
      [R, R, Y, R, R, R],
      [R, R, R, Y, R, R],
      [R, R, R, R, R, R],
      [R, R, R, R, R, R],
    ];

    const actual = getURDiagonalObj(board, 2, 1);
    expect(actual.line).toEqual([Y, Y, Y, Y, R, R]);
    expect(actual.index).toEqual(1);
  });

  it('should handle a problem case', () => {
    const board: BoardState = [
      emptyColumn,
      emptyColumn,
      [R, _, _, _, _, _],
      [Y, R, _, _, _, _],
      [Y, Y, R, _, _, _],
      [Y, Y, Y, _, _, _],
      emptyColumn,
    ];
    const actual = getURDiagonalObj(board, 5, 3);
    expect(actual.line).toEqual([R, R, R, _, _]);
  });
});

describe('getAllLines', () => {
  it.todo('should return proper lines');
});

describe('getCoordFromLine', () => {
  describe('rows', () => {
    it('should correctly translate row coords', () => {
      expect(getCoordFromLine('rows', 2, 5)).toEqual({ col: 5, row: 2 });
      expect(getCoordFromLine('rows', 5, 6)).toEqual({ col: 6, row: 5 });
      expect(getCoordFromLine('rows', 0, 0)).toEqual({ col: 0, row: 0 });
    });
  });
  describe('cols', () => {
    it('should correctly translate col coords', () => {
      expect(getCoordFromLine('cols', 5, 2)).toEqual({ col: 5, row: 2 });
      expect(getCoordFromLine('cols', 6, 5)).toEqual({ col: 6, row: 5 });
      expect(getCoordFromLine('cols', 0, 0)).toEqual({ col: 0, row: 0 });
    });
  });
  describe('UR', () => {
    it('should correctly translate UR coords', () => {
      expect(getCoordFromLine('UR', 0, 0)).toEqual({ col: 3, row: 0 });
      expect(getCoordFromLine('UR', 5, 1)).toEqual({ col: 1, row: 3 });
      expect(getCoordFromLine('UR', 0, 3)).toEqual({ col: 6, row: 3 });
      expect(getCoordFromLine('UR', 1, 4)).toEqual({ col: 6, row: 4 });
      expect(getCoordFromLine('UR', 4, 2)).toEqual({ col: 2, row: 3 });
    });
  });
  describe('UL', () => {
    it('should correctly translate UL coords', () => {
      expect(getCoordFromLine('UL', 0, 0)).toEqual({ col: 3, row: 0 });
      expect(getCoordFromLine('UL', 0, 1)).toEqual({ col: 2, row: 1 });
      expect(getCoordFromLine('UL', 1, 0)).toEqual({ col: 4, row: 0 });
      expect(getCoordFromLine('UL', 3, 5)).toEqual({ col: 1, row: 5 });
      expect(getCoordFromLine('UL', 4, 0)).toEqual({ col: 6, row: 1 });
      expect(getCoordFromLine('UL', 5, 1)).toEqual({ col: 5, row: 3 });
    });
  });
});

describe('getLinesForCoord', () => {
  it.todo('getLinesForCoord');
});

describe('identifyMajorThreats', () => {
  it.todo('should find major threats');
  it.todo('should ignore major threats in column above a cell with both');
});

describe('checkLineForWin', () => {
  it('should return null for empty column', () => {
    expect(checkLineForWin(emptyColumn)).toBeNull();
  });

  it('should return correct player and coords for red win at index 0', () => {
    const line = [R, R, R, R, _, _];
    const actual = checkLineForWin(line);
    expect(actual).not.toBeNull();
    expect(actual?.player).toBe(R);
    expect(actual?.coordinates).toEqual([0, 1, 2, 3]);
  });

  it('should return correct player and coords for yellow win at end of row', () => {
    const line = [R, R, R, Y, Y, Y, Y];
    const actual = checkLineForWin(line);
    expect(actual).not.toBeNull();
    expect(actual?.player).toBe(Y);
    expect(actual?.coordinates).toEqual([3, 4, 5, 6]);
  });

  it('should return correct player and coords for yellow win at end of column', () => {
    const line = [R, _, Y, Y, Y, Y];
    const actual = checkLineForWin(line);
    expect(actual).not.toBeNull();
    expect(actual?.player).toBe(Y);
    expect(actual?.coordinates).toEqual([2, 3, 4, 5]);
  });
});

describe('getOtherPlayer', () => {
  it('should return Red given Yellow', () => {
    expect(getOtherPlayer(Y)).toBe(R);
  });

  it('should return Yellow given Red', () => {
    expect(getOtherPlayer(R)).toBe(Y);
  });
});
