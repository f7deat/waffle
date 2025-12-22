import request from "../request";

export async function apiStreetList(params: API.StreetFilterOptions) {
    return request.get<API.ListResult<API.StreetListItem>>("street/list", { params });
}

export async function apiStreetDetail(id: number) {
    return request.get<API.Street>(`street/${id}`);
}