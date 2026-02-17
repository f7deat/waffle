import request from "../request";

export async function apiTagList(params?: API.TagFilterOptions) {
    return request.server.get<API.ListResult<API.TagListItem>>("tag/list", { params });
}

export async function apiTagRandoms() {
    return request.server.get<API.TResult<API.TagListItem>>("tag/randoms");
}

export async function apiGetPlacesByTag(params: API.TagPlacesFilterOptions) {
    return request.server.get<API.ListResult<API.PlaceListItem>>("tag/places", { params });
}

export async function apiGetArticlesByTag(params: API.TagArticlesFilterOptions) {
    return request.server.get<API.ListResult<API.ArticleListItem>>("tag/articles", { params });
}

export async function apiGetTagByName(name: string) {
    return request.server.get<API.TResult<API.TagListItem>>(`tag/normalized-name/${name}`);
}