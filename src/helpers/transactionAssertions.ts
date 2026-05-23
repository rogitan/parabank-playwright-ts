import { expect } from '@playwright/test';
import type { Transaction } from '../types/transaction.types';

export function assertBillPaymentTransaction(
  transactions: Transaction[],
  expected: {
    amount: number;
    payeeName: string;
    accountId: number;
  }
): Transaction {
  const paymentTx = transactions.find(tx =>
    tx.description.toLowerCase().includes('bill payment')
  );

  expect(paymentTx).toBeDefined();
  expect(paymentTx!.amount).toBe(expected.amount);
  expect(paymentTx!.type).toBe('Debit');
  expect(paymentTx!.description).toContain(expected.payeeName);
  expect(paymentTx!.accountId).toBe(expected.accountId);

  return paymentTx!;
}
