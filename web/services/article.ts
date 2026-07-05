import { ArticleMeta } from "@/typings/article";
import request from "./request";
import { ArticleDetail, ArticleFilterOptions } from "./typings/article";

export async function apiArticleList(params: ArticleFilterOptions, cookie?: string) {
    return request.get<API.ListResult<ArticleDetail>>("article/published-list", {
        params,
        cookie
    });
}

export async function apiArticleDetail(normalizedName: string) {
    return request.get<API.TResult<ArticleDetail>>(`article/${normalizedName}`);
}

export async function apiArticleRandoms() {
    return request.get<API.ListResult<ArticleDetail>>("article/randoms");
}

export async function apiArticleMeta(normalizedName: string) {
    return request.get<API.TResult<ArticleMeta>>(`article/meta/${normalizedName}`);
}