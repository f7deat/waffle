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