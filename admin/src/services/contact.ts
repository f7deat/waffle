import { request } from '@umijs/max';

export async function listContact() {
  return request(`contact/list`);
}

export async function deleteContact(id: string) {
  return request(`contact/delete/${id}`, {
    method: 'POST',
  });
}
