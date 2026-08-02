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
}

export type ProductImageItemType = {
    id: string;
    url: string;
}