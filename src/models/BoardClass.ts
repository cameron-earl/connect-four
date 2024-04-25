import {
  checkIdxInLine,
  getCoordFromLine,
  getEmptyBoardArr,
  getOtherPlayer,
  matches,
  removeInaccessibleThreats,
} from '../utilities/gameFns';
import { copy1dArr, copy2dArr, firstFalsyIdx } from '../utilities/utils';
import {
  BoardState,
  CENTER_COL,
  COL_COUNT,
  Column,
  Coord,
  Empty,
  Line,
  LineObj,
  LineType,
  PlayerColor,
  PlayerToken,
  Red,
  Row,
  ROW_COUNT,
  Yellow,
} from './gameModels';

class BoardClass {
  private _boardArr: BoardState = getEmptyBoardArr();
  private _majorThreatMap: BoardState | null = null;
  private _opportunityCountMap: { [key in PlayerColor]: number[][] } | null = null;

  constructor(board?: BoardClass | BoardState) {
    if (board) {
      if (board instanceof BoardClass) {
        this._boardArr = board.boardArr;
      } else if (Array.isArray(board)) {
        this._boardArr = copy2dArr(board) as BoardState;
      }
    }
  }

  get boardArr(): BoardState {
    return copy2dArr(this._boardArr) as BoardState;
  }

  move(col: number, player: PlayerColor): Coord {
    const row = firstFalsyIdx(this._boardArr[col]);
    this._boardArr[col][row] = player;
    this.resetAnalysis();
    return { col, row };
  }

  remove(col: number): void {
    const row = this.getTopFilledRow(col);
    if (this.rowIdxInBounds(row)) {
      this._boardArr[col][row] = Empty;
      this.resetAnalysis();
    }
  }

  private resetAnalysis(): void {
    this._majorThreatMap = null;
    this._opportunityCountMap = null;
  }

  colIdxInBounds = (c: number) => c >= 0 && c < COL_COUNT;
  rowIdxInBounds = (r: number) => r >= 0 && r < ROW_COUNT;
  isMoveValid = (c: number) => this.colIdxInBounds(c) && this.getRevealedRow(c) >= 0;
  getRevealedRow = (c: number) => firstFalsyIdx(this._boardArr[c]);
  getRevealedRows = () => this._boardArr.map(firstFalsyIdx);
  getTopFilledRow = (c: number) => {
    const revealedRow = this.getRevealedRow(c);
    const highestFilledRow = (revealedRow === -1 ? ROW_COUNT : revealedRow) - 1;
    return highestFilledRow;
  };

  getCol = (col: number): Column => copy1dArr(this._boardArr[col]) as Column;
  getRow = (row: number): Row => this._boardArr.map((col) => col[row]) as Row;

  getURDiagonal(row: number): Line {
    const line = [];
    const stepsToBase = Math.min(row, CENTER_COL);
    for (let i = 0 - stepsToBase; row + i < ROW_COUNT && CENTER_COL + i < COL_COUNT; i++) {
      line.push(this._boardArr[CENTER_COL + i][row + i]);
    }
    return line;
  }

  getULDiagonal(row: number): Line {
    const line = [];
    const stepsToBase = Math.min(row, COL_COUNT - 1 - CENTER_COL);
    for (let i = 0 - stepsToBase; row + i < ROW_COUNT && CENTER_COL - i >= 0; i++) {
      line.push(this._boardArr[CENTER_COL - i][row + i]);
    }
    return line;
  }

  getAllLines = (): LineObj => {
    let lines: LineObj = { cols: [], rows: [], UL: [], UR: [] };
    for (let i = 0; i < ROW_COUNT; i++) {
      lines.cols.push(this.getCol(i));
      lines.rows.push(this.getRow(i));
      lines.UL.push(this.getULDiagonal(i));
      lines.UR.push(this.getURDiagonal(i));
    }
    lines.cols.push(this.getCol(COL_COUNT - 1));

    return lines;
  };

  get majorThreatMap(): BoardState {
    if (this._majorThreatMap) return this._majorThreatMap;

    let record = getEmptyBoardArr();

    const checkAndRecord = (line: Line, lineType: LineType, lineIdx: number) => {
      return (player: PlayerColor, cellIdx: number): void => {
        const result = checkIdxInLine(line, cellIdx, player);
        if (!result) return;
        const coord = getCoordFromLine(lineType, lineIdx, cellIdx);
        const currentRecord = record[coord.col][coord.row];
        if (!currentRecord) {
          record[coord.col][coord.row] = result;
        } else if (currentRecord === getOtherPlayer(result as PlayerColor)) {
          record[coord.col][coord.row] = PlayerToken.Both;
        }
      };
    };

    const linesObj = this.getAllLines();
    for (let key in linesObj) {
      const lineType = key as LineType;
      const lines = linesObj[lineType as LineType];
      for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const check = checkAndRecord(line, lineType, i);
        if (line[CENTER_COL] === Empty) {
          check(Red, CENTER_COL);
          check(Yellow, CENTER_COL);
        } else {
          const color = line[CENTER_COL] as PlayerColor;
          for (let cellIdx = 0; cellIdx < line.length; cellIdx++) {
            if (!line[cellIdx]) {
              check(color, cellIdx);
            }
          }
        }
      }
    }

    this._majorThreatMap = removeInaccessibleThreats(record);
    return this._majorThreatMap;
  }

  get opportunityCountMap(): { [key in PlayerColor]: number[][] } {
    if (this._opportunityCountMap) return this._opportunityCountMap;
    const result = {
      [Red]: getEmptyBoardArr() as number[][],
      [Yellow]: getEmptyBoardArr() as number[][],
    };
    const lines = this.getAllLines();
    for (let key in lines) {
      const lineType = key as LineType;
      const lineGroup = lines[lineType];
      for (let l = 0; l < lineGroup.length; l++) {
        const line = lineGroup[l];
        for (let i = 0; i < line.length - 3; i++) {
          for (let player of [Red, Yellow] as PlayerColor[]) {
            const match = matches(player);
            if (match(line[i]) && match(line[i + 1]) && match(line[i + 2]) && match(line[i + 3])) {
              const matchCoords = [
                getCoordFromLine(lineType, l, i),
                getCoordFromLine(lineType, l, i + 1),
                getCoordFromLine(lineType, l, i + 2),
                getCoordFromLine(lineType, l, i + 3),
              ];
              for (let coord of matchCoords) {
                if (!!this._boardArr[coord.col][coord.row]) continue;
                result[player][coord.col][coord.row] += 1;
              }
            }
          }
        }
      }
    }
    this._opportunityCountMap = result;
    return this._opportunityCountMap;
  }
}

export default BoardClass;
