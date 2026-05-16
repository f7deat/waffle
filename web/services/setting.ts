import { SETTINGS } from "@/config/constants";
import request from "./request";
import { SiteSetting } from "@/typings/setting";

export async function apiGetSiteSetting() {
  return request.get<SiteSetting>(`setting/${SETTINGS.SITE}`);
}