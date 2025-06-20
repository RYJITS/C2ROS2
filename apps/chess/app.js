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

document.addEventListener('DOMContentLoaded', initGame);

function saveAiEndpoint () {
  const input = document.getElementById('ai-endpoint');
  if (input) aiEndpoint = input.value;
}

function updateAiEngine () {
  // Fonction prête pour intégrer d'autres moteurs IA
}
