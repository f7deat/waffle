import { request } from '@umijs/max';

export type Partner = {
  id: string;
  name: string;
  logo: string;
  url: string;
};

export type PartnerInput = Omit<Partner, 'id'>;

export async function apiPartnerList() {
  return request<{ data: Partner[]; total: number; success: boolean }>('partner/list');
}

export async function apiPartnerCreate(data: PartnerInput) {
  return request<Partner>('partner/create', {
    method: 'POST',
    data,
  });
}

export async function apiPartnerUpdate(id: string, data: PartnerInput) {
  return request<Partner>(`partner/${id}`, {
    method: 'PUT',
    data,
  });
}

export async function apiPartnerDelete(id: string) {
  return request(`partner/${id}`, {
    method: 'DELETE',
  });
}