import { test, expect } from '@playwright/test';
import { DataGenerator } from '../../src/utils/DataGenerator';
import { Logger } from '../../src/utils/Logger';
import { TransactionApiService } from '../../src/services/TransactionApiService';
import { API_BASE_URL } from '../../src/constants/api.constants';
import { assertBillPaymentTransaction } from '../../src/helpers/transactionAssertions';

test.describe('Find Transactions by Amount API', () => {
  let savingsAccountNumber: string;
  let payeeName: string;
  let transactionApiService: TransactionApiService;

  test.beforeAll(async ({ playwright }) => {
    const user = DataGenerator.generateUserData();
    const payee = DataGenerator.generatePayeeData();
    payeeName = payee.name;

    Logger.actionLog(`Setting up test with user: ${user.firstName} ${user.lastName} (${user.username})`);

    // Register via browser
    const browser = await playwright.chromium.launch();
    const page = await browser.newPage();
    await page.goto('/');
    await page.click('a[href*="register.htm"]');
    await page.fill('input[id="customer.firstName"]', user.firstName);
    await page.fill('input[id="customer.lastName"]', user.lastName);
    await page.fill('input[id="customer.address.street"]', user.address);
    await page.fill('input[id="customer.address.city"]', user.city);
    await page.fill('input[id="customer.address.state"]', user.state);
    await page.fill('input[id="customer.address.zipCode"]', user.zipCode);
    await page.fill('input[id="customer.phoneNumber"]', user.phone);
    await page.fill('input[id="customer.ssn"]', user.ssn);
    await page.fill('input[id="customer.username"]', user.username);
    await page.fill('input[id="customer.password"]', user.password);
    await page.fill('input[id="repeatedPassword"]', user.password);
    await page.click('input[value="Register"]');
    await page.waitForLoadState('networkidle');

    const welcomeText = await page.textContent('.title');
    expect(welcomeText).toContain('Welcome');
    Logger.resultLog(`User ${user.firstName} ${user.lastName} registered`);

    // Open savings account
    await page.click('a[href*="openaccount.htm"]');
    await page.waitForLoadState('networkidle');
    await page.selectOption('select[id="type"]', '1');
    await page.click('input[value="Open New Account"]');
    await page.waitForLoadState('networkidle');
    const openedText = await page.textContent('.title');
    expect(openedText).toContain('Account Opened');
    savingsAccountNumber = await page.textContent('#newAccountId');
    expect(savingsAccountNumber).toBeTruthy();
    Logger.resultLog(`Savings account opened: ${savingsAccountNumber}`);

    // Pay a bill
    await page.click('a[href*="billpay.htm"]');
    await page.waitForLoadState('networkidle');
    await page.fill('input[name="payee.name"]', payee.name);
    await page.fill('input[name="payee.address.street"]', payee.address);
    await page.fill('input[name="payee.address.city"]', payee.city);
    await page.fill('input[name="payee.address.state"]', payee.state);
    await page.fill('input[name="payee.address.zipCode"]', payee.zipCode);
    await page.fill('input[name="payee.phoneNumber"]', payee.phone);
    await page.fill('input[name="payee.accountNumber"]', payee.accountNumber);
    await page.fill('input[name="verifyAccount"]', payee.accountNumber);
    await page.fill('input[name="amount"]', '25');
    await page.selectOption('select[name="fromAccountId"]', savingsAccountNumber);
    await page.click('input[value="Send Payment"]');
    await page.waitForLoadState('networkidle');

    const billPayText = await page.textContent('.title');
    expect(billPayText).toContain('Bill Payment Complete');
    Logger.resultLog(`Bill payment of $25 to ${payee.name} completed`);

    // Create API context for transaction search
    const storage = await page.context().storageState();
    const apiContext = await playwright.request.newContext({
      baseURL: API_BASE_URL,
      storageState: storage,
      extraHTTPHeaders: { 'Accept': 'application/json' },
    });
    transactionApiService = new TransactionApiService(apiContext);

    await browser.close();
  });

  test('should find bill payment transaction by amount via API', async () => {
    const BILL_PAYMENT_AMOUNT = 25;

    Logger.actionLog(`Searching transactions by amount $${BILL_PAYMENT_AMOUNT} on account ${savingsAccountNumber}`);
    const transactions = await transactionApiService.getTransactionsByAmount(savingsAccountNumber, BILL_PAYMENT_AMOUNT);
    Logger.resultLog(`API returned ${transactions.length} transaction(s) for amount $${BILL_PAYMENT_AMOUNT}`);

    expect(transactions.length).toBeGreaterThan(0);

    const paymentTx = assertBillPaymentTransaction(transactions, {
      amount: BILL_PAYMENT_AMOUNT,
      payeeName,
      accountId: Number(savingsAccountNumber),
    });

    Logger.resultLog(`Validated transaction ID ${paymentTx.id}: amount=$${paymentTx.amount}, type=${paymentTx.type}, description="${paymentTx.description}"`);
  });
});
