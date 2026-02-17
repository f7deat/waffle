import { request } from '@umijs/max';

export async function login(data: any) {
  return request(`user/password-sign-in`, {
    method: 'POST',
    data,
  });
}

export async function queryCurrentUser() {
  return request(`user`);
}

export const apiGetUser = (id: string | undefined) => request(`user/${id}`);

export async function createUser(data: any) {
  return request(`user/create`, {
    method: 'POST',
    data,
  });
}

export async function listUser(params: any) {
  return request(`user/list`, { params });
}

export async function changePassword(data: any) {
  return request(`user/change-password`, {
    method: 'POST',
    data,
  });
}

export async function apiUserDelete(id?: string) {
  return request(`user/${id}`, {
    method: 'DELETE'
  })
}

export async function addToRole(data: any) {
  return request(`user/add-to-role`, {
    method: 'POST',
    data
  });
}

export async function apiConfirmEmail(id?: string | string[]) {
  return request(`user/confirm-email/${id}`, {
    method: 'POST'
  });
}

export const apiUpdateUser = (data: any) => request(`user/update`, {
  method: 'POST',
  data
})

export async function apiResetPassword(data: {
  userId: string;
  newPassword: string;
}) {
  return request(`user/reset-password`, {
    method: 'POST',
    data
  });
}