import { request } from "@umijs/max";

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