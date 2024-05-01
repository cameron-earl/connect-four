import React, { MouseEventHandler, useEffect, useState } from 'react';

import { useKeyDown } from '../hooks/useKeyDown';
import GameClass from '../models/GameClass';
import { PlayerToken } from '../models/gameModels';
import { aiPersonas } from '../models/personas';
import { aiMove } from '../utilities/aiFns';
import Board from './Board';
import Button from './Button';
import styles from './Game.module.css';
import Select from './Select';

// should manage overall game state and non-game UI components (reset button, set players, game settings, log, etc)

const DISPLAY_HINTS = true;
const HUMAN = 'human';

const playerOptions = [HUMAN, ...Object.keys(aiPersonas)].map((str) => ({
  value: str,
  label: str[0].toUpperCase() + str.slice(1),
}));

let game = new GameClass();

function Game() {
  const [board, setBoard] = useState(game.board.boardArr);
  const [players, setPlayers] = useState([HUMAN, 'medium']);

  let gameOver = game.gameOver;
  const currentPlayer = players[game.currentPlayer - 1];
  const isHumanPlayer = currentPlayer === HUMAN;
  const hasHumanPlayer = players.includes(HUMAN);

  const handleColumnClick = (colIndex: number) => () => {
    if (!isHumanPlayer) return;
    try {
      game.move(colIndex);
    } catch (e) {
      // move not allowed
      setBoard(game.board.boardArr);
      console.error('Unclickable column somehow clicked');
    }

    setBoard(game.board.boardArr);
  };

  const reset = () => {
    game.reset();
    setBoard(game.board.boardArr);
  };

  const undo = () => {
    const humanPlayerCount = players.reduce((total, el) => total + Number(el === HUMAN), 0);
    if (humanPlayerCount === 2) game.undo(1);
    else game.undo(2);
    setTimeout(() => setBoard(game.board.boardArr), 100);
  };

  const pasteGame = () => {
    const log = prompt('Enter game log');
    if (!log) return;
    game = new GameClass(log);
    setBoard(game.board.boardArr);
  };

  useKeyDown(
    (key: string) => {
      handleColumnClick(Number(key) - 1)();
    },
    ['1', '2', '3', '4', '5', '6', '7']
  );

  useKeyDown(reset, ['r']);
  useKeyDown(pasteGame, ['`']);

  const handlePlayerSelect = (player: 0 | 1) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newVal = event.target.value;
    const newPlayers = [...players];
    newPlayers[player] = newVal;
    setPlayers(newPlayers);
  };

  useEffect(() => {
    if (!!gameOver) return;
    if (isHumanPlayer) {
      console.info({ opportunities: game.board.opportunityCountMap });
    } else {
      setTimeout(() => {
        game.move(aiMove(aiPersonas[currentPlayer], game));
        setBoard(game.board.boardArr);
      }, 500);
    }
  }, [isHumanPlayer, currentPlayer, gameOver, board]);

  const copyMoveLog: MouseEventHandler<HTMLDivElement> = (ev) => {
    const moveLogStr = game.moveLog.join(' ');
    navigator.clipboard.writeText(moveLogStr);
  };

  return (
    <div className={styles.game}>
      <div className={styles.controls}>
        <Select
          label="Red"
          active={!game.gameOver && game.currentPlayer === PlayerToken.Red}
          options={playerOptions}
          value={players[0]}
          onChange={handlePlayerSelect(0)}
        ></Select>
        <Select
          label="Yellow"
          active={!game.gameOver && game.currentPlayer === PlayerToken.Yellow}
          options={playerOptions}
          value={players[1]}
          onChange={handlePlayerSelect(1)}
        ></Select>
        <Button onClick={reset}>Reset</Button>
        <Button disabled={!hasHumanPlayer} onClick={undo}>
          Undo
        </Button>
      </div>
      <Board
        board={board}
        game={game}
        gameOver={gameOver}
        displayHints={DISPLAY_HINTS}
        handleColumnClick={handleColumnClick}
        isHumanPlayer={isHumanPlayer}
      ></Board>

      {gameOver && gameOver.coordinates && (
        <div className={styles.gameOverMessage}>{PlayerToken[gameOver.player]} Wins!</div>
      )}
      <div className={styles.moveLog} onClick={(ev) => copyMoveLog(ev)}>
        {game.moveLog.map((move, i) => {
          return (
            <div className={styles.loggedMove} key={move.toString()}>
              {move.toString()}
            </div>
          );
        })}
      </div>
      {gameOver && !gameOver.coordinates && <div className={styles.gameOverMessage}>Stalemate!</div>}
    </div>
  );
}

export default Game;
