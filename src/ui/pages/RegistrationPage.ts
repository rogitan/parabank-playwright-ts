import { BasePage } from '../../base/BasePage';
import { RegistrationLocators } from '../locators/RegistrationLocators';
import type { Page } from '@playwright/test';

export class RegistrationPage extends BasePage {
  readonly locators: RegistrationLocators;

  constructor(page: Page) {
    super(page);
    this.locators = new RegistrationLocators(page);
  }

  async navigateToRegistration(): Promise<void> {
    await this.navigate('/parabank/register.htm');
  }

  async navigateToHome(): Promise<void> {
    await this.navigate('/parabank/index.htm');
  }

  async fillRegistrationForm(user: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
    ssn: string;
    username: string;
    password: string;
  }): Promise<void> {
    await this.fill(this.locators.firstNameInput, user.firstName);
    await this.fill(this.locators.lastNameInput, user.lastName);
    await this.fill(this.locators.addressInput, user.address);
    await this.fill(this.locators.cityInput, user.city);
    await this.fill(this.locators.stateInput, user.state);
    await this.fill(this.locators.zipCodeInput, user.zipCode);
    await this.fill(this.locators.phoneInput, user.phone);
    await this.fill(this.locators.ssnInput, user.ssn);
    await this.fill(this.locators.usernameInput, user.username);
    await this.fill(this.locators.passwordInput, user.password);
    await this.fill(this.locators.confirmPasswordInput, user.password);
  }

  async submitRegistration(): Promise<void> {
    await this.click(this.locators.registerButton);
    await this.page.waitForURL(/overview|register\.htm$/, { timeout: 15000 });
    await this.waitForPageLoad();
  }

  async getWelcomeMessage(): Promise<string> {
    return this.getText(this.locators.welcomeMessage);
  }
}
