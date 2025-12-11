import request from "../request";

export async function apiProducts(params: {
    current: number;
    pageSize: number;
}) {
    return request.get<API.ListResult<API.ProductListItem>>('/product/list', { params });
}