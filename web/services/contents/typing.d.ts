declare namespace API {
    interface TagFilterOptions extends FilterOptions {
        name?: string;
    }
    interface TagListItem {
        id: string;
        name: string;
        normalizedName: string;
    }
    interface TagPlacesFilterOptions extends FilterOptions {
        normalizedName: string;
    }
    interface TagArticlesFilterOptions extends FilterOptions {
        normalizedName: string;
    }
}