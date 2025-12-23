import request from "../request";

export async function apiPlaceList(params?: API.PlaceFilterOptions) {
    return request.get<API.ListResult<API.PlaceListItem>>("place/list", { params });
}

export async function apiPlaceDetail(id: string) {
    return request.get<API.TResult<API.PlaceDetail>>(`place/${id}`);
}

export async function apiPlaceRandom(params?: API.PlaceFilterOptions) {
    return request.get<API.TResult<API.PlaceListItem[]>>(`place/random`, { params });
}

export async function apiPlaceImages(placeId: string) {
    return request.get<API.TResult<API.PlaceImage[]>>(`place/images`, { params: { placeId } });
}