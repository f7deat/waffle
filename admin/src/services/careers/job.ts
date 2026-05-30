import { request } from "@umijs/max";

export interface IJobOpportunityFilter extends API.IFilter {
    jobLocation?: string;
}

export async function apiSaveJobOpportunity(data: any) {
    return request(`/career/save`, {
        method: 'POST',
        data
    })
}

export async function apiJobOpportunityList(params: IJobOpportunityFilter) {
    return request(`career/list-opportunity`, { params });
}

export async function apiDeleteJobOpportunity(id: string) {
    return request(`career/${id}`, {
        method: 'DELETE'
    });
}