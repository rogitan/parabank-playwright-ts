import { BasePage } from '../../base/BasePage';
import { OpenAccountLocators } from '../locators/OpenAccountLocators';
import type { Page } from '@playwright/test';

export class OpenAccountPage extends BasePage {
  readonly locators: OpenAccountLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new OpenAccountLocators(page);
  }

  async navigateToOpenAccount(): Promise<void> {
    await this.navigate('/parabank/openaccount.htm');
  }

  async openSavingsAccount(fromAccountId: string): Promise<string> {
    await this.selectOption(this.locators.accountTypeDropdown, '1');
    await this.selectOption(this.locators.existingAccountDropdown, fromAccountId);
    await this.click(this.locators.openNewAccountButton);
    await this.waitForPageLoad();
    await this.waitForLocator(this.locators.accountNumberDisplay);
    return this.getText(this.locators.accountNumberDisplay);
  }

  async getAccountOpenedTitle(): Promise<string> {
    return this.getText(this.locators.accountOpenedTitle);
  }
}
