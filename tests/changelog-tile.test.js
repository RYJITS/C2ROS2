const fs = require('fs');
const path = require('path');

describe('updateChangelogTile', () => {
  beforeAll(() => {
    document.body.innerHTML = '<ul id="changelog-list"></ul>';
    window.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve([
        { datetime: '2025-07-10 12:00', description: 'test' }
      ])
    }));

    const configScript = fs.readFileSync(
      path.resolve(__dirname, '../js/modules/core/config.js'),
      'utf8'
    );
    const uiScript = fs.readFileSync(
      path.resolve(__dirname, '../js/modules/ui/ui-core.js'),
      'utf8'
    );
    window.eval(configScript);
    window.eval(uiScript);
  });

  test('affiche les modifications', async () => {
    const ui = new window.UICore();
    ui.updateChangelogTile();
    await new Promise(process.nextTick);
    const list = document.getElementById('changelog-list');
    expect(list.children.length).toBe(1);
    expect(list.textContent).toContain('test');
  });
});
