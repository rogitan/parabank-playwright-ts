import { BasePage } from '../../base/BasePage';
import { AccountOverviewLocators } from '../locators/AccountOverviewLocators';
import type { Page } from '@playwright/test';

export class AccountOverviewPage extends BasePage {
  readonly locators: AccountOverviewLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new AccountOverviewLocators(page);
  }

  async navigateToAccountOverview(): Promise<void> {
    await this.navigate('/parabank/overview.htm');
  }

  async getAccountNumbers(): Promise<string[]> {
    return this.locators.accountNumberLinks.allInnerTexts();
  }

  async getBalanceForAccount(accountNumber: string): Promise<string> {
    const accountLink = this.locators.accountNumberLinks.filter({ hasText: accountNumber });
    const row = accountLink.locator('xpath=ancestor::tr');
    return row.locator('td:nth-child(2)').innerText();
  }

  async getAvailableForAccount(accountNumber: string): Promise<string> {
    const accountLink = this.locators.accountNumberLinks.filter({ hasText: accountNumber });
    const row = accountLink.locator('xpath=ancestor::tr');
    return row.locator('td:nth-child(3)').innerText();
  }

  async getTotalBalance(): Promise<string> {
    return this.getText(this.locators.totalBalance);
  }

  async getAccountCount(): Promise<number> {
    return this.locators.accountNumberLinks.count();
  }
}
