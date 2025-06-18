console.log('Chess app loaded');

const chessboard = document.getElementById('chessboard');

const pieces = {
  'pawn': '♟',
  'rook': '♜',
  'knight': '♞',
  'bishop': '♝',
  'queen': '♛',
  'king': '♚'
};

function generateChessboard() {
  for (let i = 0; i < 8; i++) {
    const row = document.createElement('tr');
    for (let j = 0; j < 8; j++) {
      const cell = document.createElement('td');
      row.appendChild(cell);
    }
    chessboard.appendChild(row);
  }
}

function placePieces() {
  const rows = chessboard.querySelectorAll('tr');

  // Place black pieces
  rows[0].children[0].textContent = pieces['rook'];
  rows[0].children[1].textContent = pieces['knight'];
  rows[0].children[2].textContent = pieces['bishop'];
  rows[0].children[3].textContent = pieces['queen'];
  rows[0].children[4].textContent = pieces['king'];
  rows[0].children[5].textContent = pieces['bishop'];
  rows[0].children[6].textContent = pieces['knight'];
  rows[0].children[7].textContent = pieces['rook'];
  for (let i = 0; i < 8; i++) {
    rows[1].children[i].textContent = pieces['pawn'];
  }

  // Place white pieces
  rows[7].children[0].textContent = pieces['rook'];
  rows[7].children[1].textContent = pieces['knight'];
  rows[7].children[2].textContent = pieces['bishop'];
  rows[7].children[3].textContent = pieces['queen'];
  rows[7].children[4].textContent = pieces['king'];
  rows[7].children[5].textContent = pieces['bishop'];
  rows[7].children[6].textContent = pieces['knight'];
  rows[7].children[7].textContent = pieces['rook'];
  for (let i = 0; i < 8; i++) {
    rows[6].children[i].textContent = pieces['pawn'];
  }
}

generateChessboard();
placePieces();
