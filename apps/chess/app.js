let game = null;
let aiEndpoint = '';
let dragSource = null;
const unicodePieces = {
  'P': '\u2659',
  'R': '\u2656',
  'N': '\u2658',
  'B': '\u2657',
  'Q': '\u2655',
  'K': '\u2654',
  'p': '\u265F',
  'r': '\u265C',
  'n': '\u265E',
  'b': '\u265D',
  'q': '\u265B',
  'k': '\u265A'
};

function onDragStart (source, piece) {
  if (game.game_over()) return false;
  if (game.turn() === 'w' && piece.startsWith('b')) return false;
  if (game.turn() === 'b' && piece.startsWith('w')) return false;
}

function onDrop (source, target) {
  const move = game.move({from: source, to: target, promotion: 'q'});
  if (move === null) return 'snapback';
}

function onSnapEnd () {
  renderBoard();
  updateStatus();
  setTimeout(makeAiMove, 300);
}

function makeAiMove () {
  if (game.turn() !== 'b') return;
  const moves = game.moves();
  if (moves.length === 0) return;
  const move = moves[Math.floor(Math.random() * moves.length)];
  game.move(move);
  renderBoard();
  updateStatus();
}

function updateStatus () {
  const statusEl = document.getElementById('chess-status');
  let status = '';
  if (game.in_checkmate()) status = 'Échec et mat';
  else if (game.in_draw()) status = 'Match nul';
  else status = game.turn() === 'w' ? 'À vous de jouer' : 'Coup des noirs';
  if (statusEl) statusEl.textContent = status;
}

function createBoard () {
  const boardEl = document.getElementById('board');
  boardEl.innerHTML = '';
  boardEl.style.display = 'grid';
  boardEl.style.gridTemplateColumns = 'repeat(8, 1fr)';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const coord = game.toCoord(r, c);
      const square = document.createElement('div');
      square.className = 'square ' + ((r + c) % 2 ? 'dark' : 'light');
      square.dataset.coord = coord;
      square.addEventListener('dragover', e => e.preventDefault());
      square.addEventListener('drop', e => {
        e.preventDefault();
        const target = square.dataset.coord;
        const res = onDrop(dragSource, target);
        if (res === 'snapback') renderBoard();
        else { renderBoard(); onSnapEnd(); }
      });
      boardEl.appendChild(square);
    }
  }
}

function renderBoard () {
  const boardEl = document.getElementById('board');
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const coord = game.toCoord(r, c);
      const square = boardEl.querySelector(`[data-coord="${coord}"]`);
      const piece = game.get(coord);
      square.textContent = piece ? unicodePieces[piece] : '';
      if (piece) {
        square.firstChild?.remove();
        const span = document.createElement('span');
        span.textContent = unicodePieces[piece];
        span.className = 'piece';
        span.draggable = true;
        span.dataset.piece = (piece === piece.toUpperCase() ? 'w' : 'b') + piece.toLowerCase();
        span.addEventListener('dragstart', e => {
          const source = square.dataset.coord;
          if (onDragStart(source, span.dataset.piece) === false) {
            e.preventDefault();
            return;
          }
          dragSource = source;
        });
        square.appendChild(span);
      } else {
        square.innerHTML = '';
      }
    }
  }
}

function initGame () {
  game = new SimpleChess();
  createBoard();
  renderBoard();
  updateStatus();
}

function loadDependencies () {
  return Promise.resolve();
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await loadDependencies();
    initGame();
  } catch (error) {
    console.error('Erreur chargement dépendances échiquier:', error);
    const statusEl = document.getElementById('chess-status');
    if (statusEl) statusEl.textContent = 'Erreur de chargement';
  }
});

function saveAiEndpoint () {
  const input = document.getElementById('ai-endpoint');
  if (input) aiEndpoint = input.value;
}

function updateAiEngine () {
  // Fonction prête pour intégrer d'autres moteurs IA
}
