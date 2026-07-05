import { EditorJSType } from "./editorjs";

export type ArticleListItem = {
    id: string;
    name: string;
    description: string;
    normalizedName: string;
    modifiedDate: string;
    thumbnail?: string;
    viewCount: number;
    createdDate: string;
}

export type ArticleDetail = ArticleListItem & {
    content: EditorJSType;
}

export type ArticleFilterOptions = FilterOptions & {
    name?: string;
    cookie?: ReadonlyRequestCookies;
}