declare namespace API {
    interface ProductListItem {
        id: string;
        name: string;
        price: number;
        salePrice?: number;
        description?: string;
        viewCount: number;
        createdDate: string;
        thumbnail: string;
        normalizedName: string;
    }
    interface ProductDetail extends ProductListItem {
        content?: string;
        unitInStock?: number;
        affiliateLink?: string;
    }
}