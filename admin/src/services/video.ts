import { request } from '@umijs/max';

export async function apiVideoList(params?: any) {
  return request('video/list', {
    params,
  });
}

export async function apiVideoUpload(data: FormData) {
  return request('video/upload', {
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiVideoCreateExternal(data: {
  name?: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
}) {
  return request('video/external', {
    method: 'POST',
    data,
  });
}

export async function apiVideoUpdate(id: string, data: {
  name?: string;
  description?: string;
  url?: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
}) {
  return request(`video/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function apiVideoDelete(id: string) {
  return request(`video/${id}`, {
    method: 'DELETE',
  });
}
