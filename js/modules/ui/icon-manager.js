// IconManager centralises icon rendering
(function(global) {
    const ICONS = {
        home: '<i class="icon fa-solid fa-house"></i>',
        store: '<i class="icon fa-solid fa-store"></i>',
        profile: '<i class="icon fa-solid fa-user"></i>',
        admin: '<i class="icon fa-solid fa-gear"></i>',
        install: '<i class="icon fa-solid fa-plus"></i>',
        uninstall: '<i class="icon fa-solid fa-trash"></i>',
        check: '<i class="icon fa-solid fa-check"></i>',
        list: '<i class="icon fa-solid fa-list"></i>',
        signout: '<i class="icon fa-solid fa-right-from-bracket"></i>',
        search: '<i class="icon fa-solid fa-magnifying-glass"></i>',
        idea: '<i class="icon fa-solid fa-lightbulb"></i>',
        refresh: '<i class="icon fa-solid fa-arrows-rotate"></i>',
        note: '<i class="icon fa-solid fa-note-sticky"></i>',
        checkbox: '<i class="icon fa-solid fa-square-check"></i>',
        robot: '<i class="icon fa-solid fa-robot"></i>',
        file: '<i class="icon fa-solid fa-file-lines"></i>',
        globe: '<i class="icon fa-solid fa-globe"></i>',
        calculator: '<i class="icon fa-solid fa-calculator"></i>',
        weather: '<i class="icon fa-solid fa-cloud-sun"></i>',
        timer: '<i class="icon fa-solid fa-stopwatch"></i>',
        edit: '<i class="icon fa-solid fa-pencil"></i>',
        'file-new': '<i class="icon fa-solid fa-file-circle-plus"></i>',
        save: '<i class="icon fa-solid fa-floppy-disk"></i>',
        open: '<i class="icon fa-solid fa-folder-open"></i>',
        stats: '<i class="icon fa-solid fa-chart-bar"></i>',
        preview: '<i class="icon fa-solid fa-eye"></i>',
        format: '<i class="icon fa-solid fa-wand-magic-sparkles"></i>',
        broom: '<i class="icon fa-solid fa-broom"></i>',
        clipboard: '<i class="icon fa-solid fa-clipboard"></i>',
        add: '<i class="icon fa-solid fa-plus"></i>',
        mail: '<i class="icon fa-solid fa-envelope"></i>',
        phone: '<i class="icon fa-solid fa-phone"></i>',
        cart: '<i class="icon fa-solid fa-cart-shopping"></i>',
        play: '<i class="icon fa-solid fa-play"></i>',
        pause: '<i class="icon fa-solid fa-pause"></i>',
        checkcircle: '<i class="icon fa-solid fa-circle-check"></i>',
        sun: '<i class="icon fa-solid fa-sun"></i>',
        cloud: '<i class="icon fa-solid fa-cloud"></i>',
        rain: '<i class="icon fa-solid fa-cloud-rain"></i>',
        lightning: '<i class="icon fa-solid fa-bolt"></i>',
        droplet: '<i class="icon fa-solid fa-droplet"></i>',
        wind: '<i class="icon fa-solid fa-wind"></i>',
        thermometer: '<i class="icon fa-solid fa-temperature-half"></i>',
        circle: '<i class="icon fa-solid fa-circle"></i>',
        'map-pin': '<i class="icon fa-solid fa-map-pin"></i>',
        close: '<i class="icon fa-solid fa-xmark"></i>',
        square: '<i class="icon fa-solid fa-square"></i>',
        table: '<i class="icon fa-solid fa-table"></i>',
        bars: '<i class="icon fa-solid fa-bars"></i>',
        code: '<i class="icon fa-solid fa-code"></i>',
        chart: '<i class="icon fa-solid fa-chart-line"></i>',
        'chevron-left': '<i class="icon fa-solid fa-chevron-left"></i>',
        'chevron-right': '<i class="icon fa-solid fa-chevron-right"></i>'
    };

    let observer = null;

    global.IconManager = {
        getIcon(name) {
            return ICONS[name] || '';
        },

        /**
         * Injecter les icônes dans le conteneur fourni
         * @param {ParentNode} container - élément à parcourir
         */
        inject(container = document) {
            if (container instanceof Element && container.hasAttribute('data-icon')) {
                container.innerHTML = this.getIcon(container.dataset.icon);
            }
            container.querySelectorAll('[data-icon]').forEach(el => {
                el.innerHTML = this.getIcon(el.dataset.icon);
            });
        },

        /**
         * Démarrer l'observation automatique pour injecter les icônes
         * @param {Element} target - Élément racine à observer
         */
        startAutoInject(target = document.body) {
            if (observer) return;
            observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.inject(node);
                        }
                    });
                });
            });

            observer.observe(target, { childList: true, subtree: true });
        }
    };
})(window);
