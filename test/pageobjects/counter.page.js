class CounterPage {
  get value() { return $('[data-testid="counter-value"]'); }
  get incrementBtn() { return $('[data-testid="counter-increment"]'); }
  get decrementBtn() { return $('[data-testid="counter-decrement"]'); }
  get resetBtn() { return $('[data-testid="counter-reset"]'); }

  async readValue() {
    await this.value.waitForDisplayed();
    const text = await this.value.getText();
    return Number(text);
  }

  async increment(times = 1) {
    for (let i = 0; i < times; i++) await this.incrementBtn.click();
  }

  async decrement(times = 1) {
    for (let i = 0; i < times; i++) await this.decrementBtn.click();
  }

  async reset() {
    await this.resetBtn.click();
  }
}

export default new CounterPage();
