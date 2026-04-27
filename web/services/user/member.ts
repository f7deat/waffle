import request from "../request";

export type MemberRegisterData = {
    userName: string;
    password: string;
    email: string;
    phoneNumber?: string;
};

export async function apiMemberRegister(data: MemberRegisterData) {
    return request.post<{ succeeded: boolean; errors?: { description: string }[] }>("user/create-member", data);
}
