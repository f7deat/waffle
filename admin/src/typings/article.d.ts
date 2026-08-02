export type ArticleListItem = {
    id: string;
    name: string;
    description?: string;
    thumbnail?: string;
    publishedAt?: string;
    viewCount: number;
    creatorName?: string;
    creatorAvatar?: string;
    creatorId?: string;
    modifiedDate?: string;
    createdDate: string;
}

export type ArticleDetailType = ArticleListItem & {
    content: string;
}