import { request } from "@umijs/max";

export async function apiBrandList(params: any) {
    return request("brand/admin/list", { params });
}

export async function apiBrandOptions(params?: any) {
    return request("brand/options", { params });
}

export async function apiBrandCreate(data: any) {
    return request("brand", { method: "POST", data });
}

export async function apiBrandUpdate(data: any) {
    return request("brand", { method: "PUT", data });
}

export async function apiBrandDelete(id: number) {
    return request(`brand/${id}`, { method: "DELETE" });
}
