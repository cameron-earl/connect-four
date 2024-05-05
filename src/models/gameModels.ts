import Coord from './Coord';
import GameClass from './GameClass';

export const ROW_COUNT = 6;
export const COL_COUNT = 7;
export const CENTER_COL = 3;

export const getMoveList = (): number[] => [0, 1, 2, 3, 4, 5, 6];

export enum PlayerToken {
  Empty = 0, // 0 for falsy checks
  Red = 1,
  Yellow = 2,
  Both = 3, // only used for potential win/loss checking
}

export type LineObj = {
  rows: Row[];
  cols: Column[];
  UR: Line[];
  UL: Line[];
};

export type LineType = keyof LineObj;

export const { Empty, Red, Yellow } = PlayerToken;
export const { Empty: _, Red: R, Yellow: Y } = PlayerToken;

export type PlayerColor = typeof Red | typeof Yellow;

export type Cell = PlayerToken;

export type Column = [Cell, Cell, Cell, Cell, Cell, Cell];
export type Row = [Cell, Cell, Cell, Cell, Cell, Cell, Cell];
export type Line = Cell[];

export type BoardState = [Column, Column, Column, Column, Column, Column, Column];

export const emptyColumn: Column = [_, _, _, _, _, _];
export const emptyRow: Row = [_, _, _, _, _, _, _];
export const getEmptyColumn = (): Column => [...emptyColumn] as Column;

export const emptyBoard: BoardState = new Array(7).fill(null).map(getEmptyColumn) as BoardState;

export interface VictoryObject {
  player: PlayerToken;
  coordinates: Coord[] | null;
}

export interface LineVictoryObject {
  player: PlayerToken;
  coordinates: number[];
}

export type aiMoveScore = { [Red]: number; [Yellow]: number };

export interface AiPersona {
  name: string;
  description: string;
  // move: (game: GameClass) => number;
  instructions: instruction[];
}

export type instruction = {
  move: aiMoveObj;
  chance?: number;
};

export enum MoveType {
  act,
  filter,
  score,
}

export type aiMoveFn = (game: GameClass, moveOptions: number[], testGames: GameClass[]) => number[];

export interface aiMoveObj {
  fn: aiMoveFn;
  moveName: string;
  moveType: MoveType;
  testGameDepth: number;
}
