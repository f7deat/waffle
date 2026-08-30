import { request } from '@umijs/max';

export type Branch = {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
};

export type BranchInput = Omit<Branch, 'id'>;

export async function apiBranchList(params: any) {
  return request('branch/list', { params });
}

export async function apiBranchOptions(params?: any) {
  return request('branch/options', { params });
}

export async function apiBranchCreate(data: BranchInput) {
  return request('branch', {
    method: 'POST',
    data,
  });
}

export async function apiBranchUpdate(id: number, data: BranchInput) {
  return request('branch/update', {
    method: 'PUT',
    data: { id, ...data },
  });
}

export async function apiBranchDelete(id: number) {
  return request(`branch/delete/${id}`, {
    method: 'DELETE',
  });
}
