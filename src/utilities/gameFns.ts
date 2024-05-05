import Coord from '../models/Coord';
import {
  BoardState,
  CENTER_COL,
  Empty,
  emptyBoard,
  Line,
  LineType,
  LineVictoryObject,
  PlayerColor,
  PlayerToken,
  Red,
  ROW_COUNT,
  Yellow,
} from '../models/gameModels';
import { copy2dArr } from './utils';

export const checkIdxInLine = (line: Line, idx: number, player: PlayerColor): PlayerToken => {
  if (line[idx] !== Empty) return Empty;
  const lineCopy = [...line];
  lineCopy[idx] = player;
  const result = checkLineForWin(lineCopy);

  return result && result.coordinates.includes(idx) ? result.player : Empty;
};

export const removeInaccessibleThreats = (threatMap: BoardState): BoardState => {
  const result = copy2dArr(threatMap) as BoardState;
  for (let col of result) {
    let foundBoth = false;
    for (let r = 0; r < ROW_COUNT; r++) {
      if (foundBoth) {
        col[r] = Empty;
      } else if (col[r] === PlayerToken.Both) {
        foundBoth = true;
      }
    }
  }
  return result;
};

export const getCoordFromLine = (lineType: LineType, lineIdx: number, cellIdx: number): Coord => {
  let col: number;
  let row: number;
  switch (lineType) {
    case 'rows':
      return new Coord({ col: cellIdx, row: lineIdx });
    case 'cols':
      return new Coord({ col: lineIdx, row: cellIdx });
    case 'UR':
      col = CENTER_COL - lineIdx + cellIdx;
      row = cellIdx;
      if (lineIdx > CENTER_COL) {
        col += lineIdx - CENTER_COL;
        row += lineIdx - CENTER_COL;
      }
      return new Coord({ col, row });
    case 'UL':
      col = CENTER_COL + lineIdx - cellIdx;
      row = cellIdx;
      if (lineIdx > CENTER_COL) {
        col -= lineIdx - CENTER_COL;
        row += lineIdx - CENTER_COL;
      }
      return new Coord({ col, row });
    default:
  }
  throw new Error(`This shouldn't happen`);
};

export const checkLineForWin = (line: Line): LineVictoryObject | null => {
  // assumes line of 7 or less, which works for lines, cols, and all diagonals
  if (line.length < 4 || line[CENTER_COL] === Empty) {
    return null;
  }
  for (let i = 0; i < line.length - 3; i++) {
    if (line[i] !== Empty && line[i + 1] === line[i] && line[i + 2] === line[i] && line[i + 3] === line[i]) {
      const result = { player: line[i], coordinates: [i] };
      for (let j = 1; i + j < line.length && line[i + j] === line[i]; j++) {
        result.coordinates.push(i + j);
      }
      return result;
    }
  }
  return null;
};

export const getOtherPlayer = (player: PlayerColor) => (player === Red ? Yellow : Red);

// All below untested

export const successCheck = (power: number = 1, chanceToSucceed: number = 1): boolean => {
  if (chanceToSucceed === 1) return true;
  const chanceToFail = (1 - chanceToSucceed) ** power;
  return Math.random() > chanceToFail;
};

export const getEmptyBoardArr = (): BoardState => {
  return [...emptyBoard.map((col) => [...col])] as BoardState;
};

export const matches = (player: PlayerColor) => (val: PlayerToken) => val === Empty || val === player;
