import { request } from "@umijs/max";

export async function apiDistrictOptions(params: any) {
    return request(`district/options`, { params  });
}

export async function apiDistrictList(params: any) {
    return request(`district/list`, { params  });
}