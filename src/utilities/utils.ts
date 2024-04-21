/**
 * Functions in this file should have no references to game-specific classes, and should be generally usable in many projects.
 */

export const seededRandom = (a: number): number => {
  // mulberry32
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const randomArrayElement = <T>(arr: T[]): T => {
  const idx = Math.floor(Math.random() * arr.length);
  return arr[idx];
};

export const copy1dArr = <T>(arr: T[]): T[] => {
  return [...arr];
};

export const copy2dArr = <T>(arr: T[][]): T[][] => {
  return arr.map(copy1dArr);
};

export const firstFalsyIdx = <T>(arr: T[]): number => arr.findIndex((e) => !e);
