declare namespace API {
    interface ListResult<T> {
        data: T[];
        total: number;
    }
    interface FilterOptions {
        current: number;
        pageSize: number;
    }
}