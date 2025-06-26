/**
 * Application Recherche d'Emploi
 * Version 1.0.0
 */

const jobApp = {
    chatLog: null,
    messageInput: null,
    results: null
};

function initJobSearchApp() {
    jobApp.chatLog = document.getElementById('chat-log');
    jobApp.messageInput = document.getElementById('chat-message');
    jobApp.results = document.getElementById('results');

    document.getElementById('send-message').addEventListener('click', sendMessage);
    document.getElementById('search-jobs').addEventListener('click', searchJobs);
    document.getElementById('generate-cv').addEventListener('click', generateCV);
    document.getElementById('generate-letter').addEventListener('click', generateLetter);
    document.getElementById('prepare-mail').addEventListener('click', prepareMail);
}

async function sendMessage() {
    const text = jobApp.messageInput.value.trim();
    if (!text) return;
    appendChat('Vous', text);
    jobApp.messageInput.value = '';

    try {
        const reply = await queryOpenAI(text);
        appendChat('Assistant', reply);
    } catch (e) {
        appendChat('Assistant', "Erreur lors de la requête API");
        console.error(e);
    }
}

function appendChat(sender, text) {
    const entry = document.createElement('div');
    entry.className = 'chat-entry';
    entry.innerHTML = `<strong>${sender} :</strong> ${text}`;
    jobApp.chatLog.appendChild(entry);
    jobApp.chatLog.scrollTop = jobApp.chatLog.scrollHeight;
}

async function queryOpenAI(prompt) {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.OPENAI_API_KEY || ''}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }]
        })
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
}

async function searchJobs() {
    const query = document.getElementById('search-query').value.trim();
    if (!query) return;
    appendChat('Système', `Recherche d'offres pour "${query}"...`);
    // Placeholder: la recherche réelle nécessiterait une clé API
    jobApp.results.innerHTML = '<p>Résultats de recherche simulés pour "' + query + '"</p>';
}

async function generateCV() {
    appendChat('Système', 'Génération du CV en cours...');
    // Appel simplifié à l'API d'OpenAI
    const cv = await queryOpenAI('Crée un CV basé sur la discussion précédente.');
    jobApp.results.innerHTML = `<h3>CV généré</h3><pre>${cv}</pre>`;
}

async function generateLetter() {
    appendChat('Système', 'Rédaction de la lettre de motivation...');
    const letter = await queryOpenAI('Rédige une lettre de motivation adaptée.');
    jobApp.results.innerHTML = `<h3>Lettre générée</h3><pre>${letter}</pre>`;
}

function prepareMail() {
    appendChat('Système', "Préparation de l'e-mail avec les documents PDF...");
    const mailto = 'mailto:?subject=Postulation&body=Veuillez trouver ci-joint mon CV et ma lettre.';
    window.location.href = mailto;
}

// Initialisation lors du chargement
initJobSearchApp();
