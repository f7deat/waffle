import { RoleDetailType, RoleUserListItem } from "@/typings/role";
import { request } from "@umijs/max";

export async function listRole(params: any) {
    return request(`role/list`, {
        params
    })
}

export async function apiRoleUsers(params: any) {
    return request<API.ListResult<RoleUserListItem>>(`role/users`, {
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

export async function apiRoleDetail(id?: string) {
    return request<API.TResult<RoleDetailType>>(`role/find-by-id/${id}`);
}

export async function apiRoleByName(name?: string) {
    return request<API.TResult<RoleDetailType>>(`role/find-by-name/${name}`);
}