import { request } from '@umijs/max';

export type ShortLinkItem = {
  id: string;
  code: string;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdDate: string;
  lastAccessedDate?: string;
};

export async function listShortLink() {
  return request<{ data: ShortLinkItem[]; total: number }>('shortlink/list');
}

export async function createShortLink(url: string) {
  return request<ShortLinkItem>('shortlink/create', {
    method: 'POST',
    data: {
      url,
    },
  });
}

export async function deleteShortLink(id: string) {
  return request('shortlink/delete/' + id, {
    method: 'POST',
  });
}

export async function clearShortLink() {
  return request('shortlink/clear', {
    method: 'POST',
  });
}
