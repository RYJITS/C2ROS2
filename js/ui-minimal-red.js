/**
 * C2R OS - Interface Utilisateur Minimal Red
 * Corrections pour la navigation avec boutons et support mobile
 */

class UIMinimalRed {
    constructor() {
        this.currentPage = 'home';
        this.mobileAppsMenuOpen = false;
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupMobileAppsMenu();
        this.fixMaterialIcons();
    }
    
    /**
     * Configurer la navigation avec les nouveaux boutons
     */
    setupNavigation() {
        // Navigation sidebar et bottom-nav
        document.addEventListener('click', (e) => {
            const navBtn = e.target.closest('.nav-btn, .bottom-nav button');
            if (navBtn && navBtn.dataset.page) {
                e.preventDefault();
                this.navigateToPage(navBtn.dataset.page);
            }
        });
        
        // Boutons d'ajout d'applications
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-btn, #mobile-add-btn')) {
                e.preventDefault();
                this.navigateToPage('store');
            }
        });
    }
    
    /**
     * Naviguer vers une page
     */
    navigateToPage(page) {
        // Masquer toutes les pages
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active');
        });
        
        // Afficher la page cible
        const targetPage = document.getElementById(`page-${page}`);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = page;
            this.updateNavigation();
        }
    }
    
    /**
     * Mettre à jour la navigation
     */
    updateNavigation() {
        // Retirer active de tous les boutons
        document.querySelectorAll('.nav-btn, .bottom-nav button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Ajouter active aux boutons de la page actuelle
        document.querySelectorAll(`[data-page="${this.currentPage}"]`).forEach(btn => {
            btn.classList.add('active');
        });
    }
    
    /**
     * Configurer le menu mobile des applications
     */
    setupMobileAppsMenu() {
        // Créer le bouton menu apps pour mobile
        this.createMobileAppsButton();
        
        // Créer le menu déroulant
        this.createMobileAppsDropdown();
    }
    
    /**
     * Créer le bouton menu apps mobile
     */
    createMobileAppsButton() {
        const bottomNav = document.querySelector('.bottom-nav');
        if (!bottomNav) return;
        
        // Ajouter le bouton apps après le bouton profil
        const profileBtn = bottomNav.querySelector('[data-page="profile"]');
        if (profileBtn) {
            const appsBtn = document.createElement('button');
            appsBtn.id = 'mobile-apps-btn';
            appsBtn.setAttribute('aria-label', 'Applications');
            appsBtn.innerHTML = '<span class="material-symbols-outlined">apps</span>';
            
            appsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleMobileAppsMenu();
            });
            
            profileBtn.insertAdjacentElement('afterend', appsBtn);
        }
    }
    
    /**
     * Créer le menu déroulant mobile
     */
    createMobileAppsDropdown() {
        const dropdown = document.createElement('div');
        dropdown.id = 'mobile-apps-dropdown';
        dropdown.className = 'mobile-apps-dropdown';
        dropdown.innerHTML = `
            <div class="mobile-apps-header">
                <h3>Applications installées</h3>
                <button class="close-btn" id="close-mobile-apps">&times;</button>
            </div>
            <div class="mobile-apps-list" id="mobile-apps-list">
                <!-- Applications générées dynamiquement -->
            </div>
        `;
        
        document.body.appendChild(dropdown);
        
        // Événement fermeture
        document.getElementById('close-mobile-apps').addEventListener('click', () => {
            this.closeMobileAppsMenu();
        });
        
        // Fermeture en cliquant à l'extérieur
        dropdown.addEventListener('click', (e) => {
            if (e.target === dropdown) {
                this.closeMobileAppsMenu();
            }
        });
    }
    
    /**
     * Basculer le menu mobile des apps
     */
    toggleMobileAppsMenu() {
        if (this.mobileAppsMenuOpen) {
            this.closeMobileAppsMenu();
        } else {
            this.openMobileAppsMenu();
        }
    }
    
    /**
     * Ouvrir le menu mobile des apps
     */
    openMobileAppsMenu() {
        const dropdown = document.getElementById('mobile-apps-dropdown');
        if (dropdown) {
            this.updateMobileAppsList();
            dropdown.classList.add('show');
            this.mobileAppsMenuOpen = true;
        }
    }
    
    /**
     * Fermer le menu mobile des apps
     */
    closeMobileAppsMenu() {
        const dropdown = document.getElementById('mobile-apps-dropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
            this.mobileAppsMenuOpen = false;
        }
    }
    
    /**
     * Mettre à jour la liste des apps mobiles
     */
    updateMobileAppsList() {
        const appCore = window.C2R_SYSTEM?.appCore;
        if (!appCore) return;
        
        const appsList = document.getElementById('mobile-apps-list');
        if (!appsList) return;
        
        const installedApps = appCore.getInstalledApps();
        
        if (installedApps.length === 0) {
            appsList.innerHTML = '<p class="no-apps">Aucune application installée</p>';
            return;
        }
        
        appsList.innerHTML = installedApps.map(app => `
            <div class="mobile-app-item" onclick="window.uiMinimalRed.launchApp('${app.id}')">
                <span class="app-icon">${app.icon}</span>
                <span class="app-name">${app.name}</span>
                <span class="material-symbols-outlined">chevron_right</span>
            </div>
        `).join('');
    }
    
    /**
     * Lancer une application
     */
    launchApp(appId) {
        const appCore = window.C2R_SYSTEM?.appCore;
        if (!appCore) return;
        
        const app = appCore.getApp(appId);
        if (!app) {
            this.showNotification('❌ Application non trouvée', 'error');
            return;
        }
        
        if (!appCore.isInstalled(appId)) {
            this.showNotification('❌ Application non installée', 'error');
            return;
        }
        
        this.showNotification(`🚀 Lancement de ${app.name}...`, 'info');
        this.closeMobileAppsMenu();
        
        // Utiliser la méthode existante du UICore si disponible
        const uiCore = window.C2R_SYSTEM?.uiCore;
        if (uiCore && uiCore.launchApp) {
            uiCore.launchApp(appId);
        }
    }
    
    /**
     * Corriger l'affichage des icônes Material
     */
    fixMaterialIcons() {
        // Vérifier que les icônes Material sont chargées
        const checkIcons = () => {
            const testIcon = document.createElement('span');
            testIcon.className = 'material-symbols-outlined';
            testIcon.textContent = 'home';
            testIcon.style.position = 'absolute';
            testIcon.style.visibility = 'hidden';
            document.body.appendChild(testIcon);
            
            const computed = window.getComputedStyle(testIcon);
            const fontFamily = computed.fontFamily;
            
            document.body.removeChild(testIcon);
            
            if (!fontFamily.includes('Material Symbols')) {
                console.warn('⚠️ Material Symbols non chargées, rechargement...');
                this.reloadMaterialIcons();
            }
        };
        
        // Vérifier après un délai
        setTimeout(checkIcons, 1000);
    }
    
    /**
     * Recharger les icônes Material
     */
    reloadMaterialIcons() {
        const existingLink = document.querySelector('link[href*="Material+Symbols"]');
        if (existingLink) {
            existingLink.remove();
        }
        
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap';
        document.head.appendChild(link);
    }
    
    /**
     * Mettre à jour les applications dans la sidebar
     */
    updateSidebarApps() {
        const appCore = window.C2R_SYSTEM?.appCore;
        if (!appCore) return;
        
        const sidebarApps = document.getElementById('sidebar-apps');
        if (!sidebarApps) return;
        
        const installedApps = appCore.getInstalledApps();
        
        if (installedApps.length === 0) {
            sidebarApps.innerHTML = '<p class="no-apps">Aucune application installée</p>';
            return;
        }
        
        sidebarApps.innerHTML = installedApps.map(app => `
            <div class="sidebar-app-item" onclick="window.uiMinimalRed.launchApp('${app.id}')" title="Lancer ${app.name}">
                <span class="app-icon">${app.icon}</span>
                <span class="app-name">${app.name}</span>
            </div>
        `).join('');
    }
    
    /**
     * Afficher une notification simple
     */
    showNotification(message, type = 'info') {
        // Utiliser le système de notifications existant si disponible
        const uiCore = window.C2R_SYSTEM?.uiCore;
        if (uiCore && uiCore.showNotification) {
            uiCore.showNotification(message, type);
        } else {
            // Fallback simple
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    }
}

// Initialiser après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    window.uiMinimalRed = new UIMinimalRed();
});

// Export global
window.UIMinimalRed = UIMinimalRed;
