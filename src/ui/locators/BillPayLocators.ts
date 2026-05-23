import { type Page, type Locator } from '@playwright/test';

export class BillPayLocators {
  readonly payeeNameInput: Locator;
  readonly payeeAddressInput: Locator;
  readonly payeeCityInput: Locator;
  readonly payeeStateInput: Locator;
  readonly payeeZipCodeInput: Locator;
  readonly payeePhoneInput: Locator;
  readonly payeeAccountNumberInput: Locator;
  readonly verifyAccountInput: Locator;
  readonly amountInput: Locator;
  readonly fromAccountDropdown: Locator;
  readonly sendPaymentButton: Locator;
  readonly paymentCompleteMessage: Locator;

  constructor(page: Page) {
    this.payeeNameInput = page.locator('input[name="payee.name"]');
    this.payeeAddressInput = page.locator('input[name="payee.address.street"]');
    this.payeeCityInput = page.locator('input[name="payee.address.city"]');
    this.payeeStateInput = page.locator('input[name="payee.address.state"]');
    this.payeeZipCodeInput = page.locator('input[name="payee.address.zipCode"]');
    this.payeePhoneInput = page.locator('input[name="payee.phoneNumber"]');
    this.payeeAccountNumberInput = page.locator('input[name="payee.accountNumber"]');
    this.verifyAccountInput = page.locator('input[name="verifyAccount"]');
    this.amountInput = page.locator('input[name="amount"]');
    this.fromAccountDropdown = page.locator('select[name="fromAccountId"]');
    this.sendPaymentButton = page.locator('input[value="Send Payment"]');
    this.paymentCompleteMessage = page.getByRole('heading', { name: /Bill Payment Complete/i });
  }
}
