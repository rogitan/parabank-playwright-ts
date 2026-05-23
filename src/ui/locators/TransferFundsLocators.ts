import { type Page, type Locator } from '@playwright/test';

export class TransferFundsLocators {
  readonly amountInput: Locator;
  readonly fromAccountDropdown: Locator;
  readonly toAccountDropdown: Locator;
  readonly transferButton: Locator;
  readonly transferCompleteMessage: Locator;

  constructor(page: Page) {
    this.amountInput = page.locator('input[id="amount"]');
    this.fromAccountDropdown = page.locator('select[id="fromAccountId"]');
    this.toAccountDropdown = page.locator('select[id="toAccountId"]');
    this.transferButton = page.locator('input[value="Transfer"]');
    this.transferCompleteMessage = page.getByRole('heading', { name: /Transfer Complete/i });
  }
}
