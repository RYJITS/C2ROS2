import React, { useEffect, useRef, useState } from 'react';
import { Chess, Square, Move } from 'chess.js';
import './ChessBoard.css';

export function getLegalMoves(game: Chess, square: Square): Move[] {
  return game.moves({ square, verbose: true }) as Move[];
}

export function highlightMoves(moves: Move[]): string[] {
  return moves.map(m => m.to);
}

export const ChessBoard: React.FC = () => {
  const [game] = useState(new Chess());
  const [selected, setSelected] = useState<Square | null>(null);
  const [boardState, setBoardState] = useState(game.board());
  const boardRef = useRef<HTMLDivElement>(null);

  const onSquareClick = (sq: Square) => {
    if (selected) {
      const moves = getLegalMoves(game, selected);
      const move = moves.find(m => m.to === sq);
      if (move) {
        animateMove(selected, sq, () => {
          game.move({ from: selected, to: sq, promotion: 'q' });
          setBoardState(game.board());
        });
        setSelected(null);
        return;
      }
    }
    if (game.get(sq)) {
      setSelected(sq);
    } else {
      setSelected(null);
    }
  };

  const animateMove = (from: Square, to: Square, cb: () => void) => {
    const board = boardRef.current;
    if (!board) return cb();
    const fromEl = board.querySelector<HTMLDivElement>(`[data-square="${from}"] .piece`);
    const toEl = board.querySelector<HTMLDivElement>(`[data-square="${to}"]`);
    if (!fromEl || !toEl) return cb();
    const rectFrom = fromEl.getBoundingClientRect();
    const rectTo = toEl.getBoundingClientRect();
    const dx = rectTo.left - rectFrom.left;
    const dy = rectTo.top - rectFrom.top;
    fromEl.style.transition = 'transform 0.3s';
    fromEl.style.transform = `translate(${dx}px, ${dy}px)`;
    const handle = () => {
      fromEl.style.transition = '';
      fromEl.style.transform = '';
      fromEl.removeEventListener('transitionend', handle);
      cb();
    };
    fromEl.addEventListener('transitionend', handle);
  };

  const renderSquare = (square: Square, piece: any, idx: number) => {
    const isLight = (idx + Math.floor(idx / 8)) % 2 === 0;
    const classNames = ['square', isLight ? 'light' : 'dark'];
    const moves = selected ? highlightMoves(getLegalMoves(game, selected)) : [];
    if (selected === square) classNames.push('selected');
    if (moves.includes(square)) classNames.push(game.get(square) ? 'capture' : 'move');
    return (
      <div
        key={square}
        data-square={square}
        className={classNames.join(' ')}
        onClick={() => onSquareClick(square)}
      >
        {piece && (
          <img
            className="piece"
            draggable={true}
            src={getPieceSrc(piece.color, piece.type)}
            alt={piece.type}
          />
        )}
      </div>
    );
  };

  const getPieceSrc = (color: 'b' | 'w', type: string) => {
    const map: Record<string, string> = {
      p: 'P', r: 'R', n: 'N', b: 'B', q: 'Q', k: 'K',
    };
    return `/src/assets/pieces/cburnett/${color}${map[type]}.svg`;
  };

  return (
    <div className="board-wrapper">
      <div className="board" ref={boardRef}>
        {game.SQUARES.map((sq: Square, idx: number) =>
          renderSquare(sq, game.get(sq), idx)
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
