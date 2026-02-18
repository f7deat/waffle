import request from "../request";

export async function apiPasswordSignIn(data: { username: string; password: string; remember?: boolean }) {
    return request.post<{
        succeeded: boolean;
        token: string;
        expiration: string;
    }>("user/password-sign-in", data);
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

export async function apiGetUserByUserName(userName: string) {
    return request.get<API.TResult<API.UserBasicInfo>>(`user/user-name/${userName}`);
}