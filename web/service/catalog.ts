import request from "./request";

export async function apiCatalogMeta(slug: string) {
    return request.get<API.Meta>(`catalog/meta/${slug}`);
}

export async function apiCatalogTags(catalogId: string) {
    return request.get<API.TResult<API.Tag[]>>(`catalog/tags`, {
        params: { catalogId },
    });
}