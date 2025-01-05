import { request } from "@umijs/max";

export async function apiSaveRoom(data: any) {
    return request(`room/save`, {
        method: 'POST',
        data
    });
}

export async function apiGetRoom(catalogId?: string) {
    return request(`room/${catalogId}`);
}