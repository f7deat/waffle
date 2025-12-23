import request from "./request";

export async function apiCatalogMeta(slug: string) {
    return request.get<API.Meta>(`catalog/meta/${slug}`);
}