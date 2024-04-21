// This is a place to put functions that I'm not using any more but I might want to reference
export default {};

// const shuffleArr = <T>(arr: T[]): T[] => {
//   const newArr = [...arr];
//   for (let i = newArr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * i);
//     const temp = newArr[i];
//     newArr[i] = newArr[j];
//     newArr[j] = temp;
//   }
//   return newArr;
// };

// function analyzeMove(board: BoardState, col: number): AIMoveScore | null {
//   const row = board[col].indexOf(Empty);
//   if (row < 0) return null;

//   const returnVal = { [Red]: 0, [Yellow]: 0 };

//   const scores: AIMoveScore[] = [];
//   // check vertical
//   scores.push(scoreLine(board[col], row));
//   // check horizontal
//   scores.push(scoreLine(getRow(board, row), col));
//   // check diagonals
//   const diag1 = getURDiagonalObj(board, col, row);
//   scores.push(scoreLine(diag1.line, diag1.index));

//   const diag2 = getULDiagonalObj(board, col, row);
//   scores.push(scoreLine(diag2.line, diag2.index));

//   for (let score of scores) {
//     returnVal[Red] += score[Red];
//     returnVal[Yellow] += score[Yellow];
//   }

//   return returnVal;
// }

// const scoreLine = (line: Line, i: number): AIMoveScore => {
//   const BASE = 4;
//   const returnVal = { [Red]: 0, [Yellow]: 0 };
//   const start = Math.max(i - 3, 0);
//   const end = Math.min(i, line.length - 4);
//   for (let i = start; i <= end; i++) {
//     const counts = line.slice(i, i + 4).reduce(
//       (arr, p) => {
//         arr[p]++;
//         return arr;
//       },
//       [0, 0, 0]
//     );
//     returnVal[Yellow] += counts[Red] ? 0 : BASE ** counts[Yellow];
//     returnVal[Red] += counts[Yellow] ? 0 : BASE ** counts[Red];
//   }
//   return returnVal;
// };

// const calculateWinLossChance = (game: GameClass): number[] => {
//   // get current player
//   const currentPlayer = game.currentPlayer;

//   // for each column, simulate a move there
//   // if win, return 1

//   return [];
// };

// export function checkDiagonalWin(board: BoardState): VictoryObject | null {
//   for (let iY = 0; iY <= 2; iY++) {
//     for (let iX = 0; iX < 4; iX++) {
//       const y = board[0].length - 1 - iY;
//       const lX = iX;

//       const checkDiagonal = (c1: Coord, nextCoord: (c: Coord) => Coord): VictoryObject | null => {
//         const c2: Coord = nextCoord(c1);
//         const c3: Coord = nextCoord(c2);
//         const c4: Coord = nextCoord(c3);
//         const token = board[c1.col][c1.row];
//         if (board[c2.col][c2.row] === token && board[c3.col][c3.row] === token && board[c4.col][c4.row] === token) {
//           return { player: token, coordinates: [c4, c3, c2, c1] } as VictoryObject;
//         } else return null;
//       };

//       if (board[lX][y] !== PlayerToken.Empty) {
//         const nextCoord = (c: Coord): Coord => ({ col: c.col + 1, row: c.row - 1 });
//         const c1: Coord = { col: lX, row: y };
//         const victoryCheck = checkDiagonal(c1, nextCoord);
//         if (victoryCheck) return victoryCheck;
//       }
//       const rX = board.length - 1 - iX;
//       if (board[rX][y] !== PlayerToken.Empty) {
//         const nextCoord = (c: Coord): Coord => ({ col: c.col - 1, row: c.row - 1 });
//         const c1: Coord = { col: rX, row: y };
//         const victoryCheck = checkDiagonal(c1, nextCoord);
//         if (victoryCheck) return victoryCheck;
//       }
//     }
//   }
//   return null;
// }
