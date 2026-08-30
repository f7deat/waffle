import { SETTINGS } from "@/config/constants";
import request from "./request";
import { FooterSetting, HeaderSetting, SiteSetting } from "@/typings/setting";

export async function apiGetSiteSetting() {
  return request.get<SiteSetting>(`setting/${SETTINGS.SITE}`);
}

export async function apiGetHeaderSetting() {
  return request.get<HeaderSetting>(`setting/${SETTINGS.HEADER}`);
}

export async function apiGetFooterSetting() {
  return request.get<FooterSetting>(`setting/${SETTINGS.FOOTER}`);
}