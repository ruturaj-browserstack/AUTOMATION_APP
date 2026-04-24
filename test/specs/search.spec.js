import { expect } from 'chai';
import LoginPage from '../pageobjects/login.page.js';
import TodosPage from '../pageobjects/todos.page.js';
import { api } from '../helpers/api.js';

describe('Search', () => {
  beforeEach(async () => {
    await api.resetTodos();
    await LoginPage.open();
    await LoginPage.login('admin', 'admin123');
    await TodosPage.input.waitForDisplayed();
  });

  it('filters todos case-insensitively', async () => {
    await TodosPage.addTodo('Buy Milk');
    await TodosPage.addTodo('Call friend');
    await TodosPage.addTodo('Read Book');

    await $('[data-testid="search-input"]').setValue('milk');

    await TodosPage.itemByTitle('Buy Milk').waitForExist();
    expect(await TodosPage.itemByTitle('Buy Milk').isExisting()).to.be.true;
    expect(await TodosPage.itemByTitle('Call friend').isExisting()).to.be.false;
    expect(await TodosPage.itemByTitle('Read Book').isExisting()).to.be.false;
  });
});
