import { _, R, Y } from '../models/gameModels';
import { copy1dArr, copy2dArr, firstFalsyIdx, randomArrayElement, seededRandom } from './utils';

describe('seededRandom', () => {
  it('should return proper value for 0', () => {
    expect(seededRandom(0)).toBe(0.26642920868471265);
  });
  it('should return proper value for 3e13', () => {
    expect(seededRandom(3e13)).toBe(0.9435161123983562);
  });
  it('should return proper value for "-1"', () => {
    expect(seededRandom(-1)).toBe(0.8964226141106337);
  });
  it('should return proper value for Math.PI', () => {
    expect(seededRandom(Math.PI)).toBe(0.7202267837710679);
  });
});

describe('randomArrayElement', () => {
  let placeholder: () => number;
  const arr = ['first', 'second', 'third', 'fourth'];

  beforeAll(() => {
    placeholder = Math.random;
  });

  afterAll(() => {
    Math.random = placeholder;
  });

  it('should return first el given 0 for rand', () => {
    Math.random = () => 0;
    expect(randomArrayElement(arr)).toEqual('first');
  });

  it('should return second el given 0.3 for rand', () => {
    Math.random = () => 0.3;
    expect(randomArrayElement(arr)).toEqual('second');
  });

  it('should return first el given 0.6 for rand', () => {
    Math.random = () => 0.6;
    expect(randomArrayElement(arr)).toEqual('third');
  });

  it('should return first el given 0.99 for rand', () => {
    Math.random = () => 0.99;
    expect(randomArrayElement(arr)).toEqual('fourth');
  });
});

describe('copy1dArr', () => {
  it('should return identical, but different, array', () => {
    const arr = ['first', 'second', 'third', 'fourth'];

    const actual = copy1dArr(arr);

    expect(actual).toEqual(arr);
    expect(actual).not.toBe(arr);
  });
});

describe('copy2dArr', () => {
  it('should return identical, but different, array', () => {
    const arr: any[][] = [
      [1, 2, 3, 4],
      ['stuff', 'things', 'test'],
    ];

    const actual = copy2dArr(arr);
    expect(actual.length).toBe(arr.length);
    expect(actual[0]).toEqual(arr[0]);
    expect(actual[1]).toEqual(arr[1]);
    expect(actual[0]).not.toBe(arr[0]);
    expect(actual[1]).not.toBe(arr[1]);
  });
});

describe('firstFalsyIdx', () => {
  it('should return 0 for empty line', () => {
    expect(firstFalsyIdx([_, _, _, _, _, _])).toBe(0);
  });
  it('should return -1 for filled line', () => {
    expect(firstFalsyIdx([R, R, Y, Y, R, Y])).toBe(-1);
  });
  it('should return 1 for line with one token', () => {
    expect(firstFalsyIdx([R, _, _, _, _, _])).toBe(1);
    expect(firstFalsyIdx([Y, _, _, _, _, _])).toBe(1);
  });
  it('should return correct index for various arrays', () => {
    expect(firstFalsyIdx([R, Y, _, _, _, _])).toBe(2);
    expect(firstFalsyIdx([Y, R, R, _, _, _])).toBe(3);
    expect(firstFalsyIdx([R, R, R, Y, _, _])).toBe(4);
    expect(firstFalsyIdx([Y, R, R, Y, R, _])).toBe(5);
  });
});
