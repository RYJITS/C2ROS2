window.C2R_DEBUG = window.C2R_DEBUG || /[?&]debug=1\b/.test(location.search);
(function initDebugOverlay(){
  if (!window.C2R_DEBUG || document.getElementById('c2r-debug')) return;
  const pre = document.createElement('pre');
  pre.id = 'c2r-debug';
  pre.style.cssText = 'position:fixed;left:0;right:0;bottom:0;max-height:40vh;overflow:auto;margin:0;padding:8px;background:rgba(0,0,0,.85);color:#0f0;font:12px monospace;z-index:999999;pointer-events:none;white-space:pre-wrap;';
  document.body.appendChild(pre);
  const log = (...a)=>{ pre.textContent += a.map(v=> typeof v==='object'? JSON.stringify(v): String(v)).join(' ') + '\n'; };
  ['log','info','warn','error','debug'].forEach(k=>{ const o=console[k].bind(console); console[k]=(...a)=>{ o(...a); log(`[${k.toUpperCase()}]`, ...a); }; });
})();

function getBasePath(){ const p=location.pathname; return p.endsWith('/')? p : p.replace(/\/[^/]*$/, '/'); }
function resolveURL(p){
  if (!p) return p;
  if (/^https?:\/\//i.test(p)) return p;
  const base = new URL(getBasePath(), location.origin);
  return new URL(p.replace(/^\//,''), base).href;
}
function ensureStyle(href){
  const url = resolveURL(href);
  if ([...document.styleSheets].some(s => s.href && (s.href === url || s.href.endsWith(href)))) return;
  const link = document.createElement('link'); link.rel='stylesheet'; link.href=url; document.head.appendChild(link);
}
async function importModule(path){
  const url = resolveURL(path);
  console.debug('[Loader] import', url);
  return await import(/* @vite-ignore */ url);
}

async function openApp(app){
  try{
    console.info('[Loader] openApp', app?.id || app?.name, app);

    // 1) Styles
    (app.styles || []).forEach(ensureStyle);

    // 2) HTML
    const entryUrl = resolveURL(app.entry);
    console.debug('[Loader] fetch HTML', entryUrl);
    const html = await fetch(entryUrl).then(r => { if(!r.ok) throw new Error(`HTTP ${r.status} on ${entryUrl}`); return r.text(); });

    // 3) Conteneur
    const container = getAppContainer(app);
    container.innerHTML = html;

    // 4) Importer les modules (les <script> dans innerHTML ne s’exécutent PAS)
    const mods = [];
    for (const m of (app.scripts || [])) mods.push(await importModule(m));

    // 5) Monter explicitement
    const main  = mods.at(-1) || {};
    const mount = main.mountChessPro || window.mountChessPro;
    const root  = container.querySelector('.c2r-chess-pro');
    console.debug('[Loader] mount?', !!mount, 'root?', !!root);

    if (typeof mount === 'function' && root){
      if (!root.__mounted){
        mount(root);
        root.__mounted = true;
      }
      console.info('[Loader] mounted OK');
    } else {
      console.warn('[Loader] mountChessPro introuvable OU .c2r-chess-pro manquant');
    }

    // 6) Afficher fenêtre/modale
    showAppWindow(container);
  } catch(e){
    console.error('[Loader] openApp failed', e);
    alert('Échec lancement Échecs Pro : ' + e.message);
  }
}

/**
 * Créer un conteneur d'application
 * @param {Object} app - Application
 * @returns {HTMLElement} Conteneur
 */
function getAppContainer(app) {
    let container = document.getElementById(`app-container-${app.id}`);
    if (!container) {
        container = document.createElement('div');
        container.id = `app-container-${app.id}`;
        container.className = 'app-container';
        container.style.display = 'none';
        document.body.appendChild(container);
    }
    return container;
}

/**
 * Afficher la fenêtre d'application
 * @param {HTMLElement} container - Conteneur de l'application
 */
function showAppWindow(container) {
    // Si UICore est disponible, utiliser sa méthode
    if (window.C2R_SYSTEM?.uiCore) {
        const appId = container.id.replace('app-container-', '');
        const app = window.C2R_SYSTEM.appCore.getApp(appId);
        if (app) {
            window.C2R_SYSTEM.uiCore.loadAppContent(app);
            return;
        }
    }
    
    // Méthode de fallback : afficher dans une modal simple
    const modal = document.createElement('div');
    modal.className = 'simple-app-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: #1a1a1a;
        border-radius: 8px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
        position: relative;
    `;
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        z-index: 1;
    `;
    closeBtn.onclick = () => modal.remove();
    
    content.appendChild(closeBtn);
    
    // Copier le contenu du conteneur dans la modal
    const appContent = container.cloneNode(true);
    appContent.style.display = 'block';
    content.appendChild(appContent);
    
    modal.appendChild(content);
    document.body.appendChild(modal);
}

window.C2R_APP_LOADER = { openApp, getAppContainer, showAppWindow };
