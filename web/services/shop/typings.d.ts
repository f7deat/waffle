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
        categoryId?: number;
    }
    interface ProductDetail extends ProductListItem {
        content?: API.BlockEditor;
        unitInStock?: number;
        affiliateLink?: string;
        images?: ProductImageItem[];
    }
    interface ProductImageItem {
        id?: string;
        productId?: string;
        url: string;
        sortOrder?: number;
    }
    interface ProductFilterOptions extends FilterOptions {
        name?: string;
    }

    interface PlaceOrderDetail {
        productId: string;
        quantity: number;
        price: number;
    }

    interface PlaceOrderRequest {
        name: string;
        phoneNumber: string;
        address: string;
        note?: string;
        orderDetails: PlaceOrderDetail[];
    }

    type MyOrderStatus = "Open" | "Confirmed" | "Paid" | "Refunded" | "Cancelled" | number;

    interface MyOrderItem {
        id: string;
        number: string;
        createdDate: string;
        status: MyOrderStatus;
        note?: string;
    }
}