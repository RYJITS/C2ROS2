// Calculatrice simple pour C2R OS
let calcDisplay = null;
let calcHistory = null;
let currentInput = '0';
let operator = null;
let previousInput = null;
let waitingForOperand = false;
let history = [];

// Initialisation de la calculatrice
function initCalculator() {
    calcDisplay = document.getElementById('calc-display');
    calcHistory = document.getElementById('calc-history');
    
    if (calcDisplay) {
        calcDisplay.value = currentInput;
    }
    
    updateHistoryDisplay();
}

// Ajouter un chiffre
function calcNumber(num) {
    if (waitingForOperand) {
        currentInput = num;
        waitingForOperand = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    
    updateDisplay();
}

// Ajouter un point décimal
function calcDecimal() {
    if (waitingForOperand) {
        currentInput = '0.';
        waitingForOperand = false;
    } else if (currentInput.indexOf('.') === -1) {
        currentInput += '.';
    }
    
    updateDisplay();
}

// Effacer tout
function calcClear() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForOperand = false;
    updateDisplay();
}

// Effacer l'entrée actuelle
function calcClearEntry() {
    currentInput = '0';
    updateDisplay();
}

// Supprimer le dernier caractère
function calcBackspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Opérations mathématiques
function calcOperation(nextOperator) {
    const inputValue = parseFloat(currentInput);
    
    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const currentValue = previousInput || 0;
        const newValue = calculate(currentValue, inputValue, operator);
        
        currentInput = String(newValue);
        previousInput = newValue;
        
        addToHistory(`${currentValue} ${operator} ${inputValue} = ${newValue}`);
    }
    
    waitingForOperand = true;
    operator = nextOperator;
    updateDisplay();
}

// Calculer le résultat
function calcEquals() {
    const inputValue = parseFloat(currentInput);
    
    if (previousInput !== null && operator) {
        const currentValue = previousInput;
        const newValue = calculate(currentValue, inputValue, operator);
        
        currentInput = String(newValue);
        addToHistory(`${currentValue} ${operator} ${inputValue} = ${newValue}`);
        
        previousInput = null;
        operator = null;
        waitingForOperand = true;
        updateDisplay();
    }
}

// Fonctions scientifiques
function calcFunction(func) {
    const inputValue = parseFloat(currentInput);
    let result;
    
    switch (func) {
        case 'sqrt':
            result = Math.sqrt(inputValue);
            addToHistory(`√${inputValue} = ${result}`);
            break;
        case 'square':
            result = inputValue * inputValue;
            addToHistory(`${inputValue}² = ${result}`);
            break;
        case 'sin':
            result = Math.sin(inputValue * Math.PI / 180);
            addToHistory(`sin(${inputValue}°) = ${result}`);
            break;
        case 'cos':
            result = Math.cos(inputValue * Math.PI / 180);
            addToHistory(`cos(${inputValue}°) = ${result}`);
            break;
        default:
            return;
    }
    
    currentInput = String(result);
    waitingForOperand = true;
    updateDisplay();
}

// Effectuer le calcul
function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
        case '+':
            return firstOperand + secondOperand;
        case '-':
            return firstOperand - secondOperand;
        case '*':
            return firstOperand * secondOperand;
        case '/':
            return secondOperand !== 0 ? firstOperand / secondOperand : 0;
        default:
            return secondOperand;
    }
}

// Mettre à jour l'affichage
function updateDisplay() {
    if (calcDisplay) {
        calcDisplay.value = currentInput;
    }
}

// Ajouter à l'historique
function addToHistory(calculation) {
    history.unshift(calculation);
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    updateHistoryDisplay();
}

// Mettre à jour l'affichage de l'historique
function updateHistoryDisplay() {
    if (calcHistory) {
        if (history.length === 0) {
            calcHistory.innerHTML = '<div class="history-item">Aucun calcul</div>';
        } else {
            calcHistory.innerHTML = history.map(item => 
                `<div class="history-item">${item}</div>`
            ).join('');
        }
    }
}

// Effacer l'historique
function calcClearHistory() {
    history = [];
    updateHistoryDisplay();
}

// Fonction de nettoyage pour C2R OS
function calculatorCleanup() {
    calcDisplay = null;
    calcHistory = null;
    currentInput = '0';
    operator = null;
    previousInput = null;
    waitingForOperand = false;
    history = [];
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalculator);
} else {
    initCalculator();
}
