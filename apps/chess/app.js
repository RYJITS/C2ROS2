// Application d'échecs basique avec intégration API IA
let chess = null;
let selectedSquare = null;
let aiEndpoint = '';

function initChess() {
    const saved = localStorage.getItem('c2r_chess_ai');
    if (saved) {
        aiEndpoint = saved;
        document.getElementById('ai-endpoint').value = aiEndpoint;
    }
    chess = new Chess();
    drawBoard();
    updateBoard();
}

function saveAiEndpoint() {
    aiEndpoint = document.getElementById('ai-endpoint').value;
    localStorage.setItem('c2r_chess_ai', aiEndpoint);
}

function drawBoard() {
    const board = document.getElementById('chess-board');
    board.innerHTML = '';
    for (let i = 7; i >= 0; i--) {
        const row = document.createElement('tr');
        for (let j = 0; j < 8; j++) {
            const cell = document.createElement('td');
            const square = String.fromCharCode(97 + j) + (i + 1);
            cell.dataset.square = square;
            const isWhite = (i + j) % 2 === 0;
            cell.className = isWhite ? 'white' : 'black';
            cell.addEventListener('click', () => selectSquare(square));
            row.appendChild(cell);
        }
        board.appendChild(row);
    }
}

function updateBoard() {
    const board = document.getElementById('chess-board');
    for (const cell of board.querySelectorAll('td')) {
        const square = cell.dataset.square;
        const piece = chess.get(square);
        cell.textContent = piece ? pieceToChar(piece) : '';
    }
    document.getElementById('chess-status').textContent = chess.turn() === 'w' ? 'Votre coup' : 'Coup de l\'IA';
}

function pieceToChar(piece) {
    const map = {
        p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚',
        P: '♙', R: '♖', N: '♘', B: '♗', Q: '♕', K: '♔'
    };
    return map[piece.color === 'w' ? piece.type.toUpperCase() : piece.type] || '';
}

function selectSquare(square) {
    if (chess.turn() === 'b') return; // attendre IA
    if (selectedSquare) {
        const move = { from: selectedSquare, to: square };
        const result = chess.move(move);
        if (result) {
            selectedSquare = null;
            updateBoard();
            if (!chess.game_over()) {
                aiMove();
            }
        } else {
            selectedSquare = null;
        }
    } else {
        const piece = chess.get(square);
        if (piece && piece.color === 'w') {
            selectedSquare = square;
        }
    }
}

function aiMove() {
    if (!aiEndpoint) return;
    fetch(aiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: chess.fen() })
    })
        .then(r => r.json())
        .then(data => {
            if (data && data.move) {
                chess.move(data.move);
                updateBoard();
            }
        })
        .catch(err => console.error('Erreur IA', err));
}

// Chargement initial
initChess();
