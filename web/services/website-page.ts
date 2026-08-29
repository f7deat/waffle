import request from './request';

export type WebsiteBlockType = 'hero' | 'richText' | 'featureGrid' | 'image' | 'cta';

export type WebsiteBlock = {
  id: string;
  type: WebsiteBlockType;
  hidden?: boolean;
  settings: Record<string, string>;
};

export type WebsiteDocument = {
  version: number;
  updatedAt?: string;
  blocks: WebsiteBlock[];
};

export type PublishedWebsitePage = {
  content: WebsiteDocument;
  isPublished: boolean;
};

export async function apiGetPublishedHomePage() {
  return request.get<PublishedWebsitePage>('website-page/home');
}