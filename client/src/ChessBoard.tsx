import React, { useRef, useState } from 'react';
import { Chess, Square, Move } from 'chess.js';
import './ChessBoard.css';

export function getLegalMoves(game: Chess, square: Square): Move[] {
  return game.moves({ square, verbose: true }) as Move[];
}

export function highlightLegalMoves(moves: Move[]): string[] {
  return moves.map(m => m.to);
}

export function isCaptureMove(game: Chess, from: Square, to: Square): boolean {
  const move = getLegalMoves(game, from).find(m => m.to === to);
  if (!move) return false;
  return move.flags.includes('c') || move.flags.includes('e');
}

export const ChessBoard: React.FC = () => {
  const [game] = useState(new Chess());
  const [selected, setSelected] = useState<Square | null>(null);
  const [boardState, setBoardState] = useState(game.board());
  const [pendingPromotion, setPendingPromotion] = useState<{from: Square; to: Square} | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);

  const onSquareClick = (sq: Square) => {
    if (selected) {
      const success = attemptMove(selected, sq);
      if (success) return;
    }
    if (game.get(sq)) setSelected(sq); else setSelected(null);
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

  const attemptMove = (from: Square, to: Square): boolean => {
    const move = getLegalMoves(game, from).find(m => m.to === to);
    if (!move) {
      if (game.get(to)) setSelected(to);
      else setSelected(null);
      return false;
    }

    if (move.flags.includes('p')) {
      setPendingPromotion({ from, to });
      return true;
    }

    animateMove(from, to, () => {
      game.move({ from, to, promotion: 'q' });
      setBoardState(game.board());
      checkGameState();
    });
    setSelected(null);
    return true;
  };

  const promote = (piece: string) => {
    if (!pendingPromotion) return;
    const { from, to } = pendingPromotion;
    game.move({ from, to, promotion: piece as any });
    setPendingPromotion(null);
    setBoardState(game.board());
    checkGameState();
  };

  const checkGameState = () => {
    if (game.in_checkmate()) alert('Échec et mat');
    else if (game.in_stalemate()) alert('Pat');
    else if (game.in_threefold_repetition()) alert('Nulle par répétition');
    else if (game.insufficient_material()) alert('Match nul');
    else if (game.in_draw()) alert('Match nul');
  };

  const renderSquare = (square: Square, piece: any, idx: number) => {
    const isLight = (idx + Math.floor(idx / 8)) % 2 === 0;
    const classNames = ['square', isLight ? 'light' : 'dark'];
    const moves = selected ? highlightLegalMoves(getLegalMoves(game, selected)) : [];
    if (selected === square) classNames.push('selected');
    if (selected && moves.includes(square)) classNames.push(isCaptureMove(game, selected, square) ? 'capture' : 'move');
    return (
      <div
        key={square}
        data-square={square}
        className={classNames.join(' ')}
        onClick={() => onSquareClick(square)}
        onDrop={e => { e.preventDefault(); if (selected) attemptMove(selected, square); }}
        onDragOver={e => e.preventDefault()}
        onTouchEnd={() => onSquareClick(square)}
      >
        {piece && (
          <img
            className="piece"
            draggable
            onDragStart={() => setSelected(square)}
            onTouchStart={() => setSelected(square)}
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
      {pendingPromotion && (
        <div className="promotion-modal">
          {['q', 'r', 'b', 'n'].map(p => (
            <img
              key={p}
              src={getPieceSrc(game.turn(), p)}
              alt={p}
              onClick={() => promote(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChessBoard;
