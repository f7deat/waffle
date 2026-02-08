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