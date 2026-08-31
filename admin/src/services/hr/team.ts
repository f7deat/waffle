import { request } from '@umijs/max';

export type Team = {
  id: number;
  name: string;
  departmentId: number;
};

export type TeamInput = Omit<Team, 'id'>;

export type TeamMember = {
  id: string;
  userName: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
  avatar?: string;
  createdAt: string;
};

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

export async function apiTeamGet(id: number) {
  return request(`team/${id}`);
}

export async function apiTeamMemberList(teamId: number, params: any) {
  return request(`team/${teamId}/members`, { params });
}

export async function apiTeamAddMember(teamId: number, userId: string) {
  return request(`team/${teamId}/members`, {
    method: 'POST',
    data: { userId },
  });
}

export async function apiTeamRemoveMember(teamId: number, userId: string) {
  return request(`team/${teamId}/members/${userId}`, {
    method: 'DELETE',
  });
}
