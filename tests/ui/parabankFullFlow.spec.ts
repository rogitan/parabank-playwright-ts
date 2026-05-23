import { test, expect } from '../../playwright/fixtures';
import type { APIRequestContext } from '@playwright/test';
import { DataGenerator } from '../../src/utils/DataGenerator';
import { Logger } from '../../src/utils/Logger';
import { Transaction } from '../../src/types/transaction.types';
import { API_BASE_URL } from '../../src/constants/api.constants';
import { TransactionApiService } from '../../src/services/TransactionApiService';
import { assertBillPaymentTransaction } from '../../src/helpers/transactionAssertions';

interface SharedTestState {
  savingsAccountNumber: string;
  payeeName: string;
  apiContext: APIRequestContext;
  transactionApiService: TransactionApiService;
}

const shared: Partial<SharedTestState> = {};

test.describe.serial('ParaBank Full E2E Flow', () => {
  test.beforeEach(async ({ pm }) => {
    await pm.homePage.navigateToHome();
  });

  test('[test_01] Complete user journey: register, login, nav menu, open account, overview, transfer, pay bill', async ({ pm, page, playwright, takeScreenshot }) => {
    const user = DataGenerator.generateUserData();
    const payee = DataGenerator.generatePayeeData();

    // Step 2: Register a new user
    Logger.actionLog(`Registering new user: ${user.firstName} ${user.lastName} (${user.username})`);
    await pm.homePage.navigateToRegistrationPage();
    await pm.registrationPage.fillRegistrationForm(user);
    await pm.registrationPage.submitRegistration();

    const welcomeText = await pm.registrationPage.getWelcomeMessage();
    expect(welcomeText).toContain('Welcome');
    Logger.resultLog(`User ${user.firstName} ${user.lastName} registered successfully`);
    await takeScreenshot('Registration successful');

    // Step 3: Login explicitly with the registered user (verify credentials work)
    Logger.actionLog(`Logging in as ${user.username}`);
    await pm.loginPage.logout();
    await pm.loginPage.navigateToLogin();
    await pm.loginPage.loginUser(user.username, user.password);

    const welcomeMsg = await pm.homePage.getWelcomeText();
    expect(welcomeMsg).toContain('Welcome');
    expect(welcomeMsg.toLowerCase()).toContain(user.firstName.toLowerCase());
    Logger.resultLog(`Login verified for ${user.firstName} ${user.lastName}`);

  
    // Step 4: Verify global navigation menu links point to correct URLs
    Logger.actionLog('Verifying global navigation menu links');
    await pm.homePage.clickAccountsOverview();

    const navHrefs = await pm.homePage.getNavMenuHrefs();
    expect(navHrefs).toContainEqual(expect.stringContaining('openaccount.htm'));
    expect(navHrefs).toContainEqual(expect.stringContaining('overview.htm'));
    expect(navHrefs).toContainEqual(expect.stringContaining('transfer.htm'));
    expect(navHrefs).toContainEqual(expect.stringContaining('billpay.htm'));
    await takeScreenshot('Nav menu links verified');
    expect(navHrefs).toContainEqual(expect.stringContaining('findtrans.htm'));
    expect(navHrefs).toContainEqual(expect.stringContaining('updateprofile.htm'));
    expect(navHrefs).toContainEqual(expect.stringContaining('requestloan.htm'));
    expect(navHrefs).toContainEqual(expect.stringContaining('logout.htm'));
    Logger.resultLog('All 8 nav menu links verified');

    // Step 5: Open a Savings account and capture account number
    Logger.actionLog('Opening a new Savings account');
    const accountNumbers = await pm.accountOverviewPage.getAccountNumbers();

    // Get the existing account number
    const existingAccountNumber = accountNumbers[0];
    Logger.resultLog(`Existing account found: ${existingAccountNumber}`);

    // Open new Savings account 
    await pm.homePage.openNewAccount();
    const savingsAccountNumber = await pm.openAccountPage.openSavingsAccount(existingAccountNumber);

    const openedTitle = await pm.openAccountPage.getAccountOpenedTitle();
    expect(openedTitle).toContain('Account Opened');
    Logger.resultLog(`Savings account opened: ${savingsAccountNumber} (from ${existingAccountNumber})`);
    await takeScreenshot('Savings account opened');

    // Step 6: Validate account overview page balance details
    Logger.actionLog('Validating account overview balances');
    await pm.homePage.clickAccountsOverview();

    const allAccounts = await pm.accountOverviewPage.getAccountNumbers();
    expect(allAccounts.length).toBeGreaterThanOrEqual(2);

    const savingsBalance = await pm.accountOverviewPage.getBalanceForAccount(savingsAccountNumber);
    expect(savingsBalance).toBe('$100.00');
    Logger.resultLog(`Savings account ${savingsAccountNumber} balance: ${savingsBalance}`);

    const savingsAvailable = await pm.accountOverviewPage.getAvailableForAccount(savingsAccountNumber);
    expect(savingsAvailable).toBe('$100.00');
    Logger.resultLog(`Savings account ${savingsAccountNumber} available: ${savingsAvailable}`);

    const existingBalance = await pm.accountOverviewPage.getBalanceForAccount(existingAccountNumber);
    expect(existingBalance).toBe('$415.50');
    Logger.resultLog(`Existing account ${existingAccountNumber} balance: ${existingBalance}`);

    const totalBalance = await pm.accountOverviewPage.getTotalBalance();
    expect(totalBalance).toBe('$515.50');
    Logger.resultLog(`Total portfolio balance: ${totalBalance}`);
    await takeScreenshot('Account overview balances');

    // Step 7: Transfer $50 from savings account to existing account
    Logger.actionLog(`Transferring $50 from ${savingsAccountNumber} to ${existingAccountNumber}`);
    await pm.transferFundsPage.navigateToTransferFunds();
    const transferMessage = await pm.transferFundsPage.transferFunds(
      '50',
      savingsAccountNumber,
      existingAccountNumber
    );
    expect(transferMessage).toContain('Transfer Complete');
    Logger.resultLog(`Transfer of $50 from ${savingsAccountNumber} to ${existingAccountNumber} completed`);

    Logger.actionLog('Verifying updated balances after transfer');
    await pm.homePage.clickAccountsOverview();
    const updatedExistingBalance = await pm.accountOverviewPage.getBalanceForAccount(existingAccountNumber);
    expect(updatedExistingBalance).toBe('$465.50');
    Logger.resultLog(`Existing account ${existingAccountNumber} updated balance: ${updatedExistingBalance}`);
    const updatedSavingsBalance = await pm.accountOverviewPage.getBalanceForAccount(savingsAccountNumber);
    expect(updatedSavingsBalance).toBe('$50.00');
    Logger.resultLog(`Savings account ${savingsAccountNumber} updated balance: ${updatedSavingsBalance}`);
    await takeScreenshot('Balances after transfer');

    // Step 8: Pay a bill using the savings account
    Logger.actionLog(`Paying bill of $25 from ${savingsAccountNumber} to ${payee.name}`);
    await pm.billPayPage.navigateToBillPay();
    await pm.billPayPage.fillPayeeDetails(payee);
    const paymentMessage = await pm.billPayPage.sendPayment('25', savingsAccountNumber);
    expect(paymentMessage).toContain('Bill Payment Complete');
    Logger.resultLog(`Bill payment of $25 to ${payee.name} completed`);
    await takeScreenshot('Bill payment complete');

    // Save shared state for test_02
    const storage = await page.context().storageState();                          // Capture the browser's cookies and localStorage (the logged-in session)
    shared.savingsAccountNumber = savingsAccountNumber;                           // Store the newly created savings account number for test_02
    shared.payeeName = payee.name;                                                // Store the bill payee name for test_02
    shared.apiContext = await playwright.request.newContext({                     // Create an isolated API client…
      baseURL: API_BASE_URL,                                                      // …that points to the ParaBank REST API base URL…
      storageState: storage,                                                      // …and reuses the browser's auth session so the API calls are authenticated
      extraHTTPHeaders: { 'Accept': 'application/json' },                         // Request JSON responses instead of the default XML
    });
    shared.transactionApiService = new TransactionApiService(shared.apiContext);  // Wrap the API client in a typed service for transaction endpoints
  });
});
