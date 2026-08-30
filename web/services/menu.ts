import request from "./request";
import { MenuNavItem } from "@/typings/menu";

export async function apiGetMenuList(locale?: string) {
    const response = await request.get<{ data: MenuNavItem[]; total: number }>(`menu/list`, {
        params: locale ? { locale } : undefined,
    });
    return response?.data ?? [];
}
