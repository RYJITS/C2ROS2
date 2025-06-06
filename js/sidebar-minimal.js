/**
 * C2R OS - Sidebar Minimaliste
 * Gestion de la sidebar avec icônes uniquement et tooltips
 */

class SidebarMinimal {
    constructor() {
        this.isMinimal = false;
        this.init();
    }
    
    init() {
        this.createToggleButton();
        this.addTooltips();
        this.setupEventListeners();
        
        // Activer par défaut la sidebar minimaliste
        this.enableMinimalSidebar();
    }
    
    /**
     * Créer le bouton de basculement
     */
    createToggleButton() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle-minimal';
        toggleBtn.title = 'Basculer sidebar minimaliste';
        toggleBtn.setAttribute('aria-label', 'Basculer sidebar minimaliste');
        const icon = document.createElement('span');
        icon.className = 'nav-icon';
        toggleBtn.appendChild(icon);
        toggleBtn.addEventListener('click', () => {
            this.toggleMinimalSidebar();
        });

        sidebar.appendChild(toggleBtn);
        this.updateToggleButtonIcon();
    }
    
    /**
     * Ajouter les tooltips aux éléments de navigation
     */
    addTooltips() {
        // Tooltips pour la navigation principale
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const text = link.querySelector('.nav-text')?.textContent || 
                        link.getAttribute('aria-label') || 'Navigation';
            this.addTooltip(link, text);
        });
        
        // Tooltip pour le bouton de déconnexion
        const logoutBtn = document.querySelector('.btn-logout');
        if (logoutBtn) {
            this.addTooltip(logoutBtn, 'Déconnexion');
        }
        
        // Observer les changements dans la sidebar pour les nouvelles applications
        this.observeSidebarChanges();
    }
    
    /**
     * Ajouter un tooltip à un élément
     */
    addTooltip(element, text) {
        // Vérifier si le tooltip existe déjà
        if (element.querySelector('.tooltip')) {
            return;
        }
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        element.appendChild(tooltip);
    }
    
    /**
     * Observer les changements dans la sidebar pour les applications
     */
    observeSidebarChanges() {
        const sidebarApps = document.getElementById('sidebar-apps');
        if (!sidebarApps) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && 
                            node.classList.contains('sidebar-app-item')) {
                            const appName = node.querySelector('.app-name')?.textContent || 'Application';
                            this.addTooltip(node, appName);
                        }
                    });
                }
            });
        });
        
        observer.observe(sidebarApps, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * Configurer les événements
     */
    setupEventListeners() {
        // Raccourci clavier pour basculer (Ctrl + B)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'b') {
                e.preventDefault();
                this.toggleMinimalSidebar();
            }
        });
        
        // Sauvegarder la préférence
        window.addEventListener('beforeunload', () => {
            localStorage.setItem('c2ros_minimal_sidebar', this.isMinimal);
        });
        
        // Charger la préférence sauvegardée
        const saved = localStorage.getItem('c2ros_minimal_sidebar');
        if (saved === 'true') {
            this.enableMinimalSidebar();
        } else if (saved === 'false') {
            this.disableMinimalSidebar();
        }
    }
    
    /**
     * Basculer entre sidebar normale et minimaliste
     */
    toggleMinimalSidebar() {
        if (this.isMinimal) {
            this.disableMinimalSidebar();
        } else {
            this.enableMinimalSidebar();
        }
    }
    
    /**
     * Activer la sidebar minimaliste
     */
    enableMinimalSidebar() {
        document.body.classList.add('minimal-sidebar');
        this.isMinimal = true;
        
        // Mettre à jour le bouton de basculement
        const toggleBtn = document.querySelector('.sidebar-toggle-minimal');
        if (toggleBtn) {
            toggleBtn.title = 'Sidebar normale';
        }
        this.updateToggleButtonIcon();
        
        // Animation de transition
        this.addTransitionClass();
        
        console.log('✨ Sidebar minimaliste activée');
    }
    
    /**
     * Désactiver la sidebar minimaliste
     */
    disableMinimalSidebar() {
        document.body.classList.remove('minimal-sidebar');
        this.isMinimal = false;
        
        // Mettre à jour le bouton de basculement
        const toggleBtn = document.querySelector('.sidebar-toggle-minimal');
        if (toggleBtn) {
            toggleBtn.title = 'Sidebar minimaliste';
        }
        this.updateToggleButtonIcon();
        
        // Animation de transition
        this.addTransitionClass();
        
        console.log('📋 Sidebar normale activée');
    }
    
    /**
     * Ajouter la classe de transition temporairement
     */
    addTransitionClass() {
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar) {
            sidebar.classList.add('sidebar-transition');
            setTimeout(() => {
                sidebar.classList.remove('sidebar-transition');
            }, 300);
        }
        
        if (mainContent) {
            mainContent.classList.add('sidebar-transition');
            setTimeout(() => {
                mainContent.classList.remove('sidebar-transition');
            }, 300);
        }
    }

    /**
     * Mettre à jour l'icône du bouton de basculement
     */
    updateToggleButtonIcon() {
        const icon = document.querySelector('.sidebar-toggle-minimal .nav-icon');
        if (!icon) return;

        if (this.isMinimal) {
            icon.dataset.icon = 'square';
        } else {
            icon.dataset.icon = 'close';
        }

        window.IconManager?.inject(icon);
    }
    
    /**
     * Mettre à jour les tooltips des applications
     */
    updateAppTooltips() {
        const appItems = document.querySelectorAll('.sidebar-app-item');
        appItems.forEach(item => {
            const appName = item.querySelector('.app-name')?.textContent;
            if (appName && !item.querySelector('.tooltip')) {
                this.addTooltip(item, appName);
            }
        });
    }
    
    /**
     * API publique pour les autres modules
     */
    getState() {
        return {
            isMinimal: this.isMinimal,
            sidebarWidth: this.isMinimal ? '70px' : '280px'
        };
    }
}

// Initialiser après le chargement du DOM
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarMinimal = new SidebarMinimal();
});

// Export global
window.SidebarMinimal = SidebarMinimal;
