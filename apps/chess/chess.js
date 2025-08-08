import { makeStart, parseFEN, toFEN, legalMoves, isCheckmate, isStalemate, san, applyMove, Color } from './engine.js';

export function mountChessPro(root){
  const boardEl = root.querySelector('#chessBoard');
  const movesEl = root.querySelector('#chessMoves');
  const turnEl = root.querySelector('#chessTurn');
  const stateEl = root.querySelector('#chessState');
  const flipBtn = root.querySelector('#chessFlipBtn');
  const newBtn = root.querySelector('#chessNewBtn');
  const settingsBtn = root.querySelector('#chessSettingsBtn');
  const settingsDialog = root.querySelector('#chessSettings');
  const showCoords = root.querySelector('#chessShowCoords');
  const showHints = root.querySelector('#chessShowHints');
  const fenInput = root.querySelector('#chessFEN');
  const loadFenBtn = root.querySelector('#chessLoadFEN');
  const copyFenBtn = root.querySelector('#chessCopyFEN');

  let state = makeStart();
  let selected = null;
  let history = [];
  let flipped = false;

  const SYM = { 'wk':'♔','wq':'♕','wr':'♖','wb':'♗','wn':'♘','wp':'♙', 'bk':'♚','bq':'♛','br':'♜','bb':'♝','bn':'♞','bp':'♟' };
  const id = (r,c)=> `r${r}c${c}`;
  const file = (c)=> 'abcdefgh'[c];

  function render(){
    boardEl.innerHTML = '';
    const legal = legalMoves(state);
    turnEl.textContent = `Trait aux ${state.turn===Color.W?'Blancs':'Noirs'}`;
    if (isCheckmate(state)) stateEl.textContent='Échec et mat';
    else if (isStalemate(state)) stateEl.textContent='Pat';
    else stateEl.textContent='';

    const ranks=[...Array(8).keys()], files=[...Array(8).keys()];
    const rows = flipped ? ranks : [...ranks].reverse();
    const cols = flipped ? [...files].reverse() : files;

    for (const r of rows){
      for (const c of cols){
        const rr=r, cc=c;
        const d=document.createElement('div');
        d.className = `square ${ (rr+cc)%2===0 ? 'light':'dark' }`;
        d.id = id(rr,cc);
        const p = state.board[rr][cc];
        d.textContent = p ? SYM[p.c+p.t] : '';

        if (showCoords.checked){
          const span=document.createElement('span');
          span.className='coords';
          span.textContent = `${file(cc)}${8-rr}`;
          d.appendChild(span);
        }

        d.addEventListener('click', ()=> onTap(rr,cc));
        boardEl.appendChild(d);
      }
    }

    if (selected){
      const sEl = boardEl.querySelector('#'+id(selected.r, selected.c));
      if (sEl) sEl.classList.add('sel');
      if (showHints.checked){
        for (const m of legal.filter(m=> m.from.r===selected.r && m.from.c===selected.c)){
          const el = boardEl.querySelector('#'+id(m.to.r, m.to.c));
          if (!el) continue;
          const capturing = !!state.board[m.to.r][m.to.c] || m.ep;
          el.classList.add('hint'); if (capturing) el.classList.add('capture');
        }
      }
    }

    movesEl.innerHTML='';
    let ply=0;
    for (const mv of history){
      if (ply%2===0){ const li=document.createElement('li'); li.textContent=mv; movesEl.appendChild(li); }
      else { const last=movesEl.lastElementChild; last.textContent = last.textContent + '  ' + mv; }
      ply++;
    }

    fenInput.value = toFEN(state);
  }

  function onTap(r,c){
    const legal = legalMoves(state);
    if (!selected){
      const p=state.board[r][c];
      if (p && p.c===state.turn){ selected={r,c}; render(); }
      return;
    }
    if (selected.r===r && selected.c===c){ selected=null; render(); return; }
    const p=state.board[selected.r][selected.c];
    const same = state.board[r][c] && state.board[r][c].c===p.c;
    if (same){ selected={r,c}; render(); return; }

    const mv = legal.find(m=> m.from.r===selected.r && m.from.c===selected.c && m.to.r===r && m.to.c===c);
    if (mv){
      const sanText = san(state, mv);
      state = applyMove(state, mv);
      history.push(sanText);
    }
    selected=null; render();
  }

  flipBtn.addEventListener('click', ()=>{ flipped=!flipped; render(); });
  newBtn.addEventListener('click', ()=>{ state=makeStart(); history=[]; selected=null; render(); });
  settingsBtn.addEventListener('click', ()=> settingsDialog.showModal());
  showCoords.addEventListener('change', render);
  showHints.addEventListener('change', render);
  loadFenBtn.addEventListener('click', ()=>{ try{ state=parseFEN(fenInput.value); history=[]; selected=null; render(); } catch(e){ alert('FEN invalide'); } });
  copyFenBtn.addEventListener('click', async ()=>{ try{ await navigator.clipboard.writeText(fenInput.value); } catch(e){} });

  render();
}

// Auto-mount si chess.html est chargé tel quel
document.addEventListener('DOMContentLoaded', ()=>{
  const root = document.querySelector('.c2r-chess-pro');
  if (root) mountChessPro(root);
});
