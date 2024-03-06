import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(() => createBoard());

  function randomlyLit() {
    const binary = Math.random();
    let boolean = false;
    binary <= chanceLightStartsOn ? boolean = false : boolean = true;
    return boolean;
  };

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    let r = 0;
    while (r < nrows) {
      let rowArray = [];
      let c = 0;
      while (c < ncols) {
        rowArray.push(randomlyLit());
        c++;
      }
      initialBoard.push(rowArray);
      r++;
    }
    return initialBoard;
  };

  function hasWon() {
    // check the board in state to determine whether the player has won.
    let r = 0;
    while (r < nrows) {
      let c = 0;
      while (c < ncols) {
        if (board[r][c] === false) {
          return false;
        }
        c++;
      }
      r++;
    }
    return true;
  };

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      const newBoard = oldBoard.map(row => [...row]);

      // in the copy, flip this cell and the cells around it
      flipCell(y, x, newBoard);
      flipCell(y + 1, x, newBoard);
      flipCell(y - 1, x, newBoard);
      flipCell(y, x + 1, newBoard);
      flipCell(y, x - 1, newBoard);

      // return the copy
      return newBoard;
    });
  };

  // if the game is won, just show a winning msg & render nothing else

  if (hasWon()) {
    return (<h1>You Won!</h1>);
  }

  // make table board

  return (
    <table>
      <tbody>
        {board.map((row, rowIdx) => <tr>
          {board[rowIdx].map(
            (cell, cellIdx) => 
            <Cell 
              flipCellsAroundMe={() => flipCellsAround(`${rowIdx}-${cellIdx}`)} 
              isLit={cell} 
            />
          )}
        </tr>)}
      </tbody>
    </table>
  );
};

export default Board;
