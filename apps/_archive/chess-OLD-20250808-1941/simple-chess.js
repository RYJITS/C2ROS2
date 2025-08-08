class SimpleChess {
  constructor() {
    this.reset();
  }

  reset() {
    this.board = [
      ['r','n','b','q','k','b','n','r'],
      ['p','p','p','p','p','p','p','p'],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      ['P','P','P','P','P','P','P','P'],
      ['R','N','B','Q','K','B','N','R']
    ];
    this.turnColor = 'w';
  }

  game_over() {
    return false;
  }

  turn() {
    return this.turnColor;
  }

  in_checkmate() {
    return false;
  }

  in_draw() {
    return false;
  }

  fen() {
    const rows = this.board.map(row => {
      let line = '';
      let empty = 0;
      for (const cell of row) {
        if (cell) {
          if (empty) { line += empty; empty = 0; }
          line += cell;
        } else {
          empty++;
        }
      }
      if (empty) line += empty;
      return line;
    });
    return rows.join('/') + ' ' + this.turnColor + ' - - 0 1';
  }

  move(move) {
    if (typeof move === 'string') {
      move = {from: move.slice(0,2), to: move.slice(2,4), promotion: 'q'};
    }
    const piece = this.get(move.from);
    if (!piece) return null;
    if ((this.turnColor === 'w' && piece !== piece.toUpperCase()) ||
        (this.turnColor === 'b' && piece !== piece.toLowerCase())) return null;
    const moves = this.validMoves(move.from);
    if (!moves.includes(move.to)) return null;
    this.set(move.to, move.promotion && (piece === 'P' && move.to[1]==='8') ? move.promotion.toUpperCase() : piece);
    this.set(move.from, null);
    this.turnColor = this.turnColor === 'w' ? 'b' : 'w';
    return move;
  }

  moves() {
    const list = [];
    for (let r=0;r<8;r++) {
      for (let c=0;c<8;c++) {
        const coord = this.toCoord(r,c);
        const piece = this.get(coord);
        if (!piece) continue;
        if ((this.turnColor==='w' && piece===piece.toUpperCase()) ||
            (this.turnColor==='b' && piece===piece.toLowerCase())) {
          for (const dest of this.validMoves(coord)) {
            list.push(coord+dest);
          }
        }
      }
    }
    return list;
  }

  validMoves(square) {
    const piece = this.get(square);
    if (!piece) return [];
    const dirs = [];
    const moves = [];
    const color = piece === piece.toUpperCase() ? 'w' : 'b';
    const rowcol = this.toIndex(square);
    const r = rowcol.row, c = rowcol.col;

    const addMove = (rr,cc) => {
      if (rr<0||rr>7||cc<0||cc>7) return;
      const target = this.board[rr][cc];
      if (!target || (color==='w' && target===target.toLowerCase()) || (color==='b' && target===target.toUpperCase())) {
        moves.push(this.toCoord(rr,cc));
        return !target;
      }
      return false;
    };

    switch(piece.toLowerCase()) {
      case 'p':
        const dir = color==='w'? -1: 1;
        if (!this.board[r+dir][c]) {
          addMove(r+dir,c);
          if ((color==='w' && r===6) || (color==='b' && r===1)) {
            if (!this.board[r+2*dir][c]) addMove(r+2*dir,c);
          }
        }
        addMove(r+dir,c-1);
        addMove(r+dir,c+1);
        break;
      case 'n':
        [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]].forEach(d=>addMove(r+d[0],c+d[1]));
        break;
      case 'b':
        dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
        break;
      case 'r':
        dirs.push([-1,0],[1,0],[0,-1],[0,1]);
        break;
      case 'q':
        dirs.push([-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]);
        break;
      case 'k':
        [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]].forEach(d=>addMove(r+d[0],c+d[1]));
        break;
    }

    if (dirs.length) {
      for (const d of dirs) {
        let rr = r + d[0];
        let cc = c + d[1];
        while(addMove(rr,cc)) {
          rr += d[0];
          cc += d[1];
        }
      }
    }
    return moves;
  }

  get(square) {
    const {row, col} = this.toIndex(square);
    return this.board[row][col];
  }

  set(square, value) {
    const {row, col} = this.toIndex(square);
    this.board[row][col] = value;
  }

  toIndex(coord) {
    const file = coord.charCodeAt(0) - 97;
    const rank = 8 - parseInt(coord[1], 10);
    return {row: rank, col: file};
  }

  toCoord(row,col) {
    return String.fromCharCode(97+col) + (8-row);
  }
}

if (typeof module !== 'undefined') module.exports = SimpleChess;
