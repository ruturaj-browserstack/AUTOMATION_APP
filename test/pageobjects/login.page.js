class LoginPage {
  get form() { return $('[data-testid="login-form"]'); }
  get usernameInput() { return $('[data-testid="username-input"]'); }
  get passwordInput() { return $('[data-testid="password-input"]'); }
  get submitBtn() { return $('[data-testid="login-btn"]'); }
  get errorMsg() { return $('[data-testid="login-error"]'); }
  get welcome() { return $('[data-testid="welcome"]'); }
  get logoutBtn() { return $('[data-testid="logout-btn"]'); }

  async open() {
    await browser.url('/');
    await browser.execute(() => localStorage.removeItem('user'));
    await browser.url('/');
  }

  async login(username, password) {
    await this.usernameInput.waitForDisplayed();
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.submitBtn.click();
  }
}

export default new LoginPage();
