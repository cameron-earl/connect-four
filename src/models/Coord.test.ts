import Coord from './Coord';
import { PlayerColor, R, Y } from './gameModels';

describe('constructor', () => {
  it('should correctly initialize Coord', () => {
    const subject = new Coord({ col: 3, row: 5 });

    expect(subject.row).toBe(5);
    expect(subject.col).toBe(3);
  });

  it.each([
    ['A1', 0, 0, R],
    ['B2', 1, 1, R],
    ['C3', 2, 2, R],
    ['D4', 3, 3, R],
    ['E5', 4, 4, R],
    ['F6', 5, 5, R],
    ['G1', 6, 0, R],
    ['b4', 1, 3, Y],
    ['g2', 6, 1, Y],
    ['D6', 3, 5, R],
    ['d1', 3, 0, Y],
    ['C5', 2, 4, R],
  ])('should correctly initialize Coord given string %s', (given, expectedCol, expectedRow, expectedPlayer) => {
    const subject = new Coord(given);
    expect(subject.col).toEqual(expectedCol);
    expect(subject.row).toEqual(expectedRow);
    expect(subject.player).toEqual(expectedPlayer);
  });
});

describe('toString', () => {
  it.each([
    ['A1', 0, 0, R],
    ['b4', 1, 3, Y],
    ['g2', 6, 1, Y],
    ['D6', 3, 5, R],
    ['d1', 3, 0, Y],
    ['C3', 2, 2, R],
  ])(`should correctly convert to %s from coord col:%i, row:%i`, (expected, col, row, player) => {
    const subject = new Coord({ col, row }, player as PlayerColor);
    expect(subject.toString()).toEqual(expected);
  });
});

describe('equals', () => {
  it.each([
    [5, 3],
    [0, 0],
    [6, 5],
  ])('should return true for similar objects given col %i and row %i', (col, row) => {
    const subjectA = new Coord({ col, row });
    const subjectB = new Coord({ col, row });
    expect(subjectA.equals(subjectB)).toBeTruthy();
  });

  it.each([
    [5, 3, 5, 4],
    [0, 0, 0, 1],
    [6, 5, 0, 5],
  ])('should return true for similar objects given colA %i, rowA %i and colB %i, rowB %i', (colA, rowA, colB, rowB) => {
    const subjectA = new Coord({ col: colA, row: rowA });
    const subjectB = new Coord({ col: colB, row: rowB });
    expect(subjectA.equals(subjectB)).toBeFalsy();
  });
});
