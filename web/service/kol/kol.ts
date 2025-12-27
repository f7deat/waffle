import request from "../request";

export async function apiKolList(params?: API.KolFilterOptions) {
    return request.get<API.ListResult<API.KolListItem>>("kol/list", { params });
}

export async function apiKolDetail(id: string) {
    return request.get<API.TResult<API.KolDetail>>(`kol/${id}`);
}

export async function apiKolByPlace(placeId: string, params?: API.KolFilterOptions) {
    return request.get<API.ListResult<API.KolListItem>>("kol/by-place", { params: { placeId, ...params } });
}

export async function apiKolBooking(data: API.KolBookingRequest) {
    return request.post<API.TResult<API.KolBooking>>("kol/booking", data);
}

export async function apiKolBookingList(placeId?: string) {
    return request.get<API.ListResult<API.KolBooking>>("kol/bookings", { params: { placeId } });
}
