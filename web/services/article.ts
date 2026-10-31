import { ArticleMeta } from "@/typings/article";
import request from "./request";
import { ArticleAuthorItem, ArticleCategoryItem, ArticleDetail, ArticleFilterOptions, ArticleListItem } from "./typings/article";

export async function apiArticleList(params: ArticleFilterOptions, cookie?: string) {
    return request.get<API.ListResult<ArticleListItem>>("article/published-list", {
        params,
        cookie
    });
}

export async function apiArticleFeatured(cookie?: string) {
    return request.get<API.TResult<ArticleListItem[]>>("article/featured", { cookie });
}

export async function apiArticleTrending(cookie?: string) {
    return request.get<API.TResult<ArticleListItem[]>>("article/trending", { cookie });
}

export async function apiArticlePublishedCategories(cookie?: string) {
    return request.get<API.TResult<ArticleCategoryItem[]>>("article/published-categories", { cookie });
}

export async function apiArticleTopAuthors(cookie?: string) {
    return request.get<API.TResult<ArticleAuthorItem[]>>("article/top-authors", { cookie });
}

export async function apiNewsletterSubscribe(email: string) {
    return request.post<{ succeeded: boolean; total: number }>("newsletter/subscribe", { email });
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