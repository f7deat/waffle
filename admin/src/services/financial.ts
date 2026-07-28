import { request } from '@umijs/max';

export type FinancialFilter = API.IFilter & {
  userId?: string;
  type?: 'deposit' | 'withdraw';
  keyWords?: string;
  fromDate?: string;
  toDate?: string;
};

export async function apiFinancialOverview(params?: {
  fromDate?: string;
  toDate?: string;
}) {
  return request(`financial/overview`, { params });
}

export async function apiFinancialTransactions(params?: FinancialFilter) {
  return request(`financial/transaction`, { params });
}

export async function apiFinancialDeposits(params?: FinancialFilter) {
  return request(`financial/deposit`, { params });
}

export async function apiFinancialWithdraws(params?: FinancialFilter) {
  return request(`financial/withdraw`, { params });
}

export async function apiFinancialDeposit(data: {
  userId: string;
  amount: number;
  note?: string;
}) {
  return request(`financial/deposit`, {
    method: 'POST',
    data,
  });
}

export async function apiFinancialWithdraw(data: {
  userId: string;
  amount: number;
  note?: string;
}) {
  return request(`financial/withdraw`, {
    method: 'POST',
    data,
  });
}

export async function apiFinancialUserOptions(params?: {
  keyWords?: string;
}) {
  return request(`financial/user-options`, { params });
}
