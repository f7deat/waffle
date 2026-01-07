import request from "../request";

export async function apiDistrictList(params: API.FilterOptions) {
    return request.get<API.ListResult<API.DistrictListItem>>("district/list", { params });
}

export async function apiDistrictOptions(provinceId: number) {
    return request.get<API.IOption[]>("district/options", { params: { provinceId } });
}