declare namespace API {
    interface IFilter {
        current?: number;
        pageSize?: number;
    }

    type UserTopupTransaction = {
        id: string;
        userId: string;
        amount: number;
        balanceBefore: number;
        balanceAfter: number;
        invoiceNumber: string;
        note?: string;
        createdBy: string;
        createdByName?: string;
        createdAt: string;
    }

    type UserTopupStats = {
        userId: string;
        currentBalance: number;
        totalTopup: number;
        thisMonthTopup: number;
        topupCount: number;
        lastTopupAt?: string;
    }

    type UserTopupInvoice = {
        transactionId: string;
        invoiceNumber: string;
        userId: string;
        userName?: string;
        userEmail?: string;
        amount: number;
        balanceBefore: number;
        balanceAfter: number;
        note?: string;
        createdAt: string;
        createdBy: string;
        createdByName?: string;
    }

    type FinancialOverview = {
        totalDeposit: number;
        totalWithdraw: number;
        netFlow: number;
        transactionCount: number;
        depositCount: number;
        withdrawCount: number;
        activeUserCount: number;
        currentBalanceTotal: number;
        todayDeposit: number;
        todayWithdraw: number;
        thisMonthDeposit: number;
        thisMonthWithdraw: number;
    }

    type FinancialTransaction = {
        id: string;
        userId: string;
        userName?: string;
        userEmail?: string;
        amount: number;
        absoluteAmount: number;
        transactionType: 'deposit' | 'withdraw';
        balanceBefore: number;
        balanceAfter: number;
        invoiceNumber: string;
        note?: string;
        createdBy: string;
        createdByName?: string;
        createdAt: string;
    }

    type FinancialUserOption = {
        label: string;
        value: string;
        email?: string;
        balance: number;
    }
    interface ListResult<T> {
        data: T[];
        total: number;
    }
    interface TResult<T> {
        succeeded: boolean;
        message?: string;
        data?: T;
    }
}