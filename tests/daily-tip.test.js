const fs = require('fs');
const path = require('path');

describe('UICore.updateDailyTip', () => {
  beforeAll(async () => {
    // Charger les scripts nécessaires
    const configScript = fs.readFileSync(path.resolve(__dirname, '../js/modules/core/config.js'), 'utf8');
    window.eval(configScript);
    const tipsScript = fs.readFileSync(path.resolve(__dirname, '../js/data/daily-tips.js'), 'utf8');
    window.eval(tipsScript);
    const uiScript = fs.readFileSync(path.resolve(__dirname, '../js/modules/ui/ui-core.js'), 'utf8');
    window.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ features: ['Test dynamique'] })
    }));
    document.body.innerHTML = '<div id="daily-tip"><p></p></div>';
    window.eval(uiScript);
  });

  test('affiche un conseil aléatoire', async () => {
    const ui = new window.UICore();
    await ui.updateDailyTip();
    const text = document.querySelector('#daily-tip p').textContent;
    expect(text.length).toBeGreaterThan(0);
  });
});
