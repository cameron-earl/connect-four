import {
  checkLineForWin,
  coordToMoveStr,
  getCoordFromLine,
  getOtherPlayer,
  moveStrToCoord,
} from '../utilities/gameFns';
import { copy1dArr } from '../utilities/utils';
import BoardClass from './BoardClass';
import {
  BoardState,
  Coord,
  Empty,
  getMoveList,
  LineType,
  PlayerColor,
  PlayerToken,
  Red,
  VictoryObject,
  Yellow,
} from './gameModels';

class GameClass {
  private _startingPlayer: PlayerToken.Red | PlayerToken.Yellow;
  private _startTime: number = Date.now();
  private _board: BoardClass = new BoardClass();
  private _gameOver: VictoryObject | null = null;
  private _moveLog: string[] = [];
  private _lastCoord: Coord | null = null;

  constructor(board?: BoardState | GameClass, startingPlayer: PlayerColor = Red) {
    if (board instanceof GameClass) {
      const other: GameClass = board;
      this._board = new BoardClass(other.board);
      this._gameOver = other.gameOver;
      this._startTime = other.startTime;
      this._moveLog = copy1dArr(other.moveLog);
      this._lastCoord = other.lastCoord;
    } else if (Array.isArray(board)) {
      const moveCount = board.reduce((sum, col) => sum + col.filter((cell) => cell !== Empty).length, 0);
      this._moveLog = new Array(moveCount).fill('?');
      // TODO: moveLog and lastCoord problematic?
      this._board = new BoardClass(board);
    }
    this._startingPlayer = startingPlayer;
  }

  get board(): BoardClass {
    return this._board;
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

    const { row } = this._board.move(col, this.currentPlayer);

    this.logMove({ col, row });
    this.checkForVictory();
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

    const linesObj = this._board.getAllLines();
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

  public reset(): void {
    this._board = new BoardClass();
    this._gameOver = null;
    this._moveLog = [];
  }

  public getValidMoveOptions(): number[] {
    return getMoveList().filter((col) => this.isMoveValid(col));
  }

  public isMoveValid(colIdx: number): boolean {
    return this._board.isMoveValid(colIdx);
  }

  public isWinningCoord(coord: Coord, player: PlayerColor): boolean {
    // TODO: move to BoardClass ?
    const val = this.board.majorThreatMap[coord.col][coord.row];
    return val === PlayerToken.Both || val === player;
  }

  public isWinningMove(col: number, player: PlayerColor = this.currentPlayer): boolean {
    // TODO: move to BoardClass ?
    const row = this._board.getRevealedRow(col);
    return this.isWinningCoord({ row, col }, player);
  }

  private logMove(coord: Coord) {
    this._lastCoord = coord;
    this._moveLog.push(coordToMoveStr(coord, this.currentPlayer));
  }

  public countRevealedThreats(player: PlayerColor) {
    // TODO: move to BoardClass
    const revealedRows = this._board.getRevealedRows();
    return revealedRows.reduce((acc: number, row: number, col: number) => {
      const threat = this.board.majorThreatMap[col][row];
      const isPlayerThreat = threat === player || threat === PlayerToken.Both;
      return acc + Number(isPlayerThreat);
    }, 0);
  }

  public countMajorThreats(player: PlayerColor) {
    // TODO: move to BoardClass
    const countThreat = (count: number, threat: PlayerToken) =>
      count + Number(threat === player || threat === PlayerToken.Both);
    return this.board.majorThreatMap.reduce((acc, col) => {
      return acc + col.reduce(countThreat, 0);
    }, 0);
  }

  public findVerticalTrap(c: number, player: PlayerColor): number {
    // TODO: move to BoardClass
    const col = this.board.majorThreatMap[c];
    for (let i = 0; i < col.length - 1; i++) {
      if (!col[i]) continue;
      if (col[i] !== player) break;
      if (col[i + 1] === player || col[i + 1] === PlayerToken.Both) {
        return i;
      }
    }
    return -1;
  }

  public undo(n: number): void {
    for (let i = 0; this._moveLog.length && i < n && this._lastCoord; i++) {
      this.board.remove(this._lastCoord.col);
      this._moveLog.pop();
      if (this._moveLog.length) {
        const lastMoveStr = this._moveLog[this._moveLog.length - 1];
        this._lastCoord = moveStrToCoord(lastMoveStr);
      } else {
        this._lastCoord = null;
      }
    }
    this.checkForVictory();
  }
}

export default GameClass;
