import { type Page, type Locator } from '@playwright/test';

export class HomeLocators {
  readonly leftNavMenuItems: Locator;
  readonly openNewAccountLink: Locator;
  readonly accountsOverviewLink: Locator;
  readonly transferFundsLink: Locator;
  readonly billPayLink: Locator;
  readonly findTransactionsLink: Locator;
  readonly updateContactInfoLink: Locator;
  readonly requestLoanLink: Locator;
  readonly logoutLink: Locator;
  readonly registrationLink: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.leftNavMenuItems = page.locator('#leftPanel ul li a');
    this.registrationLink = page.locator('a[href*="register.htm"]');
    this.openNewAccountLink = page.locator('a[href*="openaccount.htm"]');
    this.accountsOverviewLink = page.locator('a[href*="overview.htm"]');
    this.transferFundsLink = page.locator('a[href*="transfer.htm"]');
    this.billPayLink = page.locator('a[href*="billpay.htm"]');
    this.findTransactionsLink = page.locator('a[href*="findtrans.htm"]');
    this.updateContactInfoLink = page.locator('a[href*="updateprofile.htm"]');
    this.requestLoanLink = page.locator('a[href*="requestloan.htm"]');
    this.logoutLink = page.locator('a[href*="logout.htm"]');
    this.welcomeMessage = page.locator('.smallText');
  }
}
