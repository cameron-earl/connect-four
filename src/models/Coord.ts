import { isUpperCase } from '../utilities/utils';
import { PlayerColor, PlayerToken, Red, Yellow } from './gameModels';

class Coord {
  private _row: number;
  private _col: number;
  private _player: PlayerColor;
  constructor(coord: { row: number; col: number } | string, player?: PlayerColor) {
    if (typeof coord === 'object') {
      this._col = coord.col;
      this._row = coord.row;
      this._player = player ? player : Red;
    } else if (typeof coord === 'string') {
      const [colStr, rowStr] = coord.split('');
      this._col = colStr.toLowerCase().charCodeAt(0) - 97;
      this._row = Number(rowStr) - 1;
      this._player = isUpperCase(colStr) ? Red : Yellow;
    } else {
      throw new Error(`Called Coord constructer with invalid arg: coord: ${coord}`);
    }
  }

  get row() {
    return this._row;
  }

  get col() {
    return this._col;
  }

  get player() {
    return this._player;
  }

  toString(): string {
    let colStr = 'ABCDEFG';
    if (this._player === PlayerToken.Yellow) colStr = colStr.toLowerCase();
    return colStr[this.col] + (this.row + 1);
  }

  equals(other: any) {
    if (!(other instanceof Coord)) return false;
    return other.col === this.col && other.row === this.row;
  }
}

export default Coord;
