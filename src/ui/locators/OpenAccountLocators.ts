import { type Page, type Locator } from '@playwright/test';

export class OpenAccountLocators {
  readonly accountTypeDropdown: Locator;
  readonly existingAccountDropdown: Locator;
  readonly openNewAccountButton: Locator;
  readonly accountNumberDisplay: Locator;
  readonly accountOpenedTitle: Locator;

  constructor(page: Page) {
    this.accountTypeDropdown = page.locator('select[id="type"]');
    this.existingAccountDropdown = page.locator('select[id="fromAccountId"]');
    this.openNewAccountButton = page.locator('input[value="Open New Account"]');
    this.accountNumberDisplay = page.locator('#newAccountId');
    this.accountOpenedTitle = page.locator('h1:has-text("Account Opened!")');
  }
}
