import { request } from "@umijs/max";

export async function apiPlaceDetails(id?: string) {
    return request(`place/details/${id}`);
}

export async function apiPlaceUpdate(data: any) {
    return request(`place`, {
        method: 'PUT',
        data
    });
}

export async function apiPlaceAddImages(formData: FormData) {
    return request(`place/images`, {
        method: 'POST',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
}

export async function apiPlaceDeleteImage(imageId: string) {
    return request(`place/image/${imageId}`, {
        method: 'DELETE'
    });
}

export async function apiPlaceImageList(placeId: string) {
    return request(`place/images`, {
        method: 'GET',
        params: {
            placeId
        }
    });
}