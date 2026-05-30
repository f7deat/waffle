import { request } from "@umijs/max";

export async function apiJobApplicationList(params: any) {
    return request(`career/list-application`, { params });
}

export async function apiUpdateJobApplicationStatus(id: string, status: number) {
    return request(`career/application/${id}/status`, {
        method: "PUT",
        data: { status }
    });
}

export async function apiDeleteJobApplication(id: string) {
    return request(`career/delete-application/${id}`, {
        method: "POST"
    });
}