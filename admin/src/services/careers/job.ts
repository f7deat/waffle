import { request } from "@umijs/max";

export async function apiSaveJobOpportunity(data: any) {
    return request(`/career/save`, {
        method: 'POST',
        data
    })
}