import { expect } from '@playwright/test';
import type { APIRequestContext } from '@playwright/test';
import type { Transaction } from '../types/transaction.types';

export class TransactionApiService {
  constructor(private readonly apiContext: APIRequestContext) {}

  async getTransactionsByAmount(
    accountId: string,
    amount: number
  ): Promise<Transaction[]> {
    const response = await this.apiContext.get(
      `accounts/${accountId}/transactions/amount/${amount}`
    );
    expect(response.ok()).toBeTruthy();
    return response.json();
  }
}
