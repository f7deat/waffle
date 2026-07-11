import { NextRequest, NextResponse } from "next/server";

const resolveApiBase = () => {
    const host = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "";
    return host.replace(/\/+$/, "");
};

export async function POST(request: NextRequest) {
    try {
        const apiBase = resolveApiBase();
        if (!apiBase) {
            return NextResponse.json({ succeeded: false, message: "Chua cau hinh API_URL." }, { status: 500 });
        }

        const accessToken = request.cookies.get("access_token")?.value;
        if (!accessToken) {
            return NextResponse.json({ succeeded: false, message: "Vui long dang nhap de ung tuyen." }, { status: 401 });
        }

        const sourceForm = await request.formData();
        const jobId = String(sourceForm.get("jobId") || "").trim();
        const resumeFile = sourceForm.get("resumeFile");

        if (!jobId) {
            return NextResponse.json({ succeeded: false, message: "Thieu ma cong viec." }, { status: 400 });
        }

        if (!(resumeFile instanceof File) || resumeFile.size === 0) {
            return NextResponse.json({ succeeded: false, message: "Vui long tai len CV." }, { status: 400 });
        }

        const backendForm = new FormData();
        backendForm.append("jobId", jobId);
        backendForm.append("resumeFile", resumeFile);

        const response = await fetch(`${apiBase}/api/career/apply`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: backendForm,
            redirect: "manual",
            cache: "no-store",
        });

        if (response.status >= 300 && response.status < 400) {
            return NextResponse.json({ succeeded: true, message: "Ung tuyen thanh cong." });
        }

        if (!response.ok) {
            const message = await response.text();
            return NextResponse.json(
                {
                    succeeded: false,
                    message: message || "Khong the gui ho so luc nay.",
                },
                { status: response.status }
            );
        }

        return NextResponse.json({ succeeded: true, message: "Ung tuyen thanh cong." });
    } catch {
        return NextResponse.json({ succeeded: false, message: "Da co loi xay ra. Vui long thu lai." }, { status: 500 });
    }
}
