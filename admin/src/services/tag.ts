import { request } from "@umijs/max";

export interface ITagCreate {
    name: string;
}

export interface ITagUpdate {
    id: string;
    name: string;
}

export interface ITagFilter extends API.IFilter {
    name?: string;
}

export interface ITagListItem {
    id: string;
    name: string;
    catalogCount: number;
}

export async function apiTags(params: ITagFilter) {
    return request<API.ListResult<ITagListItem>>(`tag/list`, { params });
}

export async function apiTagCreate(data: ITagCreate) {
    return request(`tag`, {
        method: "POST",
        data,
    });
}

export async function apiTagUpdate(data: ITagUpdate) {
    return request(`tag`, {
        method: "PUT",
        data,
    });
}

export async function apiTagDelete(id: string) {
    return request(`tag/${id}`, {
        method: "DELETE",
    });
}

export async function apiTagDetail(id: string) {
    return request(`tag/${id}`);
}

export async function apiTagOptions(params: any) {
    return request(`tag/options`, { params });
}