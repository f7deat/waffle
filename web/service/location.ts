import axios from "axios";
import request from "./request";

export async function apiLocationList(params: { current: number }) {
    return axios.get(`https://defzone.net/api/catalog/list?current=${params.current}`);
}

export async function apiCityList() {
    return axios.get(`https://provinces.open-api.vn/api/`);
}