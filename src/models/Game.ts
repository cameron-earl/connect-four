import {
  checkLineForWin,
  getAllLines,
  getCoordFromLine,
  getEmptyBoard,
  getOtherPlayer,
  identifyMajorThreats,
} from '../utilities/gameFns';
import { copy1dArr, copy2dArr, firstFalsyIdx } from '../utilities/utils';
import {
  BoardState,
  COL_COUNT,
  Coord,
  Empty,
  getMoveList,
  LineType,
  PlayerColor,
  PlayerToken,
  Red,
  ROW_COUNT,
  VictoryObject,
  Yellow,
} from './gameModels';

class GameClass {
  private _startingPlayer: PlayerToken.Red | PlayerToken.Yellow;
  private _board: BoardState = getEmptyBoard();
  private _gameOver: VictoryObject | null = null;
  private _majorThreats: BoardState = getEmptyBoard();
  private _startTime: number = Date.now();
  private _moveLog: string[] = [];
  private _lastCoord: Coord | null = null;

  constructor(board?: BoardState | GameClass, startingPlayer: PlayerColor = Red) {
    if (board instanceof GameClass) {
      const other: GameClass = board;
      this._board = copy2dArr(other.board) as BoardState;
      this._gameOver = other.gameOver;
      this._startTime = other.startTime;
      this._moveLog = copy1dArr(other.moveLog);
      this._lastCoord = other.lastCoord;
    } else if (!!board) {
      const moveCount = board.reduce((sum, col) => sum + col.filter((cell) => cell !== Empty).length, 0);
      this._moveLog = new Array(moveCount).fill('?');
      // TODO: moveLog and lastCoord problematic?
      this._board = board;
      this.updateMajorThreats();
    }
    this._startingPlayer = startingPlayer;
  }

  get board(): BoardState {
    return [...this._board] as BoardState;
  }

  get currentPlayer(): PlayerToken.Red | PlayerToken.Yellow {
    return Boolean(this.moveCount % 2) ? getOtherPlayer(this._startingPlayer) : this._startingPlayer;
  }

  get moveCount() {
    return this._moveLog.length;
  }

  get gameOver() {
    return this._gameOver;
  }

  get majorThreats() {
    return this._majorThreats;
  }

  get startTime() {
    return this._startTime;
  }

  get moveLog() {
    return this._moveLog;
  }

  get lastCoord() {
    return this._lastCoord;
  }

  public toggleStartingPlayer() {
    this._startingPlayer = getOtherPlayer(this._startingPlayer);
  }

  public move(col: number): void {
    if (!this.isMoveValid(col)) {
      console.error({ board: this._board, col });
      throw new Error('Move impossible!');
    }

    const row = firstFalsyIdx(this._board[col]);
    this._board[col][row] = this.currentPlayer;

    this.logMove({ col, row });
    this.checkForVictory();
    this.updateMajorThreats();
  }

  public checkForVictory(): void {
    if (this.moveCount < 7) {
      this._gameOver = null;
      return;
    }

    const endObj: VictoryObject = {
      player: Empty,
      coordinates: null,
    };

    const linesObj = getAllLines(this._board);
    for (let key in linesObj) {
      const lineType = key as LineType;
      const lines = linesObj[lineType];
      for (let i = 0; i < lines.length; i++) {
        const win = checkLineForWin(lines[i]);
        if (win) {
          if (!endObj.player) {
            endObj.player = win.player;
            endObj.coordinates = win.coordinates.map((cellIdx) => getCoordFromLine(lineType, i, cellIdx));
          } else if (endObj.coordinates) {
            for (let cellIdx of win.coordinates) {
              endObj.coordinates.push(getCoordFromLine(lineType, i, cellIdx));
            }
          }
        }
      }
    }

    if (endObj.player || this.moveCount === 42) {
      this._gameOver = endObj;
    } else {
      this._gameOver = null;
    }
  }

  public updateMajorThreats(): void {
    if (this._gameOver) {
      this._majorThreats = getEmptyBoard();
    } else {
      this._majorThreats = identifyMajorThreats(this._board);
    }
  }

  public reset(): void {
    this._board = getEmptyBoard();
    this._majorThreats = getEmptyBoard();
    this._gameOver = null;
    this._moveLog = [];
  }

  public getValidMoveOptions(): number[] {
    return getMoveList().filter((col) => this.isMoveValid(col));
  }

  public isMoveValid(colIdx: number): boolean {
    return colIdx >= 0 && colIdx < COL_COUNT && this._board[colIdx][ROW_COUNT - 1] === PlayerToken.Empty;
  }

  public isWinningCoord(coord: Coord, player: PlayerColor): boolean {
    const val = this.majorThreats[coord.col][coord.row];
    return val === PlayerToken.Both || val === player;
  }

  public isWinningMove(col: number, player: PlayerColor = this.currentPlayer): boolean {
    const row = firstFalsyIdx(this._board[col]);
    return this.isWinningCoord({ row, col }, player);
  }

  private logMove(coord: Coord) {
    this._lastCoord = coord;
    let colStr = 'ABCDEFG';
    if (this.currentPlayer === PlayerToken.Yellow) colStr = colStr.toLowerCase();
    this._moveLog.push(colStr[coord.col] + (coord.row + 1));
  }

  public countRevealedThreats(player: PlayerColor) {
    const revealedRows = this.getRevealedRows();
    return revealedRows.reduce((acc, row, col) => {
      const threat = this.majorThreats[col][row];
      const isPlayerThreat = threat === player || threat === PlayerToken.Both;
      return acc + Number(isPlayerThreat);
    }, 0);
  }

  public getRevealedRows() {
    return this._board.map(firstFalsyIdx);
  }

  public countMajorThreats(player: PlayerColor) {
    const countThreat = (count: number, threat: PlayerToken) =>
      count + Number(threat === player || threat === PlayerToken.Both);
    return this.majorThreats.reduce((acc, col) => {
      return acc + col.reduce(countThreat, 0);
    }, 0);
  }

  public findVerticalTrap(c: number, player: PlayerColor): number {
    const col = this.majorThreats[c];
    for (let i = 0; i < col.length - 1; i++) {
      if (!col[i]) continue;
      if (col[i] !== player) break;
      if (col[i + 1] === player || col[i + 1] === PlayerToken.Both) {
        return i;
      }
    }
    return -1;
  }
}

export default GameClass;
