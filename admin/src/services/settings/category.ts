import { request } from '@umijs/max';

export async function apiCategoryList(params: any) {
  return request('category/list', { params });
}

export async function apiCategoryCreate(data: any) {
  return request('category', {
    method: 'POST',
    data,
  });
}

export async function apiCategoryUpdate(data: any) {
  return request('category', {
    method: 'PUT',
    data,
  });
}

export async function apiCategoryDelete(id: number | string) {
  return request(`category/${id}`, {
    method: 'DELETE',
  });
}

export async function apiCategoryGet(id: number | string) {
  return request(`category/${id}`);
}

export async function apiCategoryOptions(params?: any) {
  return request('category/options', { params });
}

type CategoryTreeOption = {
  label: string;
  value: number;
  parentId?: number | null;
  children?: CategoryTreeOption[];
}

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
