import request from "../request";

export async function apiProvinceList(params: API.ProvinceFilterOptions) {
    return request.get<API.ListResult<API.ProvinceListItem>>("province/list", { params });
}

export async function apiProvinceOptions() {
    return request.get<API.IOption[]>("province/options");
}