declare namespace API {
    interface TagFilterOptions extends FilterOptions {
        name?: string;
    }
    interface TagListItem {
        id: string;
        name: string;
        normalizedName: string;
    }
}