import axios from "axios";

export async function apiKlookCoupons() {
    return axios.get('https://affiliate.klook.com/v3/affsrv/ads/coupons?lang=en');
}