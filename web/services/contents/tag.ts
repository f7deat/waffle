import request from "../request";

export async function apiTagList(params?: API.TagFilterOptions) {
    return request.get<API.ListResult<API.TagListItem>>("tag/list", { params });
}

export async function apiTagRandoms() {
    return request.get<API.TResult<API.TagListItem>>("tag/randoms");
}

export async function apiGetPlacesByTag(params: API.TagPlacesFilterOptions) {
    return request.get<API.ListResult<API.PlaceListItem>>("tag/places", { params });
}

export async function apiGetArticlesByTag(params: API.TagArticlesFilterOptions) {
    return request.get<API.ListResult<API.ArticleListItem>>("tag/articles", { params });
}

export async function apiGetTagByName(name: string) {
    return request.get<API.TResult<API.TagListItem>>(`tag/normalized-name/${name}`);
}