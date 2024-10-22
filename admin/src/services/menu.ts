import { request } from "@umijs/max";

export const apiMenuList = (params: any) => request(`menu/list`, { params });

export const apiMenuAdd = (data: any) => request(`menu/add`, {
    method: 'POST',
    data
})

export const apiMenuUpdate = (data: any) => request(`menu/update`, {
    method: 'POST',
    data
});

export const apiMenuDelete = (id: string) => request(`menu/delete/${id}`, {
    method: 'POST'
});

export const apiMenuGet = (id: string) => request(`menu/${id}`);

export const apiMenuParent = () => request(`menu/parent-options`);