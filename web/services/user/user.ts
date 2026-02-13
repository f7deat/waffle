import request from "../request";

export async function apiPasswordSignIn(data: { username: string; password: string; remember?: boolean }) {
    return request.server.post<{
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