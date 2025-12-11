declare namespace API {
    interface ListResult<T> {
        data: T[];
        total: number;
    }
}