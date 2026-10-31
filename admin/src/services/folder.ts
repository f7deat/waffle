import { request } from "@umijs/max";

export type FolderTreeItem = {
    id: string;
    parentId?: string | null;
    name: string;
    children: FolderTreeItem[];
};

type CreateFolderRequest = {
    name: string;
    parentId?: string | null;
};

export async function apiAddFolder(data: CreateFolderRequest, locale = 'vi-VN') {
    return request(`folder/add`, {
        method: 'POST',
        data,
        params: { locale },
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

export async function apiFolderTree(params: { locale?: string } = {}) {
    return request<{ data: FolderTreeItem[] }>('folder/tree', {
        method: 'GET',
        params,
    });
}