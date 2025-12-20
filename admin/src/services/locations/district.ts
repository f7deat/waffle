import { request } from "@umijs/max";

export async function apiDistrictOptions(params: any) {
    return request(`district/options`, { params  });
}

export async function apiDistrictList(params: any) {
    return request(`district/list`, { params  });
}

export async function apiDistrictCreate(data: any) {
    return request(`district`, {
        method: 'POST',
        data
    });
}