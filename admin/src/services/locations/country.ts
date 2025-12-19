import { request } from "@umijs/max";

export async function apiCountryList(params: any) {
    return request(`country/list`, { params  });
}