import { request } from '@umijs/max';

export type CategoryOption = {
  label: string;
  value: number;
  parentId?: number | null;
};

export type CategoryTreeItem = {
  id: number;
  name: string;
  description?: string | null;
  normalizedName?: string | null;
  parentId?: number | null;
  type: number;
  locale: string;
  children: CategoryTreeItem[];
};

export type SaveCategoryRequest = {
  id?: number;
  name: string;
  description?: string;
  parentId?: number | null;
  type: number;
  locale: string;
};

type CategoryApiResult = {
  succeeded: boolean;
  message?: string;
};

type CategoryResponse = Omit<SaveCategoryRequest, 'id'> & {
  id: number;
  normalizedName?: string | null;
};

export async function apiCategoryList(params: Record<string, unknown>) {
  return request('category/list', { params });
}

export async function apiCategoryTree(params?: { locale?: string; name?: string; type?: number }) {
  return request<{ data: CategoryTreeItem[] }>('category/tree', { params });
}

export async function apiCategoryCreate(data: SaveCategoryRequest) {
  return request<CategoryApiResult>('category', {
    method: 'POST',
    params: { locale: data.locale || 'vi-VN' },
    data,
  });
}

export async function apiCategoryUpdate(data: SaveCategoryRequest) {
  return request<CategoryApiResult>('category', {
    method: 'PUT',
    data,
  });
}

export async function apiCategoryDelete(id: number | string) {
  return request<CategoryApiResult>(`category/${id}`, {
    method: 'DELETE',
  });
}

export async function apiCategoryGet(id: number | string) {
  return request<CategoryApiResult & { data: CategoryResponse }>(`category/${id}`);
}

export async function apiCategoryOptions(params?: Record<string, unknown>) {
  return request<CategoryOption[]>('category/options', { params });
}

type CategoryTreeOption = CategoryOption & { children?: CategoryTreeOption[] };

export async function apiArticleCategoryTreeOptions(params: { locale?: string }) {
  const options = await apiCategoryOptions({ ...params, type: 1 }) as CategoryTreeOption[];
  const optionsById = new Map<number, CategoryTreeOption>();

  options.forEach((option) => {
    optionsById.set(option.value, { ...option, children: [] });
  });

  const tree: CategoryTreeOption[] = [];
  options.forEach((option) => {
    const node = optionsById.get(option.value)!;
    const parent = option.parentId == null ? undefined : optionsById.get(option.parentId);
    if (parent) {
      parent.children!.push(node);
    } else {
      tree.push(node);
    }
  });

  return tree;
}
