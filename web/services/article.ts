import request from "./request";

export async function apiArticleList(params: API.ArticleFilterOptions) {
    return request.get<API.ListResult<API.ArticleListItem>>("article/list", { params });
}

export async function apiArticleDetail(normalizedName: string) {
    return request.get<API.TResult<API.ArticleDetail>>(`article/${normalizedName}`);
}