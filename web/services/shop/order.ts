import request from "../request";
import { MyOrderItem, PlaceOrderRequest } from "./typings";

export async function apiPlaceOrder(data: PlaceOrderRequest) {
    return request.post<string>("order/place-order", data);
}

export async function apiMyOrders(params?: API.FilterOptions) {
    return request.get<API.ListResult<MyOrderItem>>("order/my-orders", { params });
}
