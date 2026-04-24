import { expect } from 'chai';
import LoginPage from '../pageobjects/login.page.js';
import TodosPage from '../pageobjects/todos.page.js';
import { api } from '../helpers/api.js';

describe('Todos', () => {
  beforeEach(async () => {
    await api.resetTodos();
    await LoginPage.open();
    await LoginPage.login('admin', 'admin123');
    await TodosPage.input.waitForDisplayed();
  });

  it('shows an empty state when there are no todos', async () => {
    await TodosPage.emptyItem.waitForDisplayed();
    expect(await TodosPage.emptyItem.getText()).to.equal('No todos yet');
  });

  it('adds a new todo', async () => {
    await TodosPage.addTodo('Buy milk');
    const items = await TodosPage.items();
    expect(items).to.have.lengthOf(1);
    expect(await TodosPage.totalCount.getText()).to.equal('1 total');
  });

  it('adds multiple todos and reports the total', async () => {
    await TodosPage.addTodo('Item A');
    await TodosPage.addTodo('Item B');
    await TodosPage.addTodo('Item C');
    const items = await TodosPage.items();
    expect(items).to.have.lengthOf(3);
    expect(await TodosPage.totalCount.getText()).to.equal('3 total');
  });

  it('marks a todo as completed', async () => {
    await TodosPage.addTodo('Finish report');
    await TodosPage.toggle('Finish report');
    await browser.waitUntil(
      async () => TodosPage.isCompleted('Finish report'),
      { timeout: 5000, timeoutMsg: 'Todo was not marked completed' }
    );
    expect(await TodosPage.completedCount.getText()).to.equal('1 completed');
  });

  it('un-toggles a completed todo', async () => {
    await TodosPage.addTodo('Wash car');
    await TodosPage.toggle('Wash car');
    await TodosPage.toggle('Wash car');
    expect(await TodosPage.isCompleted('Wash car')).to.be.false;
    expect(await TodosPage.completedCount.getText()).to.equal('0 completed');
  });

  it('deletes a todo', async () => {
    await TodosPage.addTodo('Temporary');
    await TodosPage.delete('Temporary');
    await TodosPage.emptyItem.waitForDisplayed();
    expect(await TodosPage.totalCount.getText()).to.equal('0 total');
  });

  it('persists todos across page reload', async () => {
    await TodosPage.addTodo('Persist me');
    await browser.refresh();
    await TodosPage.itemByTitle('Persist me').waitForExist();
    expect(await TodosPage.itemByTitle('Persist me').isExisting()).to.be.true;
  });
});
