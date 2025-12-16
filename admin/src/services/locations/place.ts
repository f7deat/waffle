import { request } from "@umijs/max";

export async function apiPlaceDetails(id?: string) {
    return request(`place/${id}`);
}

export async function apiPlaceUpdate(data: any) {
    return request(`place`, {
        method: 'PUT',
        data
    });
}