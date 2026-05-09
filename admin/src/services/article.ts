import { ESortOrder } from '@/constants';
import { request } from '@umijs/max';
import { SortOrder } from 'antd/lib/table/interface';

export async function getArticleById(id: string) {
  return request<API.TResult<API.Article>>(`article/id/${id}`);
}

export async function getArticleByName(name: string) {
  return request<API.TResult<API.Article>>(`article/${name}`);
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
  return request<API.ListResult<API.Article>>('article/list', {
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
  return request<API.TResult<object>>('article', {
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
