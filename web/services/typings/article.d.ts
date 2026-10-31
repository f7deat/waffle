import { EditorJSType } from "./editorjs";

export type ArticleListItem = {
    id: string;
    name: string;
    description: string;
    normalizedName: string;
    modifiedDate: string;
    publishedAt?: string;
    thumbnail?: string;
    viewCount: number;
    createdDate: string;
    categoryId?: number;
    categoryName?: string;
    readingMinutes?: number;
    isFeatured?: boolean;
    creatorName?: string;
    creatorUserName?: string;
    creatorAvatar?: string;
}

export type ArticleCategoryItem = {
    id: number;
    name: string;
    normalizedName?: string;
    count: number;
}

export type ArticleAuthorItem = {
    id: string;
    name?: string;
    userName?: string;
    avatar?: string;
    articleCount: number;
}

export type ArticleDetail = ArticleListItem & {
    content: EditorJSType;
}

export type ArticleFilterOptions = FilterOptions & {
    name?: string;
    categoryId?: number;
    sort?: "latest" | "most-viewed";
    cookie?: ReadonlyRequestCookies;
}