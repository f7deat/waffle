import { request } from '@umijs/max';

export type WebsiteBlockType = 'hero' | 'richText' | 'featureGrid' | 'image' | 'cta' | 'row' | 'col';

export type WebsiteBlock = {
  id: string;
  type: WebsiteBlockType;
  hidden?: boolean;
  settings: Record<string, string>;
  children?: WebsiteBlock[];
};

export type WebsiteDocument = {
  version: number;
  updatedAt?: string;
  blocks: WebsiteBlock[];
};

export async function getWebsiteHomeForEditing() {
  return request<{ content: WebsiteDocument; isPublished: boolean }>('website-page/home/edit');
}

export async function saveWebsiteHome(data: { content: WebsiteDocument; isPublished: boolean }) {
  return request<{ succeeded: boolean }>('website-page/home', {
    method: 'PUT',
    data,
  });
}