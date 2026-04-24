import { expect } from 'chai';
import LoginPage from '../pageobjects/login.page.js';
import CounterPage from '../pageobjects/counter.page.js';
import { api } from '../helpers/api.js';

describe('Counter', () => {
  beforeEach(async () => {
    await api.resetCounter();
    await LoginPage.open();
    await LoginPage.login('admin', 'admin123');
    await CounterPage.value.waitForDisplayed();
  });

  it('starts at zero', async () => {
    expect(await CounterPage.readValue()).to.equal(0);
  });

  it('increments the counter', async () => {
    await CounterPage.increment(3);
    await browser.waitUntil(
      async () => (await CounterPage.readValue()) === 3,
      { timeout: 5000, timeoutMsg: 'Counter did not reach 3' }
    );
  });

  it('decrements below zero', async () => {
    await CounterPage.decrement(2);
    await browser.waitUntil(
      async () => (await CounterPage.readValue()) === -2,
      { timeout: 5000 }
    );
  });

  it('increments and decrements combine correctly', async () => {
    await CounterPage.increment(5);
    await CounterPage.decrement(2);
    await browser.waitUntil(
      async () => (await CounterPage.readValue()) === 3,
      { timeout: 5000 }
    );
  });

  it('resets back to zero', async () => {
    await CounterPage.increment(4);
    await CounterPage.reset();
    await browser.waitUntil(
      async () => (await CounterPage.readValue()) === 0,
      { timeout: 5000 }
    );
  });
});
