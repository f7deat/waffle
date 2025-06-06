import { request } from '@umijs/max';
import { RcFile } from 'antd/lib/upload';

export async function listFile(
  params: {
    keyword?: string;
    current?: number;
    pageSize?: number;
  },
  type?: string[],
  options?: { [key: string]: any },
) {
  return request(`file/list`, {
    method: 'GET',
    params: {
      type: Object.keys(type ?? []).length > 0 ? type?.join(',') : '',
      ...params,
    },
    ...(options || {}),
  });
}

export async function deleteFileContent(id: string | undefined) {
  return request(`file/delete-file-content/${id}`, {
    method: 'POST',
  });
}

export async function deleteFileItem(data: API.FileItem) {
  return request(`file/delete-file-item`, {
    method: 'POST',
    data,
  });
}

export async function getFileDetail(id: string | undefined) {
  return request<API.FileContent>(`file/${id}`);
}

export async function listWorkItemFiles(
  params: {
    current?: number;
    pageSize?: number;
  },
  options: { id: string | undefined },
) {
  return request(`file/file-items/${options.id}`);
}

export async function uploadRcFile(file: RcFile) {
  const formData = new FormData();
  formData.append('file', file);
  return request(`file/upload`, {
    method: 'POST',
    data: formData,
  });
}

export async function uploadFromUrl(url: string) {
  return request(`file/upload-from-url`, {
    method: 'POST',
    data: {
      url,
    },
  });
}

export async function countFile() {
  return request(`file/count`);
}

export async function totalFileSize() {
  return request(`file/total-size`);
}

export const apiMultiUpload = (data: FormData) => request(`file/muti-upload`, {
  method: 'POST',
  data,
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

export async function api3rdUpload(data: any) {
  return request(`file/3rd-upload`, {
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}