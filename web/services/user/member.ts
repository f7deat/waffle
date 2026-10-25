import request from "../request";

export type MemberRegisterData = {
    name: string;
    userName: string;
    password: string;
    email: string;
    phoneNumber?: string;
    accountType: "member" | "business" | "influencer" | string;
};

export async function apiMemberRegister(data: MemberRegisterData) {
    return request.post<{ succeeded: boolean; errors?: { description: string }[] }>("user/create-member", data);
}
