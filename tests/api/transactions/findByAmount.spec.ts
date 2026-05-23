import { test, expect } from '@playwright/test';
import { Logger } from '../../src/utils/Logger';
import { TransactionApiService } from '../../src/services/TransactionApiService';
import { API_BASE_URL } from '../../src/constants/api.constants';
import { assertBillPaymentTransaction } from '../../src/helpers/transactionAssertions';
import * as fs from 'fs';
import * as path from 'path';

const sharedDataDir = path.join(__dirname, '..', '..', 'shared-data');

test.describe('Find Transactions by Amount API', () => {
  let savingsAccountNumber: string;
  let payeeName: string;
  let transactionApiService: TransactionApiService;

  test.beforeAll(async ({ playwright }) => {
    const dataFile = path.join(sharedDataDir, 'test-data.json');
    const storageFile = path.join(sharedDataDir, 'storage-state.json');

    if (!fs.existsSync(dataFile) || !fs.existsSync(storageFile)) {
      throw new Error('Shared data not found. Run UI tests first to generate shared-data/ files.');
    }

    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    const storageState = JSON.parse(fs.readFileSync(storageFile, 'utf8'));

    savingsAccountNumber = data.savingsAccountNumber;
    payeeName = data.payeeName;

    const apiContext = await playwright.request.newContext({
      baseURL: API_BASE_URL,
      storageState,
      extraHTTPHeaders: { 'Accept': 'application/json' },
    });
    transactionApiService = new TransactionApiService(apiContext);

    Logger.resultLog(`Loaded shared data: account=${savingsAccountNumber}, payee=${payeeName}`);
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
