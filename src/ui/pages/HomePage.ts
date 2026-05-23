import { BasePage } from '../../base/BasePage';
import type { Page } from '@playwright/test';
import { HomeLocators } from '../locators/HomeLocators';

export class HomePage extends BasePage {
  readonly locators: HomeLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new HomeLocators(page);
  }

  async navigateToHome(): Promise<void> {
    await this.navigate('/parabank/index.htm');
  }

  async navigateToRegistrationPage(): Promise<void> {
    await this.click(this.locators.registrationLink);
    await this.waitForPageLoad();
  }

  async getWelcomeText(): Promise<string> {
    return this.getText(this.locators.welcomeMessage);
  }

  async getAllNavMenuItems(): Promise<string[]> {
    return this.locators.leftNavMenuItems.allInnerTexts();
  }

  async getNavMenuHrefs(): Promise<string[]> {
    await this.locators.leftNavMenuItems.first().waitFor({ state: 'visible' });
    return this.locators.leftNavMenuItems.evaluateAll(
      els => els.map(el => (el as HTMLAnchorElement).href),
    );
  }

  async openNewAccount(): Promise<void> {
    await this.click(this.locators.openNewAccountLink);
    await this.waitForPageLoad();
  }

  async clickAccountsOverview(): Promise<void> {
    await this.click(this.locators.accountsOverviewLink);
    await this.waitForPageLoad();
  }

  async clickTransferFunds(): Promise<void> {
    await this.click(this.locators.transferFundsLink);
    await this.waitForPageLoad();
  }

  async clickBillPay(): Promise<void> {
    await this.click(this.locators.billPayLink);
    await this.waitForPageLoad();
  }

  async isNavMenuItemVisible(menuItemText: string): Promise<boolean> {
    const items = await this.locators.leftNavMenuItems.allInnerTexts();
    return items.some(item => item.trim() === menuItemText);
  }
}
