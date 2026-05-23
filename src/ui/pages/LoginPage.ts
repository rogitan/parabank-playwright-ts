import { BasePage } from '../../base/BasePage';
import { LoginLocators } from '../locators/LoginLocators';
import type { Page } from '@playwright/test';

export class LoginPage extends BasePage {
  readonly locators: LoginLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new LoginLocators(page);
  }

  async navigateToLogin(): Promise<void> {
    await this.navigate('/parabank/index.htm');
  }

  async loginUser(username: string, password: string): Promise<void> {
    await this.fill(this.locators.usernameInput, username);
    await this.fill(this.locators.passwordInput, password);
    await this.click(this.locators.loginButton);
    await this.waitForPageLoad();
  }

  async logout(): Promise<void> {
    await this.click(this.locators.logoutLink);
    await this.waitForPageLoad();
  }
}
