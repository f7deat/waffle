import { ProductDetailType, ProductItemType } from "@/typings/shop/product";
import request from "../request";
import { ProductCategoryFilterOptions, ProductCategoryItem, ProductFilterOptions, ProductImageItem, ProductTagItem } from "./typings";

export async function apiProducts(params: ProductFilterOptions) {
    return request.get<API.ListResult<ProductItemType>>('product/list', { params });
}

export async function apiProductCategories(params: ProductCategoryFilterOptions) {
    return request.get<API.ListResult<ProductCategoryItem>>('product/categories', { params });
}

export async function apiProductsByCategory(normalizedName: string, params: ProductFilterOptions) {
    return request.get<API.ListResult<ProductItemType>>(`product/category/${normalizedName}`, { params });
}

export async function apiProductDetail(id: string) {
    return await request.get<API.TResult<ProductDetailType>>(`product/detail/${id}`);
}

export async function apiProductImages(id: string) {
    return await request.get<ProductImageItem[]>(`product/${id}/images`);
}

export async function apiProductTags(id: string) {
    return await request.get<ProductTagItem[]>(`product/tags/${id}`);
}