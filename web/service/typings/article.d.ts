declare namespace API {
    interface ArticleListItem {
        id: string;
        name: string;
        description: string;
        normalizedName: string;
        modifiedDate: string;
        thumbnail?: string;
        viewCount: number;
    }
    interface ArticleDetail extends ArticleListItem {
        content: API.BlockEditor;
    }
}