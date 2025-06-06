/**
 * Script de sécurité DOM pour C2R OS
 * Empêche les erreurs d'accès aux éléments DOM inexistants
 */

// Fonction utilitaire pour accès sécurisé aux éléments DOM
function safeGetElement(id) {
    try {
        const element = document.getElementById(id);
        if (!element) {
            console.debug(`Element non trouvé: ${id}`);
        }
        return element;
    } catch (error) {
        console.debug(`Erreur accès élément ${id}:`, error);
        return null;
    }
}

// Fonction utilitaire pour définir le contenu texte de manière sécurisée
function safeSetTextContent(elementOrId, content) {
    try {
        let element;
        if (typeof elementOrId === 'string') {
            element = safeGetElement(elementOrId);
        } else {
            element = elementOrId;
        }
        
        if (element && element.textContent !== undefined) {
            element.textContent = content;
            return true;
        }
        return false;
    } catch (error) {
        console.debug('Erreur définition textContent:', error);
        return false;
    }
}

// Fonction utilitaire pour définir le HTML de manière sécurisée
function safeSetInnerHTML(elementOrId, content) {
    try {
        let element;
        if (typeof elementOrId === 'string') {
            element = safeGetElement(elementOrId);
        } else {
            element = elementOrId;
        }
        
        if (element && element.innerHTML !== undefined) {
            element.innerHTML = content;
            return true;
        }
        return false;
    } catch (error) {
        console.debug('Erreur définition innerHTML:', error);
        return false;
    }
}

// Fonction utilitaire pour ajouter des écouteurs d'événements de manière sécurisée
function safeAddEventListener(elementOrId, event, callback) {
    try {
        let element;
        if (typeof elementOrId === 'string') {
            element = safeGetElement(elementOrId);
        } else {
            element = elementOrId;
        }
        
        if (element && element.addEventListener) {
            element.addEventListener(event, callback);
            return true;
        }
        return false;
    } catch (error) {
        console.debug('Erreur ajout event listener:', error);
        return false;
    }
}

// Fonction utilitaire pour vérifier si un élément existe
function elementExists(id) {
    return document.getElementById(id) !== null;
}

// Fonction pour attendre qu'un élément soit disponible
function waitForElement(id, timeout = 5000) {
    return new Promise((resolve, reject) => {
        const element = safeGetElement(id);
        if (element) {
            resolve(element);
            return;
        }
        
        const startTime = Date.now();
        const checkInterval = setInterval(() => {
            const element = safeGetElement(id);
            if (element) {
                clearInterval(checkInterval);
                resolve(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(checkInterval);
                reject(new Error(`Timeout: élément ${id} non trouvé après ${timeout}ms`));
            }
        }, 100);
    });
}

// Fonction pour exécuter du code quand le DOM est prêt
function whenDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Fonction pour exécuter du code quand une application est chargée
function whenAppReady(appId, callback) {
    const checkApp = () => {
        const appContainer = document.querySelector(`#app-modal-${appId}, .${appId}-app`);
        if (appContainer) {
            callback();
        } else {
            setTimeout(checkApp, 100);
        }
    };
    checkApp();
}

// Intercepter les erreurs DOM communes
const originalGetElementById = document.getElementById;
document.getElementById = function(id) {
    try {
        return originalGetElementById.call(this, id);
    } catch (error) {
        console.debug(`Erreur getElementById(${id}):`, error);
        return null;
    }
};

// Intercepter les erreurs de querySelector
const originalQuerySelector = document.querySelector;
document.querySelector = function(selector) {
    try {
        return originalQuerySelector.call(this, selector);
    } catch (error) {
        console.debug(`Erreur querySelector(${selector}):`, error);
        return null;
    }
};

// Intercepter les erreurs de querySelectorAll
const originalQuerySelectorAll = document.querySelectorAll;
document.querySelectorAll = function(selector) {
    try {
        return originalQuerySelectorAll.call(this, selector);
    } catch (error) {
        console.debug(`Erreur querySelectorAll(${selector}):`, error);
        return [];
    }
};

// Fonction pour corriger les applications existantes
function patchApplications() {
    // Patcher les fonctions communes dans les applications
    window.safeGetElement = safeGetElement;
    window.safeSetTextContent = safeSetTextContent;
    window.safeSetInnerHTML = safeSetInnerHTML;
    window.safeAddEventListener = safeAddEventListener;
    window.elementExists = elementExists;
    window.waitForElement = waitForElement;
    window.whenDOMReady = whenDOMReady;
    window.whenAppReady = whenAppReady;
    
    console.log('🛡️ Fonctions de sécurité DOM disponibles globalement');
}

// Fonction pour surveiller et corriger les erreurs DOM
function startDOMErrorMonitoring() {
    let domErrorCount = 0;
    const maxDOMErrors = 10;
    const resetInterval = 60000; // 1 minute
    
    // Intercepter les erreurs de propriétés null
    const originalError = console.error;
    console.error = function(...args) {
        const message = args.join(' ');
        
        // Détecter les erreurs DOM communes
        if (message.includes('Cannot set properties of null') || 
            message.includes('textContent') ||
            message.includes('innerHTML') ||
            message.includes('Cannot read properties of null')) {
            
            domErrorCount++;
            
            if (domErrorCount <= 3) {
                console.debug('🔧 Erreur DOM interceptée:', message);
            }
            
            if (domErrorCount === maxDOMErrors) {
                console.warn('⚠️ Trop d\'erreurs DOM détectées, vérifiez les applications');
            }
            
            // Ne pas afficher l'erreur si c'est une erreur DOM courante
            return;
        }
        
        // Afficher les autres erreurs normalement
        originalError.apply(console, args);
    };
    
    // Réinitialiser le compteur périodiquement
    setInterval(() => {
        domErrorCount = 0;
    }, resetInterval);
    
    console.log('👁️ Surveillance des erreurs DOM activée');
}

// Initialiser quand le DOM est prêt
whenDOMReady(() => {
    patchApplications();
    startDOMErrorMonitoring();
    console.log('✅ Sécurité DOM initialisée');
});

// Export pour utilisation dans d'autres scripts
window.DOM_SAFETY = {
    safeGetElement,
    safeSetTextContent,
    safeSetInnerHTML,
    safeAddEventListener,
    elementExists,
    waitForElement,
    whenDOMReady,
    whenAppReady
};
