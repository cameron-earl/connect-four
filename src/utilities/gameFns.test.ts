import Coord from '../models/Coord';
import { _, emptyColumn, R, Y } from '../models/gameModels';
import { checkIdxInLine, checkLineForWin, getCoordFromLine, getOtherPlayer } from './gameFns';

describe('getAllLines', () => {
  it.todo('should return proper lines');
});

describe('getCoordFromLine', () => {
  describe('rows', () => {
    it('should correctly translate row coords', () => {
      expect(getCoordFromLine('rows', 2, 5)).toEqual(new Coord({ col: 5, row: 2 }));
      expect(getCoordFromLine('rows', 5, 6)).toEqual(new Coord({ col: 6, row: 5 }));
      expect(getCoordFromLine('rows', 0, 0)).toEqual(new Coord({ col: 0, row: 0 }));
    });
  });
  describe('cols', () => {
    it('should correctly translate col coords', () => {
      expect(getCoordFromLine('cols', 5, 2)).toEqual(new Coord({ col: 5, row: 2 }));
      expect(getCoordFromLine('cols', 6, 5)).toEqual(new Coord({ col: 6, row: 5 }));
      expect(getCoordFromLine('cols', 0, 0)).toEqual(new Coord({ col: 0, row: 0 }));
    });
  });
  describe('UR', () => {
    it('should correctly translate UR coords', () => {
      expect(getCoordFromLine('UR', 0, 0)).toEqual(new Coord({ col: 3, row: 0 }));
      expect(getCoordFromLine('UR', 5, 1)).toEqual(new Coord({ col: 1, row: 3 }));
      expect(getCoordFromLine('UR', 0, 3)).toEqual(new Coord({ col: 6, row: 3 }));
      expect(getCoordFromLine('UR', 1, 4)).toEqual(new Coord({ col: 6, row: 4 }));
      expect(getCoordFromLine('UR', 4, 2)).toEqual(new Coord({ col: 2, row: 3 }));
    });
  });
  describe('UL', () => {
    it('should correctly translate UL coords', () => {
      expect(getCoordFromLine('UL', 0, 0)).toEqual(new Coord({ col: 3, row: 0 }));
      expect(getCoordFromLine('UL', 0, 1)).toEqual(new Coord({ col: 2, row: 1 }));
      expect(getCoordFromLine('UL', 1, 0)).toEqual(new Coord({ col: 4, row: 0 }));
      expect(getCoordFromLine('UL', 3, 5)).toEqual(new Coord({ col: 1, row: 5 }));
      expect(getCoordFromLine('UL', 4, 0)).toEqual(new Coord({ col: 6, row: 1 }));
      expect(getCoordFromLine('UL', 5, 1)).toEqual(new Coord({ col: 5, row: 3 }));
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

describe('checkIdxInLine', () => {
  it.each([
    [_, 0],
    [_, 1],
    [_, 2],
    [R, 3],
    [_, 4],
    [_, 5],
    [_, 6],
  ])('should return %p on idx %i for line with first three filled and last four empty', (expected, idx) => {
    const line = [R, R, R, _, _, _, _];
    const actual = checkIdxInLine(line, idx, R);
    expect(actual).toBe(expected);
  });

  it.each([
    [_, 0],
    [_, 1],
    [_, 2],
    [_, 3],
    [_, 4],
    [_, 5],
    [R, 6],
  ])('should return %p on idx %i for problematic line', (expected, idx) => {
    const line = [_, Y, R, R, R, R, _];
    const actual = checkIdxInLine(line, idx, R);
    expect(actual).toBe(expected);
  });
});
