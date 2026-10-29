import { CategoryItemType } from "../category";

export type ProductItemType = {
    id: string;
    name: string;
    description?: string;
    normalizedName: string;
    thumbnail: string;
    price?: number;
    salePrice?: number;
    viewCount: number;
    modifiedDate: string;
    categoryName?: string;
    unitInStock?: number;
}

export type ProductDetailType = {
    id: string;
    name: string;
    description?: string;
    normalizedName: string;
    thumbnail: string;
    price?: number;
    salePrice?: number;
    viewCount: number;
    createdDate: string;
    modifiedDate: string;
    content: any;
    categoryId?: string;
    categoryName?: string;
    images?: ProductImageItemType[];
    unitInStock?: number;
    affiliateLink?: string;
    category?: CategoryItemType;
    brandId?: number;
    brand?: {
        id: number;
        name: string;
        normalizedName: string;
    };
    sku?: string;
    variants?: ProductVariantType[];
}

export type ProductImageItemType = {
    id: string;
    url: string;
}

export type ProductVariantType = {
    id: string;
    name?: string;
    sku?: string;
    price?: number;
    salePrice?: number;
    unitInStock?: number;
    thumbnail?: string;
    sortOrder: number;
}