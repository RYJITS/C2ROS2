const fs = require('fs');
const path = require('path');

beforeAll(() => {
  const script = fs.readFileSync(
    path.resolve(__dirname, '../js/modules/ui/icon-manager.js'),
    'utf8'
  );
  window.eval(script);
});

describe('IconManager.inject', () => {
  test("ajoute l'ic\u00f4ne home au span", () => {
    const container = document.createElement('div');
    container.innerHTML = '<span data-icon="home"></span>';
    window.IconManager.inject(container);
    const span = container.querySelector('[data-icon="home"]');
    expect(span.innerHTML).toContain('<i class="icon');
  });
});
