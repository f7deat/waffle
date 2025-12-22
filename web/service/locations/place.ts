import request from "../request";

export async function apiPlaceList(params?: API.FilterOptions) {
    return request.get<API.ListResult<API.PlaceListItem>>("place/list", { params });
}