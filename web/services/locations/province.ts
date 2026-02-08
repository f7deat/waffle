import request from "../request";

export async function apiProvinceOptions() {
    return request.get<API.IOption[]>("province/options");
}