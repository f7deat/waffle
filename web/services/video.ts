import request from "./request";

export interface VideoItem {
    id: string;
    name: string;
    description?: string;
    url: string;
    thumbnailUrl?: string;
    sourceType: 0 | 1;
    provider?: string;
    durationSeconds?: number;
    createdDate: string;
}

export interface VideoListParams {
    current: number;
    pageSize: number;
    keyword?: string;
    provider?: string;
    sourceType?: number;
}

export interface VideoListResult {
    data: VideoItem[];
    total: number;
    current: number;
    pageSize: number;
}

export async function apiVideoList(params: VideoListParams) {
    return request.get<VideoListResult>("video/list", { params });
}