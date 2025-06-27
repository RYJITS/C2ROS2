const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const multer = require('multer');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', () => {
  console.log('Client connecte');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/whisper', upload.single('file'), async (req, res) => {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: req.file.buffer,
      model: 'whisper-1',
    });
    res.json({ text: transcription.text });
  } catch (err) {
    console.error('Erreur Whisper', err);
    res.status(500).json({ error: 'whisper' });
  }
});

app.post('/api/chat', async (req, res) => {
  const { action, texte } = req.body;
  const prompts = {
    resume: 'Résume le texte suivant en français :',
    email: 'Rédige un email à partir du texte suivant :',
    rapport: 'Rédige un rapport détaillé à partir du texte suivant :',
    compterendu: 'Rédige un compte-rendu structuré à partir du texte suivant :',
  };
  const base = prompts[action];
  if (!base) return res.status(400).json({ error: 'action' });
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: `${base}\n\n${texte}` }],
    });
    res.json({ result: completion.choices[0].message.content.trim() });
  } catch (err) {
    console.error('Erreur ChatGPT', err);
    res.status(500).json({ error: 'chatgpt' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Serveur lance sur le port ${PORT}`));
