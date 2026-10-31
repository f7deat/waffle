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
    tags?: { tagId: string; name: string }[];
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
    editorial?: ArticleEditorialDetail;
}

export type ArticleEditorialStop = {
    name: string;
    imageUrl?: string;
    address?: string;
    priceRange?: string;
    openingHours?: string;
    mapsUrl?: string;
    voucher?: string;
}

export type ArticleEditorialDetail = {
    spotlightLabel?: string;
    heroCaption?: string;
    authorName?: string;
    authorHandle?: string;
    authorTitle?: string;
    authorAvatar?: string;
    authorBio?: string;
    readingMinutes?: number;
    topics?: string[];
    routeTitle?: string;
    routeDescription?: string;
    routeAddress?: string;
    routeMapUrl?: string;
    routeDownloadUrl?: string;
    routeStops?: ArticleEditorialStop[];
}

export type ArticleFilterOptions = FilterOptions & {
    name?: string;
    categoryId?: number;
    sort?: "latest" | "most-viewed";
    cookie?: ReadonlyRequestCookies;
}