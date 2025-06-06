const fs = require('fs');
const path = require('path');

describe('UserCore.generateUserId', () => {
  beforeAll(() => {
    const script = fs.readFileSync(path.resolve(__dirname, '../js/modules/user/user-core.js'), 'utf8');
    window.eval(script);
  });

  test('génère des identifiants uniques', () => {
    const id1 = window.UserCore.prototype.generateUserId();
    const id2 = window.UserCore.prototype.generateUserId();
    expect(id1).toMatch(/^user_/);
    expect(id1).not.toBe(id2);
  });

  test('crée un utilisateur avec les pop-ups actifs par défaut', () => {
    const userCore = new window.UserCore();
    const user = userCore.createUser({ email: 'a@a.com', password: 'aaaaaa' });
    expect(user.preferences.showInfoPopups).toBe(true);
  });
});
