import request from "./request";

export async function apiAddComment(data: {
    catalogId: string;
    message: string;
}, cookie?: string) {
    return request.post("comment", data, { cookie });
}