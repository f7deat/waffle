export type BrandItemType = {
    id: number;
    name: string;
    normalizedName: string;
    description?: string;
    logo?: string;
    productCount: number;
};

export type BrandDetailType = BrandItemType & {
    isActive: boolean;
};
