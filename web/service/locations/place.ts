import request from "../request";

export async function apiPlaceList(params?: API.PlaceFilterOptions) {
    return request.get<API.ListResult<API.PlaceListItem>>("place/list", { params });
}