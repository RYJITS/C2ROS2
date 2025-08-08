// Core chess engine (ES module): full legal moves with king-safety,
// checkmate/stalemate, castling, en passant, auto-queen.

export const Color = { W: 'w', B: 'b' };

export function makeStart() {
  return parseFEN('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
}

export function parseFEN(fen) {
  const [placement, active, castling, ep, halfmove, fullmove] = fen.trim().split(/\s+/);
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  let r = 0, c = 0;
  for (const ch of placement) {
    if (ch === '/') { r++; c = 0; continue; }
    if (/\d/.test(ch)) { c += parseInt(ch, 10); continue; }
    const color = ch === ch.toLowerCase() ? 'b' : 'w';
    const type = ch.toLowerCase();
    board[r][c++] = { t: type, c: color };
  }
  return {
    board,
    turn: active === 'w' ? 'w' : 'b',
    castling: new Set(castling === '-' ? [] : castling.split('')),
    ep: ep === '-' ? null : ep,
    halfmove: parseInt(halfmove || '0', 10),
    fullmove: parseInt(fullmove || '1', 10),
  };
}

export function toFEN(s) {
  const rows = [];
  for (let r = 0; r < 8; r++) {
    let row = '', empty = 0;
    for (let c = 0; c < 8; c++) {
      const p = s.board[r][c];
      if (!p) { empty++; continue; }
      if (empty) { row += String(empty); empty = 0; }
      row += p.c === 'w' ? p.t.toUpperCase() : p.t;
    }
    if (empty) row += String(empty);
    rows.push(row);
  }
  const castle = [...s.castling].sort().join('') || '-';
  const ep = s.ep || '-';
  return `${rows.join('/') } ${s.turn} ${castle} ${ep} ${s.halfmove || 0} ${s.fullmove || 1}`;
}

function clone(s) {
  return {
    board: s.board.map(row => row.map(p => (p ? { t: p.t, c: p.c } : null))),
    turn: s.turn,
    castling: new Set([...s.castling]),
    ep: s.ep,
    halfmove: s.halfmove,
    fullmove: s.fullmove,
  };
}

function inBounds(r, c) { return r >= 0 && r < 8 && c >= 0 && c < 8; }

function kingPos(board, color) {
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c];
    if (p && p.t === 'k' && p.c === color) return { r, c };
  }
  return null;
}

function attackedBy(board, r, c, attacker) {
  // Knights
  const KN = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for (const [dr, dc] of KN) {
    const rr = r + dr, cc = c + dc;
    if (!inBounds(rr, cc)) continue;
    const p = board[rr][cc];
    if (p && p.c === attacker && p.t === 'n') return true;
  }
  // Rooks/Queens (orthogonal)
  const OR = [[1,0],[-1,0],[0,1],[0,-1]];
  for (const [dr, dc] of OR) {
    let rr = r + dr, cc = c + dc;
    while (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p) { if (p.c === attacker && (p.t === 'r' || p.t === 'q')) return true; break; }
      rr += dr; cc += dc;
    }
  }
  // Bishops/Queens (diagonals)
  const DI = [[1,1],[1,-1],[-1,1],[-1,-1]];
  for (const [dr, dc] of DI) {
    let rr = r + dr, cc = c + dc;
    while (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p) { if (p.c === attacker && (p.t === 'b' || p.t === 'q')) return true; break; }
      rr += dr; cc += dc;
    }
  }
  // Pawns
  const dir = attacker === 'w' ? -1 : 1;
  for (const dc of [-1, 1]) {
    const rr = r + dir, cc = c + dc;
    if (inBounds(rr, cc)) {
      const p = board[rr][cc];
      if (p && p.c === attacker && p.t === 'p') return true;
    }
  }
  // King
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    if (!dr && !dc) continue;
    const rr = r + dr, cc = c + dc;
    if (!inBounds(rr, cc)) continue;
    const p = board[rr][cc];
    if (p && p.c === attacker && p.t === 'k') return true;
  }
  return false;
}

export function isInCheck(s, color) {
  const k = kingPos(s.board, color);
  if (!k) return false;
  return attackedBy(s.board, k.r, k.c, color === 'w' ? 'b' : 'w');
}

function addMove(list, from, to, flags = {}) { list.push({ from, to, ...flags }); }

function genPseudo(s) {
  const m = [];
  const { board, turn, castling, ep } = s;
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) {
    const p = board[r][c];
    if (!p || p.c !== turn) continue;
    const add = (rr, cc, flags = {}) => {
      if (!inBounds(rr, cc)) return;
      const t = board[rr][cc];
      if (!t || t.c !== turn) addMove(m, { r, c }, { r: rr, c: cc }, flags);
    };
    if (p.t === 'n') {
      const KN = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (const [dr, dc] of KN) add(r + dr, c + dc);
    } else if (p.t === 'b' || p.t === 'r' || p.t === 'q') {
      const dirs = p.t === 'b' ? [[1,1],[1,-1],[-1,1],[-1,-1]]
               : p.t === 'r' ? [[1,0],[-1,0],[0,1],[0,-1]]
               : [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
      for (const [dr, dc] of dirs) {
        let rr = r + dr, cc = c + dc;
        while (inBounds(rr, cc)) {
          const t = board[rr][cc];
          add(rr, cc);
          if (t) break;
          rr += dr; cc += dc;
        }
      }
    } else if (p.t === 'k') {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        add(r + dr, c + dc);
      }
      const home = (turn === 'w') ? 7 : 0;
      if (r === home && c === 4) {
        const canK = castling.has(turn === 'w' ? 'K' : 'k');
        const canQ = castling.has(turn === 'w' ? 'Q' : 'q');
        if (canK && !board[home][5] && !board[home][6]) addMove(m, { r, c }, { r: home, c: 6 }, { castle: 'K' });
        if (canQ && !board[home][1] && !board[home][2] && !board[home][3]) addMove(m, { r, c }, { r: home, c: 2 }, { castle: 'Q' });
      }
    } else if (p.t === 'p') {
      const dir = (turn === 'w') ? -1 : 1;
      const start = (turn === 'w') ? 6 : 1;
      const r1 = r + dir;
      if (inBounds(r1, c) && !board[r1][c]) {
        addMove(m, { r, c }, { r: r1, c });
        const r2 = r + 2 * dir;
        if (r === start && !board[r2][c]) addMove(m, { r, c }, { r: r2, c }, { double: true });
      }
      for (const dc of [-1, 1]) {
        const rr = r + dir, cc = c + dc;
        if (!inBounds(rr, cc)) continue;
        const t = board[rr][cc];
        if (t && t.c !== turn) addMove(m, { r, c }, { r: rr, c: cc });
      }
      if (ep) {
        const file = ep.charCodeAt(0) - 97;
        const rank = 8 - parseInt(ep[1], 10);
        if (rank === r + dir && Math.abs(file - c) === 1) addMove(m, { r, c }, { r: rank, c: file }, { ep: true });
      }
    }
  }
  return m;
}

export function applyMove(s, mv) {
  const n = clone(s);
  const b = n.board;
  const t = n.turn;
  n.ep = null;

  const p = b[mv.from.r][mv.from.c];
  let capturedPiece = null;

  if (mv.castle) {
    const home = (t === 'w') ? 7 : 0;
    if (mv.castle === 'K') {
      b[home][4] = null; b[home][6] = { t: 'k', c: t };
      b[home][5] = { t: 'r', c: t }; b[home][7] = null;
    } else {
      b[home][4] = null; b[home][2] = { t: 'k', c: t };
      b[home][3] = { t: 'r', c: t }; b[home][0] = null;
    }
    if (t === 'w') { n.castling.delete('K'); n.castling.delete('Q'); }
    else { n.castling.delete('k'); n.castling.delete('q'); }
  } else {
    capturedPiece = b[mv.to.r][mv.to.c];

    if (mv.ep) {
      b[mv.to.r][mv.to.c] = p;
      b[mv.from.r][mv.from.c] = null;
      const capRow = mv.to.r + (t === 'w' ? 1 : -1);
      capturedPiece = b[capRow][mv.to.c];
      b[capRow][mv.to.c] = null;
    } else {
      b[mv.to.r][mv.to.c] = p;
      b[mv.from.r][mv.from.c] = null;
    }

    if (p.t === 'p' && mv.double) {
      const file = String.fromCharCode(97 + mv.to.c);
      const passedRow = (mv.from.r + mv.to.r) / 2;
      const rank = 8 - passedRow;
      n.ep = file + String(rank);
    }

    if (p.t === 'p' && (mv.to.r === 0 || mv.to.r === 7)) {
      b[mv.to.r][mv.to.c] = { t: 'q', c: t };
    }

    const home = (t === 'w') ? 7 : 0, opp = (t === 'w') ? 0 : 7;
    if (p.t === 'k') {
      if (t === 'w') { n.castling.delete('K'); n.castling.delete('Q'); }
      else { n.castling.delete('k'); n.castling.delete('q'); }
    }
    if (p.t === 'r') {
      if (t === 'w') {
        if (mv.from.r === home && mv.from.c === 0) n.castling.delete('Q');
        if (mv.from.r === home && mv.from.c === 7) n.castling.delete('K');
      } else {
        if (mv.from.r === opp && mv.from.c === 0) n.castling.delete('q');
        if (mv.from.r === opp && mv.from.c === 7) n.castling.delete('k');
      }
    }
    if (capturedPiece && capturedPiece.t === 'r') {
      if (t === 'w') {
        if (mv.to.r === opp && mv.to.c === 0) n.castling.delete('q');
        if (mv.to.r === opp && mv.to.c === 7) n.castling.delete('k');
      } else {
        if (mv.to.r === home && mv.to.c === 0) n.castling.delete('Q');
        if (mv.to.r === home && mv.to.c === 7) n.castling.delete('K');
      }
    }
  }

  const captureOccurred = !!capturedPiece || !!mv.ep;
  n.halfmove = (p.t === 'p' || captureOccurred) ? 0 : ((n.halfmove || 0) + 1);
  if (t === 'b') n.fullmove = (n.fullmove || 1) + 1;

  n.turn = (t === 'w') ? 'b' : 'w';
  return n;
}

export function legalMoves(s) {
  const out = [];
  for (const mv of genPseudo(s)) {
    const nx = applyMove(s, mv);
    if (!isInCheck(nx, s.turn)) out.push(mv);
  }
  return out;
}

export function isCheckmate(s) {
  return isInCheck(s, s.turn) && legalMoves(s).length === 0;
}
export function isStalemate(s) {
  return !isInCheck(s, s.turn) && legalMoves(s).length === 0;
}

export function san(s, mv) {
  const files = ['a','b','c','d','e','f','g','h'];
  const p = s.board[mv.from.r][mv.from.c];
  let txt = '';
  if (mv.castle === 'K') txt = 'O-O';
  else if (mv.castle === 'Q') txt = 'O-O-O';
  else {
    const capture = s.board[mv.to.r][mv.to.c] || mv.ep;
    const letter = { k:'K', q:'Q', r:'R', b:'B', n:'N', p:'' }[p.t];
    if (p.t !== 'p') txt += letter;
    if (capture) { if (p.t === 'p') txt += files[mv.from.c]; txt += 'x'; }
    txt += files[mv.to.c] + (8 - mv.to.r);
    if (p.t === 'p' && (mv.to.r === 0 || mv.to.r === 7)) txt += '=Q';
  }
  const nx = applyMove(s, mv);
  if (isCheckmate(nx)) txt += '#';
  else if (isInCheck(nx, nx.turn)) txt += '+';
  return txt;
}
