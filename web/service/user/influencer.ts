import request from "../request";

export type InfluencerRegisterData = {
    fullName: string;
    email: string;
    phoneNumber: string;
}

export async function apiInfluencerRegister(data: InfluencerRegisterData) {
    return request.post("user/influencer", data);
}