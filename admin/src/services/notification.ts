import { request } from '@umijs/max';

export async function createNotification(data: {
  title: string;
  content?: string;
  actionUrl?: string;
  type: number;
  allUsers?: boolean;
  roleName?: string;
  userIds?: string[];
}) {
  return request('notification/create', {
    method: 'POST',
    data,
  });
}

export async function queryNotificationList(params?: {
  current?: number;
  pageSize?: number;
  searchTerm?: string;
}) {
  return request('notification/list', {
    params,
  });
}

export async function queryUnreadNotificationCount() {
  return request<API.TResult<number>>('notification/unread-count');
}

export async function markNotificationAsRead(id: string) {
  return request('notification/mark-as-read/' + id, {
    method: 'POST',
  });
}

export async function markAllNotificationAsRead() {
  return request('notification/mark-all-as-read', {
    method: 'POST',
  });
}