import { BasePage } from '../../base/BasePage';
import { TransferFundsLocators } from '../locators/TransferFundsLocators';
import type { Page } from '@playwright/test';

export class TransferFundsPage extends BasePage {
  readonly locators: TransferFundsLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new TransferFundsLocators(page);
  }

  async navigateToTransferFunds(): Promise<void> {
    await this.navigate('/parabank/transfer.htm');
  }

  async transferFunds(
    amount: string,
    fromAccount: string,
    toAccount: string
  ): Promise<string> {
    await this.fill(this.locators.amountInput, amount);
    await this.selectOption(this.locators.fromAccountDropdown, fromAccount);
    await this.selectOption(this.locators.toAccountDropdown, toAccount);
    await this.click(this.locators.transferButton);
    await this.waitForPageLoad();
    return this.getText(this.locators.transferCompleteMessage);
  }

  async getTransferCompleteMessage(): Promise<string> {
    return this.getText(this.locators.transferCompleteMessage);
  }
}
