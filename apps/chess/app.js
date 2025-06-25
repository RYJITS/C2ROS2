let board = null;
let game = null;
let aiEndpoint = '';

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
  board.position(game.fen());
  updateStatus();
  setTimeout(makeAiMove, 300);
}

function makeAiMove () {
  if (game.turn() !== 'b') return;
  const moves = game.moves();
  if (moves.length === 0) return;
  const move = moves[Math.floor(Math.random() * moves.length)];
  game.move(move);
  board.position(game.fen());
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

function initGame () {
  game = new Chess();
  board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
  });
  updateStatus();
}

async function loadScript (src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener('load', resolve);
      if (existing.complete) resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function loadDependencies () {
  const promises = [];
  if (typeof Chess === 'undefined') {
    promises.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/chess.js/1.0.0/chess.min.js'));
  }
  if (typeof Chessboard === 'undefined') {
    promises.push(loadScript('https://cdnjs.cloudflare.com/ajax/libs/chessboard.js/1.0.0/chessboard.min.js'));
  }
  await Promise.all(promises);
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
