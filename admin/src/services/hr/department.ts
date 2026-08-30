import { request } from '@umijs/max';

export type Department = {
  id: number;
  name: string;
  branchId: number;
};

export type DepartmentInput = Omit<Department, 'id'>;

export async function apiDepartmentList(params: any) {
  return request('department/list', { params });
}

export async function apiDepartmentOptions(params?: any) {
  return request('department/options', { params });
}

export async function apiDepartmentCreate(data: DepartmentInput) {
  return request('department', {
    method: 'POST',
    data,
  });
}

export async function apiDepartmentUpdate(id: number, data: DepartmentInput) {
  return request('department/update', {
    method: 'PUT',
    data: { id, ...data },
  });
}

export async function apiDepartmentDelete(id: number) {
  return request(`department/delete/${id}`, {
    method: 'DELETE',
  });
}
