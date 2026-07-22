"use client";

import PageContainer from "@/components/layout/page-container";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Checkbox, Form, Input, notification } from "antd";
import { GoogleOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Script from "next/script";
import { apiGoogleSignInToken, apiPasswordSignIn } from "@/services/user/user";

type GoogleCredentialResponse = {
    credential?: string;
};

type GoogleAccounts = {
    id: {
        initialize: (options: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
        }) => void;
        renderButton: (element: HTMLElement, options?: Record<string, unknown>) => void;
    };
};

declare global {
    interface Window {
        google?: {
            accounts: GoogleAccounts;
        };
    }
}

type LoginValues = {
    username: string;
    password: string;
    remember?: boolean;
};

const Page: React.FC = () => {
    const [form] = Form.useForm<LoginValues>();
    const [api, contextHolder] = notification.useNotification();
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const googleButtonRef = useRef<HTMLDivElement>(null);
    const googleInitializedRef = useRef(false);
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    const persistAuthToken = (token: string) => {
        localStorage.setItem("access_token", token);
        document.cookie = `access_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    };

    const navigateAfterSignIn = () => {
        window.location.href = "/";
    };

    const handleGoogleSignIn = useCallback(async (credential?: string) => {
        if (!credential) {
            api.error({
                title: "Đăng nhập Google thất bại",
                description: "Không nhận được thông tin xác thực từ Google.",
            });
            return;
        }

        setIsGoogleLoading(true);
        try {
            const response = await apiGoogleSignInToken({ credential });
            if (!response.succeeded || !response.token) {
                api.error({
                    title: "Đăng nhập Google thất bại",
                    description: response.message || "Không thể đăng nhập bằng Google. Vui lòng thử lại.",
                });
                return;
            }

            persistAuthToken(response.token);
            api.success({
                title: "Đăng nhập thành công",
                description: "Bạn đã đăng nhập bằng Google thành công.",
            });
            navigateAfterSignIn();
        } catch {
            api.error({
                title: "Đăng nhập Google thất bại",
                description: "Có lỗi xảy ra trong quá trình đăng nhập bằng Google.",
            });
        } finally {
            setIsGoogleLoading(false);
        }
    }, [api]);

    const initGoogleSignIn = useCallback(() => {
        if (!googleClientId || !googleButtonRef.current || !window.google || googleInitializedRef.current) {
            return;
        }

        window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: (response) => {
                void handleGoogleSignIn(response.credential);
            },
        });

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonRef.current, {
            type: "standard",
            theme: "outline",
            text: "continue_with",
            shape: "rectangular",
            size: "large",
            width: "360",
            locale: "vi",
        });

        googleInitializedRef.current = true;
    }, [googleClientId, handleGoogleSignIn]);

    useEffect(() => {
        if (!googleInitializedRef.current) {
            initGoogleSignIn();
        }
    }, [initGoogleSignIn]);

    const handleFinish = async (values: LoginValues) => {
        const response = await apiPasswordSignIn(values);
        if (!response.succeeded) {
            api.error({
                title: "Đăng nhập thất bại",
                description: "Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.",
            });
            return;
        }
        persistAuthToken(response.token);
        api.success({
            title: "Đăng nhập thành công",
            description: "Bạn đã đăng nhập thành công vào DefZone.Net.",
        });
        navigateAfterSignIn();
    };

    return (
        <PageContainer
            breadcrumbs={[
                {
                    label: 'Đăng nhập',
                    href: '/user/login'
                }
            ]}
        >
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={initGoogleSignIn}
            />
            {contextHolder}
            <div className="py-10">
                <div className="mx-auto md:flex gap-4 max-w-7xl 2xl:gap-16 items-center">
                    <section className="rounded-2xl bg-white/90 p-6 backdrop-blur lg:p-8 2xl:px-16">
                        <div className="mb-6 space-y-1 text-center">
                            <p className="text-xs uppercase tracking-[0.12em] text-indigo-600">Welcome back</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Đăng nhập tài khoản</h2>
                            <p className="text-sm text-slate-600">Tiếp tục quản lý hành trình của bạn.</p>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinish}
                            initialValues={{ remember: true }}
                            requiredMark={false}
                        >
                            <Form.Item
                                name="username"
                                label="Tài khoản"
                                rules={[{ required: true, message: "Vui lòng nhập tài khoản" }]}
                            >
                                <Input
                                    size="large"
                                    prefix={<UserOutlined className="text-slate-400" />}
                                    placeholder="Tài khoản hoặc email"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined className="text-slate-400" />}
                                    placeholder="••••••••"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <div className="mb-4 flex items-center justify-between text-sm">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Ghi nhớ đăng nhập</Checkbox>
                                </Form.Item>
                                <a href="/user/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-700">Quên mật khẩu?</a>
                            </div>

                            <Form.Item>
                                <button type="submit" className="rounded-lg px-4 py-2 btn btn-primary w-full text-center">
                                    Đăng nhập
                                </button>
                            </Form.Item>

                            <div className="my-4 flex items-center gap-3 text-xs uppercase tracking-[0.08em] text-slate-400">
                                <span className="h-px flex-1 bg-slate-200" />
                                <span>Hoặc</span>
                                <span className="h-px flex-1 bg-slate-200" />
                            </div>

                            <div className="space-y-2 mb-4">
                                {isGoogleLoading ? (
                                    <Button
                                        size="large"
                                        block
                                        loading
                                        icon={<GoogleOutlined />}
                                        className="rounded-lg"
                                    >
                                        Đang xác thực Google...
                                    </Button>
                                ) : (
                                    <div ref={googleButtonRef} className="flex justify-center" />
                                )}

                                {!googleClientId && (
                                    <p className="text-center text-xs text-amber-600">
                                        Thiếu cấu hình NEXT_PUBLIC_GOOGLE_CLIENT_ID để hiển thị đăng nhập Google.
                                    </p>
                                )}
                            </div>

                            <p className="text-center text-sm text-slate-600">
                                Chưa có tài khoản? <a href="/influencer/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Đăng ký</a>
                            </p>
                        </Form>
                    </section>
                    <section className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">Truy cập tài khoản</p>
                        <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">Đăng nhập để theo dõi chiến dịch và booking</h1>
                        <p className="max-w-2xl text-sm text-slate-600 lg:text-base">
                            Quản lý hồ sơ influencer, nhận brief mới, theo dõi trạng thái booking và cập nhật hiệu quả nội dung trong một nơi duy nhất.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Bảo mật</p>
                                <p className="text-lg font-semibold text-slate-900">Xác thực 2 lớp sẵn sàng</p>
                                <p className="text-sm text-slate-600">Chúng tôi hỗ trợ OTP và thông báo hoạt động lạ.</p>
                            </div>
                            <div className="rounded-xl bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Hỗ trợ</p>
                                <p className="text-lg font-semibold text-slate-900">Chat nhanh với đội ngũ</p>
                                <p className="text-sm text-slate-600">Nhận hỗ trợ trong giờ hành chính qua hotline hoặc email.</p>
                            </div>
                            <div className="rounded-xl bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Tính năng</p>
                                <p className="text-lg font-semibold text-slate-900">Bảng điều khiển chi tiết</p>
                                <p className="text-sm text-slate-600">Xem lịch sử booking, hiệu quả chiến dịch và quản lý hồ sơ.</p>
                            </div>
                            <div className="rounded-xl bg-white p-4">
                                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Tiện lợi</p>
                                <p className="text-lg font-semibold text-slate-900">Truy cập mọi lúc mọi nơi</p>
                                <p className="text-sm text-slate-600">Giao diện web thân thiện với thiết bị di động để bạn luôn kết nối.</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </PageContainer>
    );
}

export default Page;