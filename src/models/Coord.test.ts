import Coord from './Coord';
import { PlayerColor, R, Y } from './gameModels';

describe('constructor', () => {
  it('should correctly initialize Coord', () => {
    const subject = new Coord(3, 5);

    expect(subject.row).toBe(5);
    expect(subject.col).toBe(3);
  });

  it.each([
    ['A1', 0, 0],
    ['B2', 1, 1],
    ['C3', 2, 2],
    ['D4', 3, 3],
    ['E5', 4, 4],
    ['F6', 5, 5],
    ['G1', 6, 0],
    ['b4', 1, 3],
    ['g2', 6, 1],
    ['D6', 3, 5],
    ['d1', 3, 0],
    ['C5', 2, 4],
  ])('should correctly initialize Coord given string %s', (given, expectedCol, expectedRow) => {
    const subject = new Coord(given);
    expect(subject.col).toEqual(expectedCol);
    expect(subject.row).toEqual(expectedRow);
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
  ])(`should correctly convert from coord col:%i, row:%i to string %s`, (expected, col, row, player) => {
    const subject = new Coord(col as number, row as number);
    expect(subject.toString(player as PlayerColor)).toEqual(expected);
  });
});

describe('equals', () => {
  it.each([
    [5, 3],
    [0, 0],
    [6, 5],
  ])('should return true for similar objects given col %i and row %i', (col, row) => {
    const subjectA = new Coord(col, row);
    const subjectB = new Coord(col, row);
    expect(subjectA.equals(subjectB)).toBeTruthy();
  });

  it.each([
    [5, 3, 5, 4],
    [0, 0, 0, 1],
    [6, 5, 0, 5],
  ])('should return true for similar objects given colA %i, rowA %i and colB %i, rowB %i', (colA, rowA, colB, rowB) => {
    const subjectA = new Coord(colA, rowA);
    const subjectB = new Coord(colB, rowB);
    expect(subjectA.equals(subjectB)).toBeFalsy();
  });
});
