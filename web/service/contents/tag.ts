import request from "../request";

export async function apiTagList(params?: API.TagFilterOptions) {
    return request.get<API.ListResult<API.TagListItem>>("tag/list", { params });
}

export async function apiTagRandoms() {
    return request.get<API.TResult<API.TagListItem>>("tag/randoms");
}