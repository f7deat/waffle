import request from "@/app/services/base-request";

type PublishedArticleApiItem = {
  name?: string;
  normalizedName?: string;
  description?: string;
  thumbnail?: string;
  publishedAt?: string;
};

type ArticleDetailApiItem = {
  id?: string;
  name?: string;
  normalizedName?: string;
  description?: string;
  thumbnail?: string;
  publishedAt?: string;
  content?: string;
};

type ListResultResponse<T> = {
  data?: T[];
  total?: number;
};

type ResultResponse<T> = {
  data?: T;
  succeeded?: boolean;
  message?: string;
};

export type PublishedArticle = {
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  publishedAt: string;
};

export type ArticleDetail = {
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  content: string;
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

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  const response = await request.get<ResultResponse<ArticleDetailApiItem> | ArticleDetailApiItem>(`/article/${slug}`);
  const rawData = response.data;
  const item = (rawData as ResultResponse<ArticleDetailApiItem>)?.data ?? (rawData as ArticleDetailApiItem);

  if (!item?.normalizedName) {
    return null;
  }

  return {
    title: item.name ?? "Tin tức",
    slug: item.normalizedName,
    excerpt: item.description ?? "",
    image: item.thumbnail ?? "/images/news-esg.svg",
    publishedAt: item.publishedAt ?? "",
    content: item.content ?? "",
  };
}