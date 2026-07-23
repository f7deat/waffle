import { request } from "@umijs/max";

export async function apiProductList(params: any) {
    return request(`product/list`, {
        params,
    });
}

export async function apiListLinkByProductId(params: any, productId: string | undefined) {
    return request(`product/list-link/${productId}`);
}

export async function apiAddProductLink(data: any) {
    return request(`product/add-link`, {
        method: 'POST',
        data
    });
}

export async function apiDeleteProductLink(id: string) {
    return request(`product/delete-link/${id}`, {
        method: 'POST'
    })
}

export async function apiProductCount() {
    return request(`product/count`);
}

export async function apiProductOptions(params?: any) {
    return request(`product/options`, {
        params
    });
}

export async function apiProductSave(data: any) {
    return request(`product/save`, {
        method: 'POST',
        data
    });
}

export async function apiProductDelete(id?: string) {
    return request(`product/delete/${id}`, {
        method: 'POST',
    });
}

export async function apiProductDetail(id?: string) {
    return request(`product/${id}`);
}

export async function apiProductVariants(id?: string) {
    return request(`product/${id}/variants`);
}

export async function apiProductSaveVariants(id: string, data: any[]) {
    return request(`product/save-variants/${id}`, {
        method: 'POST',
        data,
    });
}

export async function apiProductTags(id?: string) {
    return request(`product/${id}/tags`);
}

export async function apiProductSaveTags(id: string, tagIds: string[]) {
    return request(`product/save-tags/${id}`, {
        method: 'POST',
        data: tagIds,
    });
}