import { request } from "@umijs/max";

export async function apiCountryCreate(data: any) {
    return request(`country`, {
        method: 'POST',
        data
    });
}