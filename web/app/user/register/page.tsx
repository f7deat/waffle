"use client";

import PageContainer from "@/components/layout/page-container";
import { Button, Form, Input, notification } from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined } from "@ant-design/icons";
import { apiMemberRegister } from "@/services/user/member";
import Link from "next/link";

type RegisterValues = {
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
};

const Page: React.FC = () => {
    const [form] = Form.useForm<RegisterValues>();
    const [api, contextHolder] = notification.useNotification();

    const handleFinish = async (values: RegisterValues) => {
        const response = await apiMemberRegister({
            userName: values.userName,
            password: values.password,
            email: values.email,
            phoneNumber: values.phoneNumber,
        });

        if (!response.succeeded) {
            const description =
                response.errors?.map((e) => e.description).join(" ") ||
                "Vui lòng kiểm tra lại thông tin đăng ký.";
            api.error({
                message: "Đăng ký thất bại",
                description,
            });
            return;
        }

        api.success({
            message: "Đăng ký thành công",
            description: "Tài khoản thành viên của bạn đã được tạo. Hãy đăng nhập để tiếp tục.",
        });

        form.resetFields();
    };

    return (
        <PageContainer
            breadcrumbs={[
                { label: "Đăng ký tài khoản", href: "/user/register" },
            ]}
        >
            {contextHolder}
            <div className="py-10">
                <div className="mx-auto md:flex gap-4 max-w-7xl 2xl:gap-16 items-center">
                    <section className="w-full max-w-md mx-auto rounded-2xl bg-white/90 p-6 backdrop-blur lg:p-8 2xl:px-16">
                        <div className="mb-6 space-y-1 text-center">
                            <p className="text-xs uppercase tracking-[0.12em] text-indigo-600">Tham gia cộng đồng</p>
                            <h2 className="text-2xl font-semibold text-slate-900">Đăng ký tài khoản thành viên</h2>
                            <p className="text-sm text-slate-600">Tạo tài khoản miễn phí và bắt đầu hành trình của bạn.</p>
                        </div>

                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleFinish}
                            requiredMark={false}
                        >
                            <Form.Item
                                name="userName"
                                label="Tên đăng nhập"
                                rules={[
                                    { required: true, message: "Vui lòng nhập tên đăng nhập" },
                                    { min: 3, message: "Tên đăng nhập ít nhất 3 ký tự" },
                                    { pattern: /^[a-zA-Z0-9_]+$/, message: "Chỉ dùng chữ, số và dấu gạch dưới" },
                                ]}
                            >
                                <Input
                                    size="large"
                                    prefix={<UserOutlined className="text-slate-400" />}
                                    placeholder="Tên đăng nhập"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Vui lòng nhập email" },
                                    { type: "email", message: "Email không hợp lệ" },
                                ]}
                            >
                                <Input
                                    size="large"
                                    prefix={<MailOutlined className="text-slate-400" />}
                                    placeholder="Email của bạn"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label="Số điện thoại"
                            >
                                <Input
                                    size="large"
                                    prefix={<PhoneOutlined className="text-slate-400" />}
                                    placeholder="Số điện thoại (tùy chọn)"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[
                                    { required: true, message: "Vui lòng nhập mật khẩu" },
                                    { min: 6, message: "Mật khẩu ít nhất 6 ký tự" },
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined className="text-slate-400" />}
                                    placeholder="Mật khẩu"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                dependencies={["password"]}
                                rules={[
                                    { required: true, message: "Vui lòng xác nhận mật khẩu" },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue("password") === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={<LockOutlined className="text-slate-400" />}
                                    placeholder="Xác nhận mật khẩu"
                                    className="rounded-lg"
                                />
                            </Form.Item>

                            <Form.Item className="mb-2">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    className="w-full rounded-lg"
                                >
                                    Đăng ký
                                </Button>
                            </Form.Item>
                        </Form>

                        <p className="mt-4 text-center text-sm text-slate-600">
                            Đã có tài khoản?{" "}
                            <Link href="/user/login" className="text-indigo-600 hover:underline font-medium">
                                Đăng nhập
                            </Link>
                        </p>
                    </section>
                </div>
            </div>
        </PageContainer>
    );
};

export default Page;
