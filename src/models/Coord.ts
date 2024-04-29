import { PlayerColor, PlayerToken } from './gameModels';

class Coord {
  private _row: number;
  private _col: number;
  constructor(col: number | string, row?: number) {
    if (typeof col === 'number' && row !== undefined && typeof row === 'number') {
      this._col = col;
      this._row = row;
    } else if (typeof col === 'string') {
      const [colStr, rowStr] = col.split('');

      this._col = colStr.toLowerCase().charCodeAt(0) - 97;
      this._row = Number(rowStr) - 1;
    } else {
      throw new Error(`Called Coord constructer with invalid args: col:${col}, row:${row}`);
    }
  }

  get row() {
    return this._row;
  }

  get col() {
    return this._col;
  }

  toString(player: PlayerColor): string {
    let colStr = 'ABCDEFG';
    if (player === PlayerToken.Yellow) colStr = colStr.toLowerCase();
    return colStr[this.col] + (this.row + 1);
  }

  equals(other: any) {
    if (!(other instanceof Coord)) return false;
    return other.col === this.col && other.row === this.row;
  }
}

export default Coord;
