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

export async function apiAddUserToRole(data: { id: string; roleName: string }) {
    return request(`user/add-to-role`, {
        method: 'POST',
        data
    })
}

export async function apiRemoveUserFromRole(data: { id: string; roleName: string }) {
    return request(`user/remove-from-role`, {
        method: 'POST',
        data
    })
}