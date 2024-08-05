import { request } from '@umijs/max';

export async function listOrder(params: any) {
  return request(`order/list`, {
    params,
  });
}

export async function queryOrder(id?: string | string[]) {
  return request(`order/${id}`);
}

export async function deleteOrder(id?: string | string []) {
  return request(`order/delete/${id}`, {
    method: 'POST'
  });
}

export async function apiTotalOrder() {
  return request(`order/count`);
}