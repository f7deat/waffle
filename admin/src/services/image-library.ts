import { request } from '@umijs/max';

export async function apiImageAlbumList(params?: any) {
  return request('album/list', {
    params,
  });
}

export async function apiImageAlbumCreate(data: { name: string; description?: string }) {
  return request('album', {
    method: 'POST',
    data,
  });
}

export async function apiImageAlbumUpdate(data: any) {
  return request(`album`, {
    method: 'PUT',
    data,
  });
}

export async function apiImageAlbumDelete(id: string) {
  return request(`album/${id}`, {
    method: 'DELETE',
  });
}

export async function apiAlbumImageList(params: any) {
  return request(`album/photos`, {
    params,
  });
}

export async function apiAlbumImageUpload(albumId: string, data: FormData) {
  return request(`album/photos/${albumId}`, {
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function apiAlbumImageDelete(imageId: string) {
  return request(`album/photo/${imageId}`, {
    method: 'DELETE',
  });
}