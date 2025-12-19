import { request } from "@umijs/max";

export async function apiStreetOptions(params: any) {
    return request(`street/options`, { params  });
}

export async function apiStreetList(params: any) {
    return request(`street/list`, { params  });
}