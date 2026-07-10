import { request } from "@umijs/max";

export interface IJobOpportunityFilter extends API.IFilter {
    jobLocation?: string;
}

export async function apiJobOpportunityList(params: IJobOpportunityFilter) {
    return request(`career/list-opportunity`, { params });
}

export async function apiDeleteJobOpportunity(id: string) {
    return request(`career/${id}`, {
        method: 'DELETE'
    });
}

export async function apiJobOpportunityAdd(data: any) {
    return request(`career`, {
        method: 'POST',
        data
    });
}

export async function apiJobOpportunityUpdate(data: any) {
    return request(`career`, {
        method: 'PUT',
        data
    });
}

export async function apiJobOpportunityDetail(id: string) {
    return request(`career/${id}`);
}