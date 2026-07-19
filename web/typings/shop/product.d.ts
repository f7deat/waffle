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