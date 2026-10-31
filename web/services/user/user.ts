import request from "../request";
import { InfluencerRandomListItem } from "./typings";

export async function apiPasswordSignIn(data: { username: string; password: string; remember?: boolean }) {
    return request.post<{
        succeeded: boolean;
        token: string;
        expiration: string;
    }>("user/password-sign-in", data);
}

export async function apiGoogleSignInToken(data: { credential: string }) {
    return request.post<{
        succeeded: boolean;
        token?: string;
        expiration?: string;
        message?: string;
    }>("user/google-signin-token", data);
}

export async function apiCurrentUser() {
    return request.get<API.User>(`user`);
}

export async function apiChangePassword(data: { currentPassword: string; newPassword: string;  }) {
    return request.put<API.TResult<object>>("user/change-password", data);
}

export async function apiChangeAvatar(formData: FormData) {
    return request.put<API.TResult<object>>("user/profile/avatar", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiUpdateProfile(data: { name: string; email: string; phoneNumber: string; }) {
    return request.put<API.TResult<object>>("user/profile", data);
}

export async function apiProfileDetail() {
    return request.get<API.ProfileDetail>("user/profile/detail");
}

export async function apiUpdateProfileDetail(data: API.UpdateProfileDetailArgs) {
    return request.put<API.TResult<object>>("user/profile/detail", data);
}

export async function apiUpdateProfileCover(formData: FormData) {
    return request.put<API.TResult<object>>("user/profile/cover", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function apiRemoveProfileCover() {
    return request.delete<API.TResult<object>>("user/profile/cover");
}

export async function apiUploadMediaKit(formData: FormData) {
    return request.put<API.TResult<object>>("user/profile/media-kit", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function apiSocialPlatformList() {
    return request.get<{ data: API.SocialPlatformItem[] }>("socialplatform/list");
}

export async function apiTopupProfile(data: { amount: number; note?: string; }) {
    return request.post<API.TResult<API.WalletTopupCheckout>>("user/profile/topup", data);
}

export async function apiWalletTopupStatus(orderCode: number) {
    return request.get<API.TResult<API.WalletTopupStatus>>(`user/profile/topup/${orderCode}`);
}

export async function apiMyWalletWithdrawals(params: { current: number; pageSize: number }) {
    return request.get<API.ListResult<API.WalletWithdrawalRequest>>("user/profile/withdrawals", { params });
}

export async function apiWithdrawProfile(data: {
    amount: number;
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    note?: string;
}) {
    return request.post<API.TResult<object>>("user/profile/withdraw", data);
}

export async function apiGetUserByUserName(userName: string) {
    return request.get<API.TResult<API.UserBasicInfo>>(`user/user-name/${userName}`);
}

// #region Influencer
export async function apiInfluencerRandomList(params: { current: number; pageSize: number }) {
    return request.get<API.ListResult<InfluencerRandomListItem>>("user/influencer/random-list", { params });
}
//#endregion