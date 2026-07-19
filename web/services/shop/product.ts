import { ProductItemType } from "@/typings/shop/product";
import request from "../request";

export async function apiProducts(params: API.ProductFilterOptions) {
    return request.get<API.ListResult<ProductItemType>>('product/list', { params });
}

export async function apiProductDetail(id: string) {
    return request.get<API.TResult<API.ProductDetail>>(`product/by-name/${id}`);
}