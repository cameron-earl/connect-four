import Coord from '../models/Coord';
import GameClass from '../models/GameClass';
import { aiMoveObj, AiPersona, COL_COUNT, MoveType, PlayerColor } from '../models/gameModels';
import { getOtherPlayer, successCheck } from './gameFns';
import { randomArrayElement } from './utils';

const { act, filter, score } = MoveType;

export const moveFns: { [key: string]: aiMoveObj } = {
  random: {
    moveName: 'random',
    moveType: MoveType.act,
    testGameDepth: 0,
    fn: (game, moveOptions) => [randomArrayElement(moveOptions)],
  },
  win: {
    moveName: 'win',
    moveType: MoveType.act,
    testGameDepth: 0,
    fn: (game, moveOptions) => {
      // TODO: sort so that win involving most pieces is first
      return moveOptions.filter((col) => game.isWinningMove(col));
    },
  },
  blockLoss: {
    moveName: 'blockLoss',
    moveType: MoveType.act,
    testGameDepth: 0,
    fn: (game, moveOptions) => {
      const them = getOtherPlayer(game.currentPlayer);
      return moveOptions.filter((col) => game.isWinningMove(col, them));
    },
  },
  createImmediateTrap: {
    moveName: 'createImmediateTrap',
    moveType: MoveType.act,
    testGameDepth: 1,
    fn: (game, moveOptions, testGames) => {
      //   should be *after* win, blockLoss, avoidEnablingLoss
      const immediateTraps: number[] = [];
      for (let move of moveOptions) {
        const testGame = testGames[move];
        const revealedThreatCount = testGame.countRevealedThreats(game.currentPlayer);
        const isTrap = revealedThreatCount > 1;
        if (isTrap) immediateTraps.push(move);
      }
      return immediateTraps;
    },
  },
  enableVerticalTrap: {
    moveName: 'enableVerticalTrap',
    moveType: MoveType.act,
    testGameDepth: 0,
    fn: (game, moveOptions) => {
      const verticalTraps: { col: number; height: number }[] = [];
      for (let m = 0; m < moveOptions.length; m++) {
        const c = moveOptions[m];
        const verticalTrapIdx = game.findVerticalTrap(c, game.currentPlayer);
        if (verticalTrapIdx === -1) continue;
        const firstEmptyRow = game.board.getRevealedRow(c);
        verticalTraps.push({ col: c, height: verticalTrapIdx - firstEmptyRow });
      }
      // TODO: if multiple columns with vertical traps exist, should return the one with the least moves to actualize
      return verticalTraps.sort((a, b) => a.height - b.height).map((obj) => obj.col);
    },
  },
  createVerticalTrap: {
    moveName: 'createVerticalTrap',
    moveType: MoveType.act,
    testGameDepth: 1,
    fn: (game, moveOptions, testGames) => {
      const trapCreatingMoves: number[] = [];
      for (let move of moveOptions) {
        let createsVerticalTrap = false;
        const testGame = testGames[move];
        for (let c = 0; c < COL_COUNT && !createsVerticalTrap; c++) {
          if (testGame.findVerticalTrap(c, game.currentPlayer) !== -1) {
            createsVerticalTrap = true;
            trapCreatingMoves.push(move);
          }
        }
      }
      return trapCreatingMoves;
    },
  },
  createLaterThreat: {
    moveName: 'createLaterThreat',
    moveType: MoveType.act,
    testGameDepth: 1,
    fn: (game, moveOptions, testGames) => {
      const threateningMoves: number[] = [];
      const currentThreatCount = game.countMajorThreats(game.currentPlayer);
      const currentRevealedThreatCount = game.countRevealedThreats(game.currentPlayer);
      for (let move of moveOptions) {
        const testGame = testGames[move];
        const revealedThreatCount = testGame.countRevealedThreats(game.currentPlayer);
        if (currentRevealedThreatCount !== revealedThreatCount) continue;
        const totalThreatCount = testGame.countMajorThreats(game.currentPlayer);
        const newThreatCount = totalThreatCount - currentThreatCount;
        if (newThreatCount > 0) threateningMoves.push(move);
      }
      // TODO: should return the move that creates the most threats
      return threateningMoves;
    },
  },
  createRevealedThreat: {
    moveName: 'createRevealedThreat',
    moveType: MoveType.act,
    testGameDepth: 1,
    fn: (game, moveOptions, testGames) => {
      const threateningMoves: number[] = [];
      const currentThreatCount = game.countRevealedThreats(game.currentPlayer);
      for (let move of moveOptions) {
        const testGame = testGames[move];
        const totalThreatCount = testGame.countRevealedThreats(game.currentPlayer);
        const newThreatCount = totalThreatCount - currentThreatCount;
        if (newThreatCount > 0) threateningMoves.push(move);
      }
      // TODO: should return the move that creates the most threats
      return threateningMoves;
    },
  },
  mostOpportunities: {
    moveName: 'mostOpportunities',
    moveType: MoveType.act,
    testGameDepth: 0,
    fn: (game, moveOptions) => {
      const opportunities = game.board.opportunityCountMap;
      const player = game.currentPlayer;
      const moveValue: number[] = new Array(COL_COUNT).fill(0);
      let max = 0;
      let bestMoves: number[] = [];
      for (let col of moveOptions) {
        const row = game.board.getRevealedRow(col);
        moveValue[col] = opportunities[player][col][row];
        if (moveValue[col] > max) {
          bestMoves = [col];
          max = moveValue[col];
        } else if (moveValue[col] === max) {
          bestMoves.push(col);
        }
      }
      return bestMoves;
    },
  },
  mostBlocks: {
    moveName: 'mostOpportunities',
    moveType: MoveType.act,
    testGameDepth: 0,
    fn: (game, moveOptions) => {
      const opportunities = game.board.opportunityCountMap;
      const player = game.currentPlayer;
      const other = getOtherPlayer(player);
      const moveValue: number[] = new Array(COL_COUNT).fill(0);
      let max = 0;
      let mostBlocks: number[] = [];
      for (let col of moveOptions) {
        const row = game.board.getRevealedRow(col);
        moveValue[col] = opportunities[other][col][row];
        if (moveValue[col] > max) {
          mostBlocks = [col];
          max = moveValue[col];
        } else if (moveValue[col] === max) {
          mostBlocks.push(col);
        }
      }
      return mostBlocks;
    },
  },
  claimEvenOdd: {
    moveName: 'claimEvenOdd',
    moveType: MoveType.act,
    testGameDepth: 0,
    fn: (game, moveOptions) => {
      const result: number[] = [];
      // TODO: rewatch video to make sure I understand strat
      // get major threat map (?)
      // count empty below major threats.
      //   rather complex - should assume players will preferentially expose their own threats to blocking
      //   should account for control switching
      // determine whether player is in control or not
      // determine whether opponent has possible matches not including spots claimed by strat
      // if in control and opponent will not create new threats on their spaces, go for it
      // if not, return empty array

      // claimEven:
      //   player is yellow
      //   red has no odd threats that are not undercut by an even yellow potential threat (?)
      //     how to calculate?
      //   all columns have even amounts of empty spaces left (?)
      //     many exceptions!
      //   create a test board filling in all empty spaces with red in odd rows and yellow in even
      //   if red doesn't win and yellow does, do it
      //   if red wins but is undercut by a yellow win, do it
      //   if only one column is odd, can try it too by simulating going on the odd column
      throw new Error('claimEvenOdd is not yet implemented');
    },
  },
  avoidEnablingLoss: {
    moveName: 'avoidEnablingLoss',
    moveType: MoveType.filter,
    testGameDepth: 0,
    fn: (game, moveOptions) => {
      const otherPlayer = getOtherPlayer(game.currentPlayer);
      return moveOptions.filter(enablesMajorThreat(game, otherPlayer));
    },
  },
  avoidEnablingBlock: {
    moveName: 'avoidEnablingBlock',
    moveType: MoveType.filter,
    testGameDepth: 0,
    fn: (game, moveOptions) => {
      // lower priority than enableVerticalTrap
      return moveOptions.filter(enablesMajorThreat(game, game.currentPlayer));
    },
  },
  avoidEnablingImmediateTrap: {
    moveName: 'avoidEnablingImmediateTrap',
    moveType: MoveType.filter,
    testGameDepth: 2,
    fn: (game, moveOptions, testGames) => {
      const badMoves = [];
      for (let move of moveOptions) {
        const testGame = testGames[move];
        const theirMoveOptions = testGame.getValidMoveOptions();
        const theirTestGames = updateTestGames(testGame, theirMoveOptions);
        const theirImmediateTraps = moveFns.createImmediateTrap.fn(testGame, theirMoveOptions, theirTestGames);
        if (theirImmediateTraps.length) badMoves.push(move);
      }

      return badMoves;
    },
  },
};

export const aiMove = (persona: AiPersona, game: GameClass): number => {
  let currentMoves = game.getValidMoveOptions();
  let testGames: GameClass[] = [];

  for (let i = 0; i < persona.instructions.length && currentMoves.length > 1; i++) {
    const step = persona.instructions[i];
    if (!step.move) {
      console.error(`Instruction misconfiguration for ${persona.name}, step idx ${i} - fn doesn't exist`);
      continue;
    }
    if (step.move.testGameDepth) {
      testGames = updateTestGames(game, currentMoves, testGames);
    }

    const moves = step.move.fn(game, currentMoves, testGames);
    if (moves.length) {
      if (step.move.moveType === act) {
        if (successCheck(moves.length, step.chance)) {
          console.info(`aiMove act ${step.move.moveName}`, { goodMoves: moves });
          return randomArrayElement(moves);
        }
      } else if (step.move.moveType === filter) {
        console.info(`aiMove filter ${step.move.moveName}`, { badMoves: moves });
        if (moves.length === currentMoves.length) {
          console.info(`Only bad moves remain, according to ${step.move.moveName}`);
        }
        for (let move of moves) {
          if (successCheck(1, step.chance) && currentMoves.length > 1) {
            const idx = currentMoves.indexOf(move);
            currentMoves.splice(idx, 1);
          }
        }
      }
    }
  }

  return moveFns.random.fn(game, currentMoves, testGames)[0];
};

const enablesMajorThreat = (game: GameClass, player: PlayerColor) => (col: number) => {
  const row = game.board.getRevealedRow(col) + 1;
  const enablesMajorThreat = game.isWinningCoord(new Coord(row, col), player);
  return enablesMajorThreat;
};

const updateTestGames = (game: GameClass, moveOptions: number[], testGames: GameClass[] = []): GameClass[] => {
  for (let move of moveOptions) {
    if (testGames[move]) continue;
    testGames[move] = new GameClass(game);
    testGames[move].move(move);
  }
  return testGames;
};

/**
 * Search function - Minimax algorithm with Alpha-Beta Pruning
 *

Minimax Algorithm:

Minimax is a decision-making algorithm used in two-player games with perfect information, 
such as Connect Four. The goal is to choose the optimal move for the player while assuming 
that the opponent also plays optimally.

The algorithm explores the game tree recursively, alternating between maximizing and 
minimizing players.

For each level of the tree:
Maximizing player (e.g., the AI) tries to maximize its score.
Minimizing player (e.g., the opponent) tries to minimize the score.
The algorithm computes a score for each possible move and chooses the move with the highest 
score for the maximizing player and the lowest score for the minimizing player.
Alpha-Beta Pruning:

Alpha-Beta Pruning is an optimization technique to reduce the number of nodes evaluated in 
the Minimax algorithm.
It maintains two values, alpha and beta, representing the best possible scores that the 
maximizing and minimizing players can achieve, respectively.
During the search:
If the current node's score is greater than or equal to beta (for a minimizing player) or 
less than or equal to alpha (for a maximizing player), the subtree below this node can be 
pruned because it won't affect the final result.
Alpha is the best value found so far for the maximizing player on the path to the root.
Beta is the best value found so far for the minimizing player on the path to the root.
By pruning irrelevant subtrees, Alpha-Beta Pruning reduces the search space, leading to faster computation.

Score each possible move in each possible game state
a move that causes victory is scored as 1
a move that allows loss before the next turn (assuming the other player acts optimally) is -1
a move that enables an inevitable win is scored as 1
a move that allows an inevitable loss is scored as -1
as for the rest, average move scores?

how to generate each possible game state:
- start with an empty board
- take each possible move
- create string for state and reflected state (column 0 becomes 6, 3 stays the same, etc)
- check if reflection exists, and prune if so
- check if win - if so,
  - add string to win list
  - assume enemy will not make moves that cause this - prune such moves from all preceding game states

- next round, enemy


can I have a list of banned game states? states that allow the other person victory, and must not be allowed, so as to immediately cull choices
goal: leave enemy with no viable moves
need collection of traps and victories! any move will lead to loss against optimal player
any move leading to a loss or a trap must be disallowed
a trap is any state that becomes an inevitable loss (or victory)

idea
- start with all game states within 7 moves, minus reflections
- identify winning states
- remove choices leading to winning states from move 6 boards
- then generate move 8 states, identify wins, and remove those moves from turn 7 boards
- etc

- if all choices are removed, a trap is identified
- this becomes a winning move for the other team
- backtracing? how? list of precursor boards?
- would it be more efficient to search forward from each board a few ahead? probably not? but how to cull the tree? run multiple times? mark each as "seen"?


model:
object
each key is a string of digits, 0, 1, and 2 // convert to trinary number?
under each key is a number of different data points:
- an array of game states and the games they lead to (index = move)
- an array of game states that lead to here (index = move). many will be empty.
- indication of turn? or segregated by index in larger array?
- indication of whether this path is "solved" - should I skip?
- which moves are optimal? which moves lead to a loss?

stringKeyA: {
  next: [
    'stringKey0', 'stringKey1',....
  ],
  previous: [
    null,
    'stringKey-1',
    'stringKey-2',
    null,
    null, ....
  ],
  turn: 13,
  score: -1 to 1
}

needed:
- function to convert to string key
- function to obtain reverse key
- method and file to save data

 *
 */

/**** SCORING  ********/
/*
Things worth points:
- Simultaneous/unblockable threats
- Major threats
- Minor threats
- Opportunities
- claim even/odd?

- major threats on odd rows are better for p1, and even rows for p2
- an undercut threat is not worth as much as one that is not undercut

*/
