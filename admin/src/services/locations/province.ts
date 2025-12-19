import { request } from "@umijs/max";

export async function apiProvinceOptions(params: any) {
    return request(`province/options`, { params  });
}

export async function apiProvinceList(params: any) {
    return request(`province/list`, { params  });
}