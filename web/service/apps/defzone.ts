import axios from "axios";

export async function apiCatalogList(params: { current: number }) {
    return axios.get(`https://defzone.net/api/catalog/list`, {
        params: {
            ...params,
            pageSize: 20,
            locale: 'vi-VN'
        }
    });
}