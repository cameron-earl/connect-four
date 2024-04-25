import { _, emptyColumn, PlayerColor, R, Y } from '../models/gameModels';
import { checkLineForWin, coordToMoveStr, getCoordFromLine, getOtherPlayer, moveStrToCoord } from './gameFns';

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

describe('moveStrToCoord', () => {
  it.each([
    ['A1', { col: 0, row: 0 }],
    ['B1', { col: 1, row: 0 }],
    ['C1', { col: 2, row: 0 }],
    ['D1', { col: 3, row: 0 }],
    ['E1', { col: 4, row: 0 }],
    ['F1', { col: 5, row: 0 }],
    ['G1', { col: 6, row: 0 }],
    ['b4', { col: 1, row: 3 }],
    ['g2', { col: 6, row: 1 }],
    ['D6', { col: 3, row: 5 }],
    ['d1', { col: 3, row: 0 }],
    ['C3', { col: 2, row: 2 }],
  ])('should return correct coord given %s', (given, expected) => {
    expect(moveStrToCoord(given)).toEqual(expected);
  });
});

describe('coordToMoveStr', () => {
  it.each([
    ['A1', { col: 0, row: 0 }, R],
    ['b4', { col: 1, row: 3 }, Y],
    ['g2', { col: 6, row: 1 }, Y],
    ['D6', { col: 3, row: 5 }, R],
    ['d1', { col: 3, row: 0 }, Y],
    ['C3', { col: 2, row: 2 }, R],
  ])('should return correct coord given %s', (expected, coord, player) => {
    expect(coordToMoveStr(coord, player as PlayerColor)).toEqual(expected);
  });
});
