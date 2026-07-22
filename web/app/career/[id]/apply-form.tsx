"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
    jobId: string;
};

const ApplyForm: React.FC<Props> = ({ jobId }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMessage(null);
        setIsError(false);

        const form = event.currentTarget;
        const formData = new FormData(form);

        const resume = formData.get("resumeFile");
        if (!(resume instanceof File) || resume.size === 0) {
            setIsError(true);
            setMessage("Vui long chon file CV truoc khi gui.");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch("/api/career/apply", {
                method: "POST",
                body: formData,
            });

            const data = (await response.json()) as { succeeded?: boolean; message?: string };
            if (!response.ok || !data.succeeded) {
                setIsError(true);
                setMessage(data.message || "Khong the gui ho so luc nay.");
                return;
            }

            setMessage(data.message || "Gui ho so thanh cong.");
            form.reset();
        } catch {
            setIsError(true);
            setMessage("Da co loi xay ra. Vui long thu lai.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
            <input type="hidden" name="jobId" value={jobId} />
            <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">Tai len CV</label>
                <input
                    type="file"
                    name="resumeFile"
                    accept=".pdf,.doc,.docx"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700"
                />
                <p className="mt-1 text-xs text-slate-500">Ho tro PDF, DOC, DOCX.</p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${isSubmitting ? "cursor-not-allowed bg-slate-400" : "bg-orange-500 hover:bg-orange-600"}`}
            >
                {isSubmitting ? "Đang gửi..." : "Ứng tuyển ngay"}
            </button>

            {message && (
                <p className={`rounded-lg px-3 py-2 text-sm ${isError ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {message}
                </p>
            )}

            <Link href="/user/login" className="btn btn-primary block text-center">
                Đăng nhập
            </Link>
        </form>
    );
};

export default ApplyForm;
