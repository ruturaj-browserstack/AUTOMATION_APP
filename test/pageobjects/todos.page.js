class TodosPage {
  get input() { return $('[data-testid="todo-input"]'); }
  get addBtn() { return $('[data-testid="add-todo-btn"]'); }
  get list() { return $('[data-testid="todo-list"]'); }
  get emptyItem() { return $('[data-testid="todo-empty"]'); }
  get totalCount() { return $('[data-testid="todo-count"]'); }
  get completedCount() { return $('[data-testid="todo-completed-count"]'); }

  items() { return $$('[data-testid^="todo-item-"]'); }

  itemByTitle(title) {
    return $(`//li[contains(@data-testid, "todo-item-")][.//span[normalize-space()="${title}"]]`);
  }

  async addTodo(title) {
    await this.input.waitForDisplayed();
    await this.input.setValue(title);
    await this.addBtn.click();
    await this.itemByTitle(title).waitForExist();
  }

  async toggle(title) {
    const item = this.itemByTitle(title);
    const checkbox = item.$('input[type="checkbox"]');
    await checkbox.click();
  }

  async delete(title) {
    const item = this.itemByTitle(title);
    const btn = item.$('button.danger');
    await btn.click();
    await item.waitForExist({ reverse: true });
  }

  async isCompleted(title) {
    const item = this.itemByTitle(title);
    const cls = await item.getAttribute('class');
    return (cls || '').includes('completed');
  }
}

export default new TodosPage();
