import request from "../request";

export async function apiProducts(params: API.ProductFilterOptions) {
    return request.get<API.ListResult<API.ProductListItem>>('product/list', { params });
}

export async function apiProductDetail(id: string) {
    return request.get<API.TResult<API.ProductDetail>>(`product/by-name/${id}`);
}