const fs = require('fs');
const path = require('path');

describe('Fonctions de mise à jour', () => {
  beforeAll(() => {
    document.body.innerHTML = '<button id="pwa-update" class="btn"></button>';
    window.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ version: '1.2.0' })
    }));
    const script = fs.readFileSync(path.resolve(__dirname, '../js/main.js'), 'utf8');
    window.eval(script);
  });

  test('markUpdateAvailable applique la classe', () => {
    window.markUpdateAvailable();
    const btn = document.getElementById('pwa-update');
    expect(btn.classList.contains('update-available')).toBe(true);
    expect(btn.style.overflow).toBe('visible');
  });

  test('checkVersionUpdate stocke la version', async () => {
    localStorage.setItem('c2ros_version', '1.1.0');
    window.checkVersionUpdate();
    await new Promise(process.nextTick);
    expect(localStorage.getItem('c2ros_version')).toBe('1.2.0');
  });
});
