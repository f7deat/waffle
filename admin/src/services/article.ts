import { ESortOrder } from '@/constants';
import { request } from '@umijs/max';
import { SortOrder } from 'antd/lib/table/interface';

export type ArticleListItem = {
    id: string;
    name: string;
    description?: string;
    thumbnail?: string;
    publishedAt?: string;
    viewCount: number;
    creatorName?: string;
    creatorAvatar?: string;
    creatorId?: string;
    modifiedDate?: string;
    createdDate: string;
}

export type ArticleDetailType = ArticleListItem & {
    content: string;
}

export async function getArticleById(id: string) {
  return request<API.TResult<ArticleDetailType>>(`article/id/${id}`);
}

export async function getArticleByName(name: string) {
  return request<API.TResult<ArticleListItem>>(`article/${name}`);
}

export async function apiGetArticleChartData() {
  return request('article/chart-data');
}

export async function apiGetMostViewedArticles() {
  return request<API.TResult<ArticleListItem[]>>('article/most-viewed');
}

export async function listArticles(
  params: {
    current?: number;
    pageSize?: number;
    locale?: string;
    name?: string;
  },
  sort: Record<string, SortOrder>
) {
  return request<API.ListResult<ArticleListItem>>('article/list', {
    method: 'GET',
    params: {
      modifiedDate: sort.modifiedDate
        ? sort.modifiedDate === 'ascend'
          ? ESortOrder.Ascending
          : ESortOrder.Descending
        : ESortOrder.Unspecified,
      ...params,
    },
  });
}

export async function getArticleStatistics(locale: string) {
  return request<API.TResult<object>>('article/statistics', {
    method: 'GET',
    params: { locale },
  });
}

export async function getRandomArticles(locale: string) {
  return request<API.TResult<object>>('article/randoms', {
    params: { locale },
  });
}

export async function addArticle(data: {
  name: string;
  description?: string;
}) {
  return request<API.TResult<{ id: string }>>('article', {
    method: 'POST',
    data,
  });
}

export async function updateArticle(data: {
  id: string;
  name: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  publishedAt?: string;
}) {
  return request<API.TResult<object>>('article', {
    method: 'PUT',
    data,
  });
}

export async function deleteArticle(id: string) {
  return request<API.TResult<object>>(`article/${id}`, {
    method: 'DELETE',
  });
}
