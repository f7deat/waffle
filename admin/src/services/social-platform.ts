import { request } from '@umijs/max';

export type SocialPlatform = {
  id: string;
  code: string;
  name: string;
  isActive: boolean;
};

export type SocialPlatformInput = Omit<SocialPlatform, 'id'>;

export async function apiSocialPlatformList() {
  return request<{ data: SocialPlatform[]; total: number; success: boolean }>('socialplatform/list');
}

export async function apiSocialPlatformCreate(data: SocialPlatformInput) {
  return request<SocialPlatform>('socialplatform/create', {
    method: 'POST',
    data,
  });
}

export async function apiSocialPlatformUpdate(id: string, data: SocialPlatformInput) {
  return request<SocialPlatform>(`socialplatform/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function apiSocialPlatformDelete(id: string) {
  return request(`socialplatform/${id}`, {
    method: 'DELETE',
  });
}
