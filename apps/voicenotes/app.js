/**
 * Notes Vocales - Application C2R OS
 * Version: 1.0.0
 * Fonctionnalités: prise de notes texte avec reconnaissance vocale Whisper
 */

let voiceNotes = {
    recorder: null,
    chunks: [],
    textarea: null
};

function initVoiceNotes() {
    voiceNotes.textarea = document.getElementById('voicenotes-area');
    const startBtn = document.getElementById('start-record');
    const stopBtn = document.getElementById('stop-record');
    const saveBtn = document.getElementById('save-notes');

    const saved = localStorage.getItem('c2r_voice_notes');
    if (saved) {
        voiceNotes.textarea.value = saved;
    }

    startBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    saveBtn.addEventListener('click', saveNotes);
}

async function startRecording() {
    const startBtn = document.getElementById('start-record');
    const stopBtn = document.getElementById('stop-record');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    voiceNotes.recorder = new MediaRecorder(stream);
    voiceNotes.chunks = [];

    voiceNotes.recorder.ondataavailable = e => {
        if (e.data.size) voiceNotes.chunks.push(e.data);
    };

    voiceNotes.recorder.onstop = async () => {
        const blob = new Blob(voiceNotes.chunks, { type: 'audio/webm' });
        const text = await transcribeWithWhisper(blob);
        if (text) {
            voiceNotes.textarea.value += text + '\n';
        }
    };

    voiceNotes.recorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
}

function stopRecording() {
    const startBtn = document.getElementById('start-record');
    const stopBtn = document.getElementById('stop-record');
    if (voiceNotes.recorder) {
        voiceNotes.recorder.stop();
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
}

function saveNotes() {
    if (voiceNotes.textarea) {
        localStorage.setItem('c2r_voice_notes', voiceNotes.textarea.value);
    }
}

async function transcribeWithWhisper(blob) {
    const apiKey = window.WHISPER_API_KEY;
    if (!apiKey) {
        console.warn('Clé API Whisper non fournie');
        return '';
    }

    const formData = new FormData();
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    try {
        const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + apiKey
            },
            body: formData
        });
        const data = await response.json();
        return data.text || '';
    } catch (err) {
        console.error('Erreur Whisper:', err);
        return '';
    }
}

document.addEventListener('DOMContentLoaded', initVoiceNotes);
