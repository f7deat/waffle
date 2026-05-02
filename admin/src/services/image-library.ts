import { request } from '@umijs/max';

export async function apiImageAlbumList(params?: { current?: number; pageSize?: number; keyword?: string }) {
  return request('imagelibrary/albums', {
    method: 'GET',
    params,
  });
}

export async function apiImageAlbumCreate(data: { name: string; description?: string }) {
  return request('imagelibrary/album', {
    method: 'POST',
    data,
  });
}

export async function apiImageAlbumUpdate(id: string, data: { name: string; description?: string }) {
  return request(`imagelibrary/album/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function apiImageAlbumDelete(id: string) {
  return request(`imagelibrary/album/${id}`, {
    method: 'DELETE',
  });
}

export async function apiAlbumImageList(albumId: string, params?: { current?: number; pageSize?: number }) {
  return request(`imagelibrary/album/${albumId}/images`, {
    method: 'GET',
    params,
  });
}

export async function apiAlbumImageUpload(albumId: string, data: FormData) {
  return request(`imagelibrary/album/${albumId}/images`, {
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiAlbumImageDelete(imageId: string) {
  return request(`imagelibrary/image/${imageId}`, {
    method: 'DELETE',
  });
}