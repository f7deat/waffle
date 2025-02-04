import { request } from "@umijs/max";

export async function apiJobApplicationList(params: any) {
    return request(`career/list-application`, { params });
}