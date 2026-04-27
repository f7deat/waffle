import request from "./request";

export async function apiAddComment(data: {
    catalogId: string;
    message: string;
    rating?: number;
}, cookie?: string) {
    return request.post("comment", data, { cookie });
}

export async function apiListComments(params: {
    catalogId: string;
    current?: number;
    pageSize?: number;
}, cookie?: string) {
    return request.get<API.ListResult<API.CommentListItem>>("comment/list", { params, cookie });
}