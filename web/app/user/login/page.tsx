"use client";

import PageContainer from "@/components/layout/page-container";
import { Button, Checkbox, Form, Input, notification } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { apiPasswordSignIn } from "@/services/user/user";

type LoginValues = {
    username: string;
    password: string;
    remember?: boolean;
};

const Page: React.FC = () => {
    const [form] = Form.useForm<LoginValues>();
    const [api, contextHolder] = notification.useNotification();

    const handleFinish = async (values: LoginValues) => {
        const response = await apiPasswordSignIn(values);
        if (!response.succeeded) {
            api.error({
                title: "Đăng nhập thất bại",
                description: "Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.",
            });
            return;
        }
        document.cookie = `access_token=${response.token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
        api.success({
            title: "Đăng nhập thành công",
            description: "Bạn đã đăng nhập thành công vào DefZone.Net.",
        });
        window.location.href = "/";
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
            {contextHolder}
            <div className="py-10">
                <div className="mx-auto md:flex gap-4 max-w-7xl 2xl:gap-16 items-center">
                    <section className="rounded-2xl bg-white/90 p-6 backdrop-blur lg:p-8 2xl:px-16">
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
                                <Button type="primary" htmlType="submit" size="large" block className="rounded-lg">
                                    Đăng nhập
                                </Button>
                            </Form.Item>

                            <p className="text-center text-sm text-slate-600">
                                Chưa có tài khoản? <a href="/influencer/register" className="font-semibold text-indigo-600 hover:text-indigo-700">Đăng ký</a>
                            </p>
                        </Form>
                    </section>
                    <section className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-indigo-700">DefZone.Net Access</p>
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