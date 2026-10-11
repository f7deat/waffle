import { BrandDetailType, BrandItemType } from "@/typings/shop/brand";
import { ProductDetailType, ProductItemType } from "@/typings/shop/product";
import request from "../request";
import { ProductCategoryFilterOptions, ProductCategoryItem, ProductFilterOptions, ProductImageItem, ProductTagFilterOptions, ProductTagItem } from "./typings";

export async function apiProducts(params: ProductFilterOptions) {
    return request.get<API.ListResult<ProductItemType>>('product/list', { params });
}

export async function apiProductCategories(params: ProductCategoryFilterOptions) {
    return request.get<API.ListResult<ProductCategoryItem>>('product/categories', { params });
}

export async function apiProductsByCategory(normalizedName: string, params: ProductFilterOptions) {
    return request.get<API.ListResult<ProductItemType>>(`product/category/${normalizedName}`, { params });
}

export async function apiProductsByTag(tagName: string, params: Partial<Omit<ProductTagFilterOptions, "tagName">> = {}) {
    return request.get<API.ListResult<ProductItemType>>('product/tags/products', {
        params: { ...params, tagName },
    });
}

export async function apiProductDetail(id: string) {
    return await request.get<API.TResult<ProductDetailType>>(`product/detail/${id}`);
}

export async function apiProductImages(id: string) {
    return await request.get<ProductImageItem[]>(`product/${id}/images`);
}

export async function apiProductTags(id: string) {
    return await request.get<API.TResult<ProductTagItem[]>>(`product/tags/${id}`);
}

export async function apiBrands(params: { current: number; pageSize: number; name?: string }) {
    return request.get<API.ListResult<BrandItemType>>("brand/list", { params });
}

export async function apiBrandDetail(normalizedName: string) {
    return request.get<API.TResult<BrandDetailType>>(`brand/detail/${normalizedName}`);
}