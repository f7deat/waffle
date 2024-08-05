import { request } from "@umijs/max";

export async function queryLogs() {
  return request(`log/list`);
}

export async function deleteLog(logId: string) {
  return request(`log/delete/${logId}`, {
    method: 'POST'
  });
}