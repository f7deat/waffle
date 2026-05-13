import { AlbumPhoto } from "@/typings/album";
import request from "./request";

export async function apiGetAlbumPhotos() {
    return await request.get<API.ListResult<AlbumPhoto>>("/album/photos", {
        params: {
            current: 1,
            pageSize: 5
        }
    });
}
