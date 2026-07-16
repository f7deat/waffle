import { request } from "@umijs/max";

export interface IPlaceFilter extends API.IFilter {
    name?: string;
    districtId?: number;
}

export interface IPlaceListItem {
    id: string;
    name: string;
    address?: string;
    districtId?: number;
    districtName?: string;
    provinceId?: number;
    provinceName?: string;
    modifiedDate?: string;
    thumbnail?: string;
}

export async function apiPlaceList(params: IPlaceFilter) {
    return request<API.ListResult<IPlaceListItem>>(`place/list`, { params });
}

export interface IPlaceCreate {
    name: string;
    description?: string;
    active: boolean;
}

export async function apiPlaceCreate(data: IPlaceCreate) {
    return request(`place`, {
        method: 'POST',
        data
    });
}

export async function apiPlaceDelete(id: string) {
    return request(`place/${id}`, {
        method: 'DELETE'
    });
}

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