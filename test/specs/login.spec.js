import { expect } from 'chai';
import LoginPage from '../pageobjects/login.page.js';

describe('Login', () => {
  beforeEach(async () => {
    await LoginPage.open();
  });

  it('rejects invalid credentials', async () => {
    await LoginPage.login('admin', 'wrong-password');
    await LoginPage.errorMsg.waitForDisplayed();
    expect(await LoginPage.errorMsg.getText()).to.match(/invalid/i);
  });

  it('signs in with valid credentials and shows welcome', async () => {
    await LoginPage.login('admin', 'admin123');
    await LoginPage.welcome.waitForDisplayed();
    expect(await LoginPage.welcome.getText()).to.equal('Welcome, admin');
  });

  it('logs out and returns to login form', async () => {
    await LoginPage.login('admin', 'admin123');
    await LoginPage.logoutBtn.waitForDisplayed();
    await LoginPage.logoutBtn.click();
    await LoginPage.form.waitForDisplayed();
    expect(await LoginPage.form.isDisplayed()).to.be.true;
  });
});
