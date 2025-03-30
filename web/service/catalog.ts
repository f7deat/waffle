import request from "./request";

export async function apiCatalogMeta(slug: string) {
    return request.get(`/catalog/meta/${slug}`);
}