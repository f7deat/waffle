import { request } from "@umijs/max";

export async function apiAddFolder(data: any) {
    return request(`folder/add`, {
        method: 'POST',
        data
    });
}

export async function apiFolderDelete(id: string) {
    return request(`folder/delete/${id}`, {
        method: 'POST'
    });
}

export async function apiFolderUpdate(data: any) {
    return request(`folder/update`, {
        method: 'POST',
        data
    });
}

export async function apiFolderList(params: {
    current?: number;
    pageSize?: number;
    parentId?: string;
    name?: string;
    locale?: string;
}) {
    return request(`folder/list`, {
        method: 'GET',
        params
    });
}