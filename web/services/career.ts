import request from "./request";

type CareerFilterOptions = API.FilterOptions;

export async function apiCareerList(params: CareerFilterOptions, cookie?: string) {
    return request.get<API.ListResult<API.CareerListItem>>("career/list-published-opportunity", {
        params,
        cookie,
    });
}

export async function apiCareerDetail(normalizedName: string, cookie?: string) {
    return request.get<API.TResult<API.CareerDetailItem>>(`career/opportunity/${normalizedName}`, {
        cookie,
    });
}
