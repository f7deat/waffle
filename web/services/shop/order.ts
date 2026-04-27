import request from "../request";

export async function apiPlaceOrder(data: API.PlaceOrderRequest) {
    return request.post<string>("order/place-order", data);
}

export async function apiMyOrders(params?: API.FilterOptions) {
    return request.get<API.ListResult<API.MyOrderItem>>("order/my-orders", { params });
}
