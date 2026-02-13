import request from "./request";

export async function apiArticleList(params: API.ArticleFilterOptions) {
    return request.server.get<API.ListResult<API.ArticleListItem>>("article/list", { params });
}

export async function apiArticleDetail(normalizedName: string) {
    return request.server.get<API.TResult<API.ArticleDetail>>(`article/${normalizedName}`);
}