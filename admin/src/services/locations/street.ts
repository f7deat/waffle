import { request } from "@umijs/max";

export async function apiStreetOptions(params: any) {
    return request(`street/options`, { params  });
}

export async function apiStreetList(params: any) {
    return request(`street/list`, { params  });
}

export async function apiStreetCreate(data: any) {
    return request(`street`, {
        method: 'POST',
        data
    });
}