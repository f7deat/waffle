"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { submitContact } from "@/app/services/contact.service";

type ContactFormValues = {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  note: string;
};

const initialValues: ContactFormValues = {
  name: "",
  email: "",
  phoneNumber: "",
  address: "",
  note: "",
};

function validate(values: ContactFormValues): string | null {
  if (!values.name.trim() || !values.email.trim()) {
    return "Vui lòng nhập Họ tên và Email.";
  }

  if (values.name.length > 100 || values.email.length > 100) {
    return "Họ tên và Email tối đa 100 ký tự.";
  }

  if (values.phoneNumber.length > 20) {
    return "Số điện thoại tối đa 20 ký tự.";
  }

  if (values.address.length > 200) {
    return "Địa chỉ tối đa 200 ký tự.";
  }

  if (values.note.length > 500) {
    return "Nội dung tối đa 500 ký tự.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(values.email)) {
    return "Email không đúng định dạng.";
  }

  return null;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onChange = (field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);

      await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim() || undefined,
        address: values.address.trim() || undefined,
        note: values.note.trim() || undefined,
      });

      setValues(initialValues);
      setSuccessMessage("Đã gửi thông tin thành công. Chúng tôi sẽ liên hệ sớm nhất.");
    } catch (requestError) {
      if (axios.isAxiosError(requestError)) {
        const apiMessage =
          typeof requestError.response?.data === "string"
            ? requestError.response.data
            : requestError.response?.data?.message;

        setError(apiMessage || "Không thể gửi thông tin lúc này. Vui lòng thử lại sau.");
      } else {
        setError("Không thể gửi thông tin lúc này. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[var(--line)] bg-white p-4 shadow-[0_10px_28px_rgba(0,107,29,0.08)] sm:p-5">
      <h3 className="text-base font-extrabold text-[var(--primary-deep)] sm:text-lg">Gửi thông tin tư vấn</h3>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Vui lòng để lại thông tin, đội ngũ Shinec Gia Lai sẽ phản hồi sớm.</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm text-[var(--text-strong)]">
          Họ và tên *
          <input
            type="text"
            value={values.name}
            onChange={(event) => onChange("name", event.target.value)}
            className="h-11 rounded-xl border border-[var(--line)] px-3 outline-none transition focus:border-[var(--primary)]"
            placeholder="Nguyễn Văn A"
            maxLength={100}
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-[var(--text-strong)]">
          Email *
          <input
            type="email"
            value={values.email}
            onChange={(event) => onChange("email", event.target.value)}
            className="h-11 rounded-xl border border-[var(--line)] px-3 outline-none transition focus:border-[var(--primary)]"
            placeholder="example@company.com"
            maxLength={100}
            required
          />
        </label>

        <label className="grid gap-1 text-sm text-[var(--text-strong)]">
          Số điện thoại
          <input
            type="text"
            value={values.phoneNumber}
            onChange={(event) => onChange("phoneNumber", event.target.value)}
            className="h-11 rounded-xl border border-[var(--line)] px-3 outline-none transition focus:border-[var(--primary)]"
            placeholder="0900 000 000"
            maxLength={20}
          />
        </label>

        <label className="grid gap-1 text-sm text-[var(--text-strong)]">
          Địa chỉ
          <input
            type="text"
            value={values.address}
            onChange={(event) => onChange("address", event.target.value)}
            className="h-11 rounded-xl border border-[var(--line)] px-3 outline-none transition focus:border-[var(--primary)]"
            placeholder="Gia Lai"
            maxLength={200}
          />
        </label>
      </div>

      <label className="mt-3 grid gap-1 text-sm text-[var(--text-strong)]">
        Nội dung liên hệ
        <textarea
          value={values.note}
          onChange={(event) => onChange("note", event.target.value)}
          className="min-h-28 rounded-xl border border-[var(--line)] px-3 py-2 outline-none transition focus:border-[var(--primary)]"
          placeholder="Nhu cầu đầu tư, ngành nghề quan tâm, thời gian khảo sát..."
          maxLength={500}
        />
      </label>

      {error && (
        <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {successMessage && (
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-[var(--primary)] px-5 text-sm font-bold text-white transition hover:bg-[var(--primary-mid)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
      </button>
    </form>
  );
}
