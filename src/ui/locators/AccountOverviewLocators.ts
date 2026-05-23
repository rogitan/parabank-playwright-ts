import { type Page, type Locator } from '@playwright/test';

export class AccountOverviewLocators {
  readonly accountTable: Locator;
  readonly accountRows: Locator;
  readonly accountNumberLinks: Locator;
  readonly balanceAmounts: Locator;
  readonly availableAmounts: Locator;
  readonly totalBalance: Locator;

  constructor(page: Page) {
    this.accountTable = page.locator('#accountTable');
    this.accountRows = page.locator('#accountTable tbody tr');
    this.accountNumberLinks = page.locator('#accountTable a');
    this.balanceAmounts = page.locator('#accountTable tbody tr td:nth-child(2)');
    this.availableAmounts = page.locator('#accountTable tbody tr td:nth-child(3)');
    this.totalBalance = page.locator('#accountTable tbody tr:last-of-type td:nth-child(2)');
  }
}
