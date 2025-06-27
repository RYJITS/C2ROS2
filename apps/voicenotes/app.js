const noteVocale = {
  recorder: null,
  audioCtx: null,
  analyser: null,
  dataArray: null,
  canvas: null,
  canvasCtx: null,
  mediaStream: null,
  textArea: null,
};

async function initNoteVocale() {
  noteVocale.canvas = document.getElementById('visualiseur');
  noteVocale.canvasCtx = noteVocale.canvas.getContext('2d');
  noteVocale.textArea = document.getElementById('texte-transcrit');
  const btn = document.getElementById('btn-micro');
  btn.addEventListener('click', toggleRecord);
  document.getElementById('copier-texte').addEventListener('click', copierTexte);
  document.querySelectorAll('.actions button[data-action]').forEach(b => {
    b.addEventListener('click', () => envoyerAction(b.dataset.action));
  });
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key.toLowerCase() === 'r') toggleRecord();
  });
}

async function toggleRecord() {
  if (noteVocale.recorder && noteVocale.recorder.state === 'recording') {
    arreterEnregistrement();
  } else {
    demarrerEnregistrement();
  }
}

async function demarrerEnregistrement() {
  if (!navigator.mediaDevices?.getUserMedia) {
    alert('Microphone indisponible');
    return;
  }
  try {
    noteVocale.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    noteVocale.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = noteVocale.audioCtx.createMediaStreamSource(noteVocale.mediaStream);
    noteVocale.analyser = noteVocale.audioCtx.createAnalyser();
    source.connect(noteVocale.analyser);
    noteVocale.dataArray = new Uint8Array(noteVocale.analyser.frequencyBinCount);
    dessinerVisualiseur();

    noteVocale.recorder = new MediaRecorder(noteVocale.mediaStream);
    noteVocale.recorder.ondataavailable = async e => {
      if (e.data.size > 0) {
        const texte = await envoyerAudio(e.data);
        if (texte) noteVocale.textArea.value += texte + ' ';
      }
    };
    noteVocale.recorder.start(4000);
    document.getElementById('btn-micro').classList.add('enregistrement');
  } catch (err) {
    console.error('Enregistrement impossible', err);
    alert('Accès au microphone refusé');
  }
}

function arreterEnregistrement() {
  noteVocale.recorder?.stop();
  noteVocale.mediaStream?.getTracks().forEach(t => t.stop());
  noteVocale.audioCtx?.close();
  document.getElementById('btn-micro').classList.remove('enregistrement');
}

function dessinerVisualiseur() {
  if (!noteVocale.analyser) return;
  requestAnimationFrame(dessinerVisualiseur);
  noteVocale.analyser.getByteFrequencyData(noteVocale.dataArray);
  const width = noteVocale.canvas.width;
  const height = noteVocale.canvas.height;
  noteVocale.canvasCtx.clearRect(0, 0, width, height);
  const barWidth = width / noteVocale.dataArray.length;
  for (let i = 0; i < noteVocale.dataArray.length; i++) {
    const value = noteVocale.dataArray[i];
    const barHeight = value / 255 * height;
    noteVocale.canvasCtx.fillStyle = '#ff1f1f';
    noteVocale.canvasCtx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
  }
}

async function envoyerAudio(blob) {
  const fd = new FormData();
  fd.append('file', blob, 'audio.webm');
  try {
    const r = await fetch('/api/whisper', { method: 'POST', body: fd });
    const data = await r.json();
    return data.text;
  } catch (err) {
    console.error('Erreur Whisper', err);
    return '';
  }
}

async function envoyerAction(action) {
  const texte = noteVocale.textArea.value;
  try {
    const r = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, texte }),
    });
    const data = await r.json();
    if (data.result) noteVocale.textArea.value = data.result;
  } catch (err) {
    console.error('Erreur ChatGPT', err);
  }
}

function copierTexte() {
  navigator.clipboard.writeText(noteVocale.textArea.value);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNoteVocale);
} else {
  initNoteVocale();
}
