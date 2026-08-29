import { request } from '@umijs/max';

export async function listSetting(params: any) {
  return request(`setting/list`, {
    params
  });
}

export async function testTelegram(data: any) {
  return request(`setting/telegram/test`, {
    method: 'POST',
    data,
  });
}

export async function getTelegramUpdates() {
  return request(`setting/telegram/updates`);
}

export async function saveSocial(data: any) {
  return request(`setting/social/save`, {
    method: 'POST',
    data,
  });
}

//#region Facebook
export async function facebookSave(data: API.Facebook) {
  return request(`setting/facebook/save`, {
    method: 'POST',
    data,
  });
}
//#endregion

//#region SendGrid

export async function saveSendGrid(data: any) {
  return request(`setting/sendgrid/save`, {
    method: 'POST',
    data,
  });
}

//#endregion

export async function listSidebarWork(params: any) {
  return request(`setting/sidebar`, {
    params,
  });
}

export async function workAddSetting(data: any) {
  return request(`setting/work/add`, {
    method: 'POST',
    data,
  });
}

export async function apiGetSetting(id: string | undefined) {
  return request(`setting/${id}`);
}

export async function querySetting(normalizedName: string) {
  return request(`setting/unix/${normalizedName}`);
}

export async function apiSaveSetting(data: any) {
  return request(`setting`, {
    method: 'PUT',
    data,
  });
}

export async function querySaveSetting(normalizedName: string, data: any) {
  return request(`setting/unix/save/${normalizedName}`, {
    method: 'POST',
    data,
  });
}

export async function graphFacebook(query: string) {
  return request(`setting/graph-api-explorer?query=${query}`);
}

export async function queryThemeOptions() {
  return request(`setting/themes/options`);
}

export async function apiInitializeSettings() {
  return request(`setting/initialize`, {
    method: 'POST',
  });
}

export async function apiDeleteSetting(id: string) {
  return request(`setting/${id}`, {
    method: 'DELETE',
  });
}

export async function apiGetSettingByName(normalizedName: string) {
  return request(`setting/${normalizedName}`);
}