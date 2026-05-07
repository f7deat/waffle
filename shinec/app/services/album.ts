import request from "@/app/services/base-request";

export async function apiGetAlbumPhotos() {
  const response = await request.get("/album/photos", {
    params: {
        current: 1,
        pageSize: 5
    }
  });
  return response.data;
}
