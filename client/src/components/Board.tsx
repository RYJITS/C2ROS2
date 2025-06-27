import React, { useState } from 'react';
import { Chess, Square } from 'chess.js';
import './chessboard.css';

const pieceUnicode: Record<string, string> = {
  p: '\u265F',
  r: '\u265C',
  n: '\u265E',
  b: '\u265D',
  q: '\u265B',
  k: '\u265A',
  P: '\u2659',
  R: '\u2656',
  N: '\u2658',
  B: '\u2657',
  Q: '\u2655',
  K: '\u2654',
};

export const Board: React.FC = () => {
  const [game, setGame] = useState(new Chess());
  const [selected, setSelected] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);

  const handleSquareClick = (square: Square) => {
    if (selected) {
      const move = game.move({ from: selected, to: square, promotion: 'q' });
      if (move) {
        setGame(new Chess(game.fen()));
        setSelected(null);
        setLegalMoves([]);
        return;
      }
    }
    const moves = game.moves({ square, verbose: true }) as { to: Square }[];
    if (moves.length) {
      setSelected(square);
      setLegalMoves(moves.map((m) => m.to));
    } else {
      setSelected(null);
      setLegalMoves([]);
    }
  };

  const renderSquare = (square: Square, index: number) => {
    const piece = game.get(square);
    const isDark = (Math.floor(index / 8) + (index % 8)) % 2 === 1;
    const isSelected = selected === square;
    return (
      <div
        key={square}
        className={`square ${isDark ? 'dark' : 'light'} ${isSelected ? 'selected' : ''}`}
        onClick={() => handleSquareClick(square)}
      >
        {piece && <span className="piece">{pieceUnicode[piece.color === 'w' ? piece.type.toUpperCase() : piece.type]}</span>}
        {legalMoves.includes(square) && <span className="dot" />}
      </div>
    );
  };

  const boardSquares: Square[] = [];
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
  for (let r = 7; r >= 0; r--) {
    for (let f = 0; f < 8; f++) {
      boardSquares.push((files[f] + ranks[r]) as Square);
    }
  }

  return <div className="board">{boardSquares.map(renderSquare)}</div>;
};
