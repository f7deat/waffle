import { request } from "@umijs/max";

export async function listRole(params: any) {
    return request(`role/list`, {
        params
    })
}

export async function apiRoleUsers(params: { roleName: string; name?: string; userName?: string; }) {
    return request<API.ListResult<API.RoleUserListItem>>(`role/users`, {
        params
    })
}