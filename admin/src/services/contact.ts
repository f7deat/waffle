import { request } from '@umijs/max';

export async function listContact(params: any) {
  return request(`contact/list`, { params});
}

export async function apiDeleteContact(id: string) {
  return request(`contact/delete/${id}`, {
    method: 'POST',
  });
}
