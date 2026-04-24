import { expect } from 'chai';
import LoginPage from '../pageobjects/login.page.js';
import TodosPage from '../pageobjects/todos.page.js';
import { api } from '../helpers/api.js';

describe('Clear completed', () => {
  beforeEach(async () => {
    await api.resetTodos();
    await LoginPage.open();
    await LoginPage.login('admin', 'admin123');
    await TodosPage.input.waitForDisplayed();
  });

  it('removes only completed todos when the clear button is clicked', async () => {
    await TodosPage.addTodo('Keep me');
    await TodosPage.addTodo('Remove me');
    await TodosPage.toggle('Remove me');

    await $('[data-testid="clear-completed-bttn"]').click();

    await TodosPage.itemByTitle('Remove me').waitForExist({ reverse: true });
    expect(await TodosPage.itemByTitle('Keep me').isExisting()).to.be.true;
    expect(await TodosPage.totalCount.getText()).to.equal('1 total');
  });
});
