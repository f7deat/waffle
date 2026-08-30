import { request } from '@umijs/max';

export type Team = {
  id: number;
  name: string;
  departmentId: number;
};

export type TeamInput = Omit<Team, 'id'>;

export async function apiTeamList(params: any) {
  return request('team/list', { params });
}

export async function apiTeamOptions(params?: any) {
  return request('team/options', { params });
}

export async function apiTeamCreate(data: TeamInput) {
  return request('team', {
    method: 'POST',
    data,
  });
}

export async function apiTeamUpdate(id: number, data: TeamInput) {
  return request('team/update', {
    method: 'PUT',
    data: { id, ...data },
  });
}

export async function apiTeamDelete(id: number) {
  return request(`team/delete/${id}`, {
    method: 'DELETE',
  });
}
