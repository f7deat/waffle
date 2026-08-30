export type MenuNavItem = {
    id: string;
    name: string;
    url?: string;
    sortOrder: number;
    active: boolean;
    icon?: string;
    children?: MenuNavItem[];
};
