let game = null;
let aiEndpoint = '';
let dragSource = null;
let moveHistory = [];
let timerWhite = 300;
let timerBlack = 300;
let timerInterval = null;
let currentColor = 'w';
let selectedSquare = null;
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
  clearHighlights();
}

function onDrop (source, target) {
  const move = game.move({from: source, to: target, promotion: 'q'});
  if (move === null) return 'snapback';
  moveHistory.push(source + target);
  updateMoveHistory();
  switchTurn();
  selectedSquare = null;
  clearHighlights();
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
  moveHistory.push(move);
  updateMoveHistory();
  switchTurn();
  renderBoard();
  updateStatus();
}

function updateStatus () {
  const statusEl = document.getElementById('chess-status');
  let status = '';
  if (game.in_checkmate()) {
    status = 'Échec et mat';
    clearInterval(timerInterval);
  }
  else if (game.in_draw()) {
    status = 'Match nul';
    clearInterval(timerInterval);
  }
  else status = game.turn() === 'w' ? 'À vous de jouer' : 'Coup des noirs';
  if (statusEl) statusEl.textContent = status;
}

function clearHighlights () {
  document.querySelectorAll('.square').forEach(sq => {
    sq.classList.remove('selected');
    sq.classList.remove('highlight');
  });
}

function highlightMoves (coord) {
  const moves = game.validMoves(coord);
  moves.forEach(dest => {
    const sq = document.querySelector(`[data-coord="${dest}"]`);
    if (sq) sq.classList.add('highlight');
  });
}

function selectSquare (coord) {
  const piece = game.get(coord);
  if (!piece) return;
  if ((game.turn() === 'w' && piece === piece.toLowerCase()) ||
      (game.turn() === 'b' && piece === piece.toUpperCase())) return;
  selectedSquare = coord;
  clearHighlights();
  const sq = document.querySelector(`[data-coord="${coord}"]`);
  if (sq) sq.classList.add('selected');
  highlightMoves(coord);
}

function onSquareClick (coord) {
  if (selectedSquare) {
    if (selectedSquare === coord) {
      selectedSquare = null;
      clearHighlights();
      return;
    }
    const move = game.move({from: selectedSquare, to: coord, promotion: 'q'});
    if (move) {
      moveHistory.push(selectedSquare + coord);
      updateMoveHistory();
      switchTurn();
      renderBoard();
      updateStatus();
      setTimeout(makeAiMove, 300);
      selectedSquare = null;
      clearHighlights();
    } else {
      selectSquare(coord);
    }
  } else {
    selectSquare(coord);
  }
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
      square.addEventListener('click', () => onSquareClick(coord));
      square.addEventListener('touchend', e => {
        e.preventDefault();
        if (dragSource) {
          const target = square.dataset.coord;
          const res = onDrop(dragSource, target);
          dragSource = null;
          if (res === 'snapback') renderBoard();
          else { renderBoard(); onSnapEnd(); }
        } else {
          onSquareClick(coord);
        }
      });
      boardEl.appendChild(square);
    }
  }
}

function renderBoard () {
  const boardEl = document.getElementById('board');
  clearHighlights();
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
        span.addEventListener('touchstart', () => {
          dragSource = square.dataset.coord;
        });
        square.appendChild(span);
      } else {
        square.innerHTML = '';
      }
    }
  }
  if (selectedSquare) {
    const sq = boardEl.querySelector(`[data-coord="${selectedSquare}"]`);
    if (sq) sq.classList.add('selected');
    highlightMoves(selectedSquare);
  }
}

function formatTime (seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimerDisplay () {
  const whiteEl = document.getElementById('timer-white');
  const blackEl = document.getElementById('timer-black');
  if (whiteEl) whiteEl.textContent = formatTime(timerWhite);
  if (blackEl) blackEl.textContent = formatTime(timerBlack);
}

function startTimer () {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    if (currentColor === 'w') {
      timerWhite--;
      if (timerWhite <= 0) endGameByTime('blancs');
    } else {
      timerBlack--;
      if (timerBlack <= 0) endGameByTime('noirs');
    }
    updateTimerDisplay();
  }, 1000);
}

function endGameByTime (color) {
  clearInterval(timerInterval);
  const statusEl = document.getElementById('chess-status');
  if (statusEl) statusEl.textContent = `Temps écoul\u00e9 : les ${color} gagnent`;
}

function switchTurn () {
  currentColor = currentColor === 'w' ? 'b' : 'w';
}

function updateMoveHistory () {
  const list = document.getElementById('move-history');
  if (!list) return;
  list.innerHTML = '';
  moveHistory.forEach((m, idx) => {
    const li = document.createElement('li');
    li.textContent = `${idx + 1}. ${m}`;
    list.appendChild(li);
  });
}

function initGame () {
  game = new SimpleChess();
  moveHistory = [];
  timerWhite = 300;
  timerBlack = 300;
  currentColor = 'w';
  selectedSquare = null;
  createBoard();
  clearHighlights();
  renderBoard();
  updateStatus();
  updateMoveHistory();
  updateTimerDisplay();
}

function loadDependencies () {
  return new Promise((resolve, reject) => {
    if (window.SimpleChess) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'apps/chess/simple-chess.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Erreur chargement simple-chess.js'));
    document.head.appendChild(script);
  });
}

async function startChess() {
  try {
    await loadDependencies();
    initGame();
    startTimer();
  } catch (error) {
    console.error('Erreur chargement dépendances échiquier:', error);
    const statusEl = document.getElementById('chess-status');
    if (statusEl) statusEl.textContent = 'Erreur de chargement';
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startChess);
} else {
  startChess();
}

function saveAiEndpoint () {
  const input = document.getElementById('ai-endpoint');
  if (input) aiEndpoint = input.value;
}

function updateAiEngine () {
  // Fonction prête pour intégrer d'autres moteurs IA
}
