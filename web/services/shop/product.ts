import { ProductDetailType, ProductItemType } from "@/typings/shop/product";
import request from "../request";

export async function apiProducts(params: API.ProductFilterOptions) {
    return request.get<API.ListResult<ProductItemType>>('product/list', { params });
}

export async function apiProductDetail(id: string) {
    return await request.get<API.TResult<ProductDetailType>>(`product/detail/${id}`);
}

export async function apiProductImages(id: string) {
    return await request.get<API.ProductImageItem[]>(`product/${id}/images`);
}