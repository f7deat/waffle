import { request } from "@umijs/max";

export async function apiAddToCollection(data: any) {
    return request(`collection/add`, {
        method: 'POST',
        data
    })
}

export async function apiListCatalogByCollection(params: any) {
    return request(`collection/list-catalog`, { params })
}

export async function apiListCollectionByCatalog(params: any) {
    return request(`collection/list-by-catalog`, { params })
}

export async function apiUpdateCatalogCollection(data: any) {
    return request(`collection/update`, {
        method: 'POST',
        data
    })
}