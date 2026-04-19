import { request } from "@umijs/max";

export async function apiProvinceCreate(data: any) {
    return request(`province`, {
        method: 'POST',
        data
    });
}

export async function apiProvinceUpdate(data: any) {
    return request(`province/update`, {
        method: 'PUT',
        data
    });
}

export async function apiProvinceDelete(id: string) {
    return request(`province/delete/${id}`, {
        method: 'DELETE'
    });
}

export async function apiProvinceGet(id: string) {
    return request(`province/${id}`);
}
