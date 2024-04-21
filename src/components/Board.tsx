import React from 'react';

import GameClass from '../models/Game';
import { BoardState, Empty, VictoryObject } from '../models/gameModels';
import styles from './Board.module.css';
import Cell from './Cell';

// should manage only the actual board display, and whatever game state doesn't need to be pulled up higher

interface BoardProps {
  board: BoardState;
  game: GameClass;
  gameOver: VictoryObject | null;
  displayHints: boolean;
  handleColumnClick: (colIdx: number) => void;
  isHumanPlayer: boolean;
}

const Board = ({ board, game, gameOver, displayHints, handleColumnClick, isHumanPlayer }: BoardProps) => {
  const boardEl = board.map((col, colIdx) => {
    const clickable = isHumanPlayer && gameOver === null && col.includes(Empty);

    return (
      <div
        className={`${styles.col} ${clickable ? styles.clickable : ''}`}
        key={colIdx + col.toString()}
        onClick={(clickable ? handleColumnClick(colIdx) : () => {}) as any}
      >
        {col.map((cell, rowIdx) => {
          const isWinningCoord: boolean =
            !!gameOver && !!gameOver.coordinates?.some((c) => c.col === colIdx && c.row === rowIdx);
          const majorThreat = displayHints ? game.majorThreats[colIdx][rowIdx] : Empty;
          const isNew = !!game.lastCoord && colIdx === game.lastCoord.col && rowIdx === game.lastCoord.row;
          return (
            <Cell
              key={`${colIdx}-${rowIdx}`}
              value={cell}
              isWinningCoord={isWinningCoord}
              colIdx={colIdx}
              rowIdx={rowIdx}
              startTime={game.startTime}
              majorThreat={majorThreat}
              isNew={isNew}
            />
          );
        })}
      </div>
    );
  });

  return <div className={`${styles.board} ${gameOver !== null ? styles.gameOver : ''}`}>{boardEl}</div>;
};

export default Board;
