import request from "@/app/services/base-request";

type PublishedArticleApiItem = {
  name?: string;
  normalizedName?: string;
  description?: string;
  thumbnail?: string;
  publishedAt?: string;
};

type ListResultResponse<T> = {
  data?: T[];
  total?: number;
};

export type PublishedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  publishedAt: string;
};

export async function getPublishedArticles(params?: {
  current?: number;
  pageSize?: number;
  locale?: string;
}) {
  const response = await request.get<ListResultResponse<PublishedArticleApiItem>>("/article/published-list", {
    params: {
      current: params?.current ?? 1,
      pageSize: params?.pageSize ?? 3,
      locale: params?.locale ?? "vi-VN",
    },
  });

  const items = response.data?.data ?? [];

  return items.map((item) => ({
    title: item.name ?? "Tin tức",
    slug: item.normalizedName ?? "",
    excerpt: item.description ?? "",
    image: item.thumbnail ?? "",
    publishedAt: item.publishedAt ?? "",
  }));
}