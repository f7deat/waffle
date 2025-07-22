import { request } from "@umijs/max";

export async function apiAddFolder(data: any) {
    return request(`folder/add`, {
        method: 'POST',
        data
    });
}

export async function apiFolderDelete(id: string) {
    return request(`folder/delete/${id}`, {
        method: 'DELETE'
    });
}