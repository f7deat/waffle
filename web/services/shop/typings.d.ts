export interface ProductListItem {
    id: string;
    name: string;
    price: number;
    salePrice?: number;
    description?: string;
    viewCount: number;
    createdDate: string;
    thumbnail: string;
    normalizedName: string;
    categoryId?: number;
}
export interface ProductDetail extends ProductListItem {
    content?: API.BlockEditor;
    unitInStock?: number;
    affiliateLink?: string;
    images?: ProductImageItem[];
}
export interface ProductImageItem {
    id?: string;
    productId?: string;
    url: string;
    sortOrder?: number;
}
export interface ProductFilterOptions extends API.FilterOptions {
    name?: string;
}

export interface ProductCategoryFilterOptions extends API.FilterOptions {
    name?: string;
}

export interface ProductCategoryItem {
    id: number;
    name: string;
    normalizedName: string;
    description?: string;
    thumbnail?: string;
    productCount: number;
}

export interface PlaceOrderDetail {
    productId: string;
    quantity: number;
    price: number;
}

export interface PlaceOrderRequest {
    name: string;
    phoneNumber: string;
    address: string;
    note?: string;
    orderDetails: PlaceOrderDetail[];
}

export type MyOrderStatus = "Open" | "Confirmed" | "Paid" | "Refunded" | "Cancelled" | number;

export interface MyOrderItem {
    id: string;
    number: string;
    createdDate: string;
    status: MyOrderStatus;
    note?: string;
}

export interface ProductTagItem {
    id: string;
    productId: string;
    name: string;
    normalizedName: string;
}