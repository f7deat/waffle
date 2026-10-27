import { request } from '@umijs/max';

export type ArticleScheduleItem = {
  id: string;
  name: string;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  categoryId?: number;
  categoryName?: string;
  creatorId: string;
  creatorName?: string;
  thumbnail?: string;
  viewCount: number;
  isReadyToPublish: boolean;
};

export type ArticleScheduleResponse = {
  articles: ArticleScheduleItem[];
  drafts: ArticleScheduleItem[];
  categories: { id: number; name: string }[];
  authors: { id: string; name: string }[];
};

export type ArticleScheduleParams = {
  from: string;
  to: string;
  locale: string;
  categoryId?: number;
  creatorId?: string;
  status?: 'published' | 'scheduled' | 'needs-review';
};

export async function getArticleSchedule(params: ArticleScheduleParams) {
  return request<ArticleScheduleResponse>('article/schedule', { params });
}

export async function updateArticleSchedule(id: string, scheduledAt?: string) {
  return request<{ id: string; scheduledAt?: string | null }>(`article/${id}/schedule`, {
    method: 'PUT',
    data: { scheduledAt: scheduledAt ?? null },
  });
}
