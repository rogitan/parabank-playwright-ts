import { BasePage } from '../../base/BasePage';
import { BillPayLocators } from '../locators/BillPayLocators';
import type { Page } from '@playwright/test';

export class BillPayPage extends BasePage {
  readonly locators: BillPayLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new BillPayLocators(page);
  }

  async navigateToBillPay(): Promise<void> {
    await this.navigate('/parabank/billpay.htm');
  }

  async fillPayeeDetails(payee: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    accountNumber: string;
  }): Promise<void> {
    await this.fill(this.locators.payeeNameInput, payee.name);
    await this.fill(this.locators.payeeAddressInput, payee.address);
    await this.fill(this.locators.payeeCityInput, payee.city);
    await this.fill(this.locators.payeeStateInput, payee.state);
    await this.fill(this.locators.payeeZipCodeInput, payee.zipCode);
    await this.fill(this.locators.payeePhoneInput, payee.phone);
    await this.fill(this.locators.payeeAccountNumberInput, payee.accountNumber);
    await this.fill(this.locators.verifyAccountInput, payee.accountNumber);
  }

  async sendPayment(
    amount: string,
    fromAccountId: string
  ): Promise<string> {
    await this.fill(this.locators.amountInput, amount);
    await this.selectOption(this.locators.fromAccountDropdown, fromAccountId);
    await this.click(this.locators.sendPaymentButton);
    await this.waitForPageLoad();
    return this.getText(this.locators.paymentCompleteMessage);
  }
}
