import type { Page } from '@playwright/test';
import { RegistrationPage } from './pages/RegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { OpenAccountPage } from './pages/OpenAccountPage';
import { AccountOverviewPage } from './pages/AccountOverviewPage';
import { TransferFundsPage } from './pages/TransferFundsPage';
import { BillPayPage } from './pages/BillPayPage';

export class PageManager {
  private _registrationPage!: RegistrationPage;
  private _loginPage!: LoginPage;
  private _homePage!: HomePage;
  private _openAccountPage!: OpenAccountPage;
  private _accountOverviewPage!: AccountOverviewPage;
  private _transferFundsPage!: TransferFundsPage;
  private _billPayPage!: BillPayPage;

  constructor(private readonly page: Page) {}

  get registrationPage(): RegistrationPage {
    return (this._registrationPage ??= new RegistrationPage(this.page));
  }

  get loginPage(): LoginPage {
    return (this._loginPage ??= new LoginPage(this.page));
  }

  get homePage(): HomePage {
    return (this._homePage ??= new HomePage(this.page));
  }

  get openAccountPage(): OpenAccountPage {
    return (this._openAccountPage ??= new OpenAccountPage(this.page));
  }

  get accountOverviewPage(): AccountOverviewPage {
    return (this._accountOverviewPage ??= new AccountOverviewPage(this.page));
  }

  get transferFundsPage(): TransferFundsPage {
    return (this._transferFundsPage ??= new TransferFundsPage(this.page));
  }

  get billPayPage(): BillPayPage {
    return (this._billPayPage ??= new BillPayPage(this.page));
  }
}
