import React from 'react';

import { Empty, PlayerToken } from '../models/gameModels';
import { seededRandom } from '../utilities/utils';
import styles from './Cell.module.css';

type CellProps = {
  value: PlayerToken;
  isWinningCoord: boolean;
  colIdx: number;
  rowIdx: number;
  startTime: number;
  majorThreat: PlayerToken;
  isNew: boolean;
};

const Cell = ({ value, isWinningCoord, colIdx, rowIdx, startTime, majorThreat, isNew }: CellProps) => {
  const getPieceRotation = (): number => {
    const seed = Number('' + colIdx + rowIdx + (startTime % 1e6));
    return Math.floor(seededRandom(seed) * 360);
  };

  return (
    <div className={styles.cellWrapper}>
      <div className={`${styles.cell} ${majorThreat ? styles['majorThreat-' + majorThreat] : ''}`}>
        {value !== Empty && (
          <div className={`${styles.pieceWrapper} ${isWinningCoord ? styles.winning : ''} `}>
            <div
              className={`
              ${styles.piece} 
              ${styles[PlayerToken[value]]} 
              ${isNew ? styles.new : ''} `}
              style={{ transform: `rotate(${getPieceRotation()}deg)` }}
            >
              <div>4</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cell;
