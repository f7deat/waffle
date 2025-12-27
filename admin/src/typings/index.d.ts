declare namespace API {
    interface IFilter {
        current?: number;
        pageSize?: number;
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