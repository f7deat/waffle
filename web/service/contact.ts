import request from "./request";

export async function apiContactSubmit(data: { name: string; email: string; phoneNumber: string; note: string }) {
    return request.post('contact/submit', data);
}