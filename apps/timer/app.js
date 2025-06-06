// Application Timer/Chronomètre pour C2R OS
let timerState = {
    // Minuteur
    timerInterval: null,
    timerSeconds: 300, // 5 minutes par défaut
    timerOriginalSeconds: 300,
    timerRunning: false,
    
    // Chronomètre
    stopwatchInterval: null,
    stopwatchSeconds: 0,
    stopwatchRunning: false,
    laps: [],
    
    // Interface
    currentTab: 'timer'
};

// Initialisation de l'application
function initTimer() {
    console.log('⏱️ Initialisation de l\'application Timer');
    
    // Ajouter les événements sur les inputs
    const minutesInput = document.getElementById('minutes-input');
    const secondsInput = document.getElementById('seconds-input');
    
    if (minutesInput) {
        minutesInput.addEventListener('input', updateTimerFromInputs);
    }
    
    if (secondsInput) {
        secondsInput.addEventListener('input', updateTimerFromInputs);
    }
    
    // Mettre à jour l'affichage initial
    updateTimerDisplay();
    updateStopwatchDisplay();
    updateStatus('Prêt à démarrer');
}

// Changer d'onglet
function switchTab(tab) {
    timerState.currentTab = tab;
    
    // Mettre à jour les boutons d'onglet
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`${tab}-tab`).classList.add('active');
    
    // Afficher/masquer les sections
    document.getElementById('timer-section').style.display = tab === 'timer' ? 'block' : 'none';
    document.getElementById('stopwatch-section').style.display = tab === 'stopwatch' ? 'block' : 'none';
    
    // Mettre à jour le statut
    if (tab === 'timer') {
        updateStatus(timerState.timerRunning ? 'Minuteur en cours' : 'Prêt à démarrer');
    } else {
        updateStatus(timerState.stopwatchRunning ? 'Chronomètre en cours' : 'Prêt à démarrer');
    }
}

// === MINUTEUR ===

// Mettre à jour le minuteur depuis les inputs
function updateTimerFromInputs() {
    if (timerState.timerRunning) return;
    
    const minutes = parseInt(document.getElementById('minutes-input').value) || 0;
    const seconds = parseInt(document.getElementById('seconds-input').value) || 0;
    
    timerState.timerSeconds = (minutes * 60) + seconds;
    timerState.timerOriginalSeconds = timerState.timerSeconds;
    
    updateTimerDisplay();
}

// Définir un temps prédéfini
function setPreset(minutes, seconds) {
    if (timerState.timerRunning) return;
    
    timerState.timerSeconds = (minutes * 60) + seconds;
    timerState.timerOriginalSeconds = timerState.timerSeconds;
    
    document.getElementById('minutes-input').value = minutes;
    document.getElementById('seconds-input').value = seconds;
    
    updateTimerDisplay();
}

// Démarrer le minuteur
function startTimer() {
    if (timerState.timerSeconds <= 0) {
        updateStatus('Veuillez définir un temps');
        return;
    }
    
    timerState.timerRunning = true;
    
    // Mettre à jour l'interface
    document.getElementById('start-timer').style.display = 'none';
    document.getElementById('pause-timer').style.display = 'inline-block';
    
    updateStatus('Minuteur en cours');
    
    timerState.timerInterval = setInterval(() => {
        timerState.timerSeconds--;
        updateTimerDisplay();
        
        if (timerState.timerSeconds <= 0) {
            timerFinished();
        }
    }, 1000);
}

// Mettre en pause le minuteur
function pauseTimer() {
    timerState.timerRunning = false;
    clearInterval(timerState.timerInterval);
    
    // Mettre à jour l'interface
    document.getElementById('start-timer').style.display = 'inline-block';
    document.getElementById('pause-timer').style.display = 'none';
    
    updateStatus('Minuteur en pause');
}

// Réinitialiser le minuteur
function resetTimer() {
    timerState.timerRunning = false;
    clearInterval(timerState.timerInterval);
    
    timerState.timerSeconds = timerState.timerOriginalSeconds;
    
    // Mettre à jour l'interface
    document.getElementById('start-timer').style.display = 'inline-block';
    document.getElementById('pause-timer').style.display = 'none';
    
    updateTimerDisplay();
    updateStatus('Prêt à démarrer');
}

// Minuteur terminé
function timerFinished() {
    timerState.timerRunning = false;
    clearInterval(timerState.timerInterval);
    
    // Mettre à jour l'interface
    document.getElementById('start-timer').style.display = 'inline-block';
    document.getElementById('pause-timer').style.display = 'none';
    
    updateStatus('⏰ Temps écoulé !');
    
    // Notification sonore simulée
    console.log('🔔 DING! Minuteur terminé!');
    
    // Réinitialiser après 3 secondes
    setTimeout(() => {
        resetTimer();
    }, 3000);
}

// Mettre à jour l'affichage du minuteur
function updateTimerDisplay() {
    const minutes = Math.floor(timerState.timerSeconds / 60);
    const seconds = timerState.timerSeconds % 60;
    
    const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
        timerDisplay.textContent = display;
    }
}

// === CHRONOMÈTRE ===

// Démarrer le chronomètre
function startStopwatch() {
    timerState.stopwatchRunning = true;
    
    // Mettre à jour l'interface
    document.getElementById('start-stopwatch').style.display = 'none';
    document.getElementById('pause-stopwatch').style.display = 'inline-block';
    document.getElementById('lap-btn').style.display = 'inline-block';
    
    updateStatus('Chronomètre en cours');
    
    timerState.stopwatchInterval = setInterval(() => {
        timerState.stopwatchSeconds++;
        updateStopwatchDisplay();
    }, 1000);
}

// Mettre en pause le chronomètre
function pauseStopwatch() {
    timerState.stopwatchRunning = false;
    clearInterval(timerState.stopwatchInterval);
    
    // Mettre à jour l'interface
    document.getElementById('start-stopwatch').style.display = 'inline-block';
    document.getElementById('pause-stopwatch').style.display = 'none';
    document.getElementById('lap-btn').style.display = 'none';
    
    updateStatus('Chronomètre en pause');
}

// Réinitialiser le chronomètre
function resetStopwatch() {
    timerState.stopwatchRunning = false;
    clearInterval(timerState.stopwatchInterval);
    
    timerState.stopwatchSeconds = 0;
    timerState.laps = [];
    
    // Mettre à jour l'interface
    document.getElementById('start-stopwatch').style.display = 'inline-block';
    document.getElementById('pause-stopwatch').style.display = 'none';
    document.getElementById('lap-btn').style.display = 'none';
    
    updateStopwatchDisplay();
    updateLapsDisplay();
    updateStatus('Prêt à démarrer');
}

// Ajouter un tour
function addLap() {
    if (!timerState.stopwatchRunning) return;
    
    const lapTime = timerState.stopwatchSeconds;
    timerState.laps.unshift(lapTime); // Ajouter au début
    
    updateLapsDisplay();
}

// Mettre à jour l'affichage du chronomètre
function updateStopwatchDisplay() {
    const hours = Math.floor(timerState.stopwatchSeconds / 3600);
    const minutes = Math.floor((timerState.stopwatchSeconds % 3600) / 60);
    const seconds = timerState.stopwatchSeconds % 60;
    
    const display = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    if (stopwatchDisplay) {
        stopwatchDisplay.textContent = display;
    }
}

// Mettre à jour l'affichage des tours
function updateLapsDisplay() {
    const lapsList = document.getElementById('laps-list');
    if (!lapsList) return;
    
    if (timerState.laps.length === 0) {
        lapsList.innerHTML = '<div class="no-laps">Aucun tour enregistré</div>';
        return;
    }
    
    let lapsHTML = '';
    timerState.laps.forEach((lapSeconds, index) => {
        const hours = Math.floor(lapSeconds / 3600);
        const minutes = Math.floor((lapSeconds % 3600) / 60);
        const seconds = lapSeconds % 60;
        
        const timeDisplay = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        lapsHTML += `
            <div class="lap-item">
                <span class="lap-number">Tour ${timerState.laps.length - index}</span>
                <span class="lap-time">${timeDisplay}</span>
            </div>
        `;
    });
    
    lapsList.innerHTML = lapsHTML;
}

// Mettre à jour le statut
function updateStatus(message) {
    const statusEl = document.getElementById('timer-status');
    if (!statusEl) return;
    
    statusEl.textContent = message;
    
    // Supprimer toutes les classes de statut
    statusEl.classList.remove('running', 'paused', 'finished');
    
    // Ajouter la classe appropriée
    if (message.includes('en cours')) {
        statusEl.classList.add('running');
    } else if (message.includes('pause')) {
        statusEl.classList.add('paused');
    } else if (message.includes('écoulé')) {
        statusEl.classList.add('finished');
    }
}

// Fonction de nettoyage pour C2R OS
function timerCleanup() {
    console.log('🧹 Nettoyage de l\'application Timer');
    
    // Arrêter tous les intervalles
    if (timerState.timerInterval) {
        clearInterval(timerState.timerInterval);
    }
    
    if (timerState.stopwatchInterval) {
        clearInterval(timerState.stopwatchInterval);
    }
    
    // Réinitialiser l'état
    timerState = {
        timerInterval: null,
        timerSeconds: 300,
        timerOriginalSeconds: 300,
        timerRunning: false,
        stopwatchInterval: null,
        stopwatchSeconds: 0,
        stopwatchRunning: false,
        laps: [],
        currentTab: 'timer'
    };
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTimer);
} else {
    initTimer();
}
