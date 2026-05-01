import request from "@/app/services/base-request";

export type SubmitContactPayload = {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  note?: string;
};

export async function submitContact(payload: SubmitContactPayload) {
  const response = await request.post("/contact/submit", payload);
  return response.data;
}
