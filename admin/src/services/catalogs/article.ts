import { request } from "@umijs/max";

export async function apiArticleStatistics() {
    return request(`article/statistics`);
}