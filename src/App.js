import { useState } from "react";

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  
  const moves = history.map((squares, move) => {
    let description;
    description = move > 0 ? 'Go to move #' + move : 'Go to game start';
    const itemToDisplay = 
      move == currentMove ?
        <p className="green current-move"> You are at move #{move} </p> 
      :  
        <button className="passerelle" onClick={() => jumpTo(move)}> {description} </button>
  
    return (
      <li className="green" key={move}>
       {itemToDisplay}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <ol reversed>{moves}</ol>
      </div>
    </div>
  )
}

function Square({value, onSquareClick}) {
  return( 
    <button  className={value == "X" ? "square" : "square o"} onClick={onSquareClick} >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;

    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O"
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  status = winner ?  "Winner: " + winner :  "Next player: " + (xIsNext ? "X" : "O");

  let renderDivs = []
  let renderSquares = []
  let count = 0

  for (let i = 0; i < 3; i++) { 
    for (let j = 0; j < 3; j++) {
      let id = count
      renderSquares.push(<Square key={id} value={squares[id]} onSquareClick={() => handleClick(id)}/>)
      count++;
    } 
    renderDivs.push(<div key={i} className="board-row">{renderSquares}</div>)
    renderSquares = []
  }


  return (
    <>
      <div className="status">{status}</div>
    
      {renderDivs}
    </>
  )
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
