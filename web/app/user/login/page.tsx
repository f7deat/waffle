"use client";

import PageContainer from "@/components/layout/page-container";
import { Button, Checkbox, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

type LoginValues = {
    username: string;
    password: string;
    remember?: boolean;
};

const Page: React.FC = () => {
    const [form] = Form.useForm<LoginValues>();

    const handleFinish = (_values: LoginValues) => {
        // TODO: hook up login API
    };

    return (
        <PageContainer>
            <div className="min-h-[70vh] bg-gradient-to-br from-indigo-50 via-white to-slate-50 py-10">
                <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 lg:grid lg:grid-cols-[1.1fr,0.9fr]">
                    <section className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">DefZone.Net Access</p>
                        <h1 className="text-3xl font-bold text-slate-900 lg:text-4xl">Đăng nhập để theo dõi chiến dịch và booking</h1>
                        <p className="max-w-2xl text-sm text-slate-600 lg:text-base">
                            Quản lý hồ sơ influencer, nhận brief mới, theo dõi trạng thái booking và cập nhật hiệu quả nội dung trong một nơi duy nhất.
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className="rounded-xl border border-indigo-100 bg-white p-4 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Bảo mật</p>
                                <p className="text-lg font-semibold text-slate-900">Xác thực 2 lớp sẵn sàng</p>
                                <p className="text-sm text-slate-600">Chúng tôi hỗ trợ OTP và thông báo hoạt động lạ.</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="text-xs uppercase tracking-[0.08em] text-slate-500">Hỗ trợ</p>
                                <p className="text-lg font-semibold text-slate-900">Chat nhanh với đội ngũ</p>
                                <p className="text-sm text-slate-600">Nhận hỗ trợ trong giờ hành chính qua hotline hoặc email.</p>
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-xl backdrop-blur lg:p-8">
                        <div className="mb-6 space-y-1 text-center">
                            <p className="text-xs uppercase tracking-[0.12em] text-indigo-600">Welcome back</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Đăng nhập tài khoản</h2>
                            <p className="text-sm text-slate-600">Tiếp tục quản lý hành trình của bạn tại DefZone.Net.</p>
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
                                label="Username"
                                rules={[{ required: true, message: "Vui lòng nhập username" }]}
                            >
                                <Input
                                    size="large"
                                    prefix={<UserOutlined className="text-slate-400" />}
                                    placeholder="Username"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Password"
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
                                <Button type="primary" htmlType="submit" size="large" block className="rounded-lg">
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <p className="text-center text-sm text-slate-600">
                                Chưa có tài khoản? <a href="/influencer/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Đăng ký influencer</a>
                            </p>
                        </Form>
                    </section>
                </div>
            </div>
        </PageContainer>
    );
}

export default Page;