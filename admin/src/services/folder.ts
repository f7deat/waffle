import { request } from "@umijs/max";

export async function apiAddFolder(data: any) {
    return request(`folder/add`, {
        method: 'POST',
        data
    });
}