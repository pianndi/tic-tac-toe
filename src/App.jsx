import { useState } from "react";

function Square({ value, onSquareClick, win }) {
  return (
    <button
      className={"square " + (win && (win[0] || win[1] || win[2]) && "win")}
      onClick={onSquareClick}
    >
      {value}
    </button>
  );
}

function Board({ squares, xIsNext, handlePlay }) {
  const handleClick = (i) => {
    if (squares[i] || findWinner(squares)) return;
    const nextSquares = [...squares];
    nextSquares[i] = xIsNext ? "X" : "O";

    handlePlay(nextSquares);
  };
  const { winner, pattern } = findWinner(squares);
  let status = winner ? "Winner: " + winner : "Next: " + (xIsNext ? "X" : "O");

  return (
    <>
      <h2 style={{ color: winner ? "red" : "black" }}>{status}</h2>
      <div className="board">
        {squares.map((v, i) => (
          <Square
          key={i}
            value={v}
            win={winner && pattern.map((w) => w === i)}
            onSquareClick={() => handleClick(i)}
          />
        ))}
      </div>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const jumpTo = (nextMove) => {
    if (nextMove < 0 || nextMove >= history.length) return;
    setCurrentMove(nextMove);
  };

  const handlePlay = (squares) => {
    const newHistory = [...history.slice(0, currentMove + 1), squares];
    setHistory(newHistory);
    setCurrentMove(newHistory.length - 1);
  };

  return (
    <>
      <Board
        xIsNext={xIsNext}
        squares={currentSquares}
        handlePlay={handlePlay}
      />
      <div className="history">
        <button
          disabled={currentMove === 0}
          onClick={() => jumpTo(currentMove - 1)}
        >
          &laquo; Undo
        </button>
        <button
          disabled={currentMove === history.length - 1}
          onClick={() => jumpTo(currentMove + 1)}
        >
          &raquo; Redo
        </button>
        <ol>
          {history.map((h, i) => (
            <li key={i}>
              <button
                class={i == currentMove && "active"}
                onClick={() => jumpTo(i)}
              >
                {i > 0
                  ? "Go to move #" + i + ` (${i % 2 === 0 ? "X" : "O"})`
                  : "Go to Start"}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}

function findWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2],
  ];
  for (const line of lines) {
    const [a, b, c] = line;
    // console.log(squares[a], squares[b], squares[c]);
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c])
      return { winner: squares[a], pattern: [a, b, c] };
  }
  return false;
}
