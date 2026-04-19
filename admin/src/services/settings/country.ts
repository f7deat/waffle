import { request } from "@umijs/max";

export async function apiCountryCreate(data: any) {
    return request(`country`, {
        method: 'POST',
        data
    });
}

export async function apiCountryUpdate(data: any) {
    return request(`country`, {
        method: 'PUT',
        data
    });
}

export async function apiCountryDelete(id: string) {
    return request(`country/${id}`, {
        method: 'DELETE'
    });
}

export async function apiCountryGet(id: string) {
    return request(`country/${id}`);
}