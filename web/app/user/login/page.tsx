"use client";

import PageContainer from "@/components/layout/page-container"
import { Button, Checkbox, Form, Input } from "antd"

const Page: React.FC = () => {
    return (
        <PageContainer>
            <div className="p-4">
                <Form layout="vertical">
                    <Form.Item label="Username" rules={[{ required: true }]} required >
                        <Input placeholder="Username" />
                    </Form.Item>
                    <Form.Item label="Password" rules={[{ required: true }]} required >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <div className="flex justify-between mb-4">
                        <Checkbox>Remember me</Checkbox>
                        <a href="/user/forgot-password">Forgot password?</a>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Login
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </PageContainer>
    )
}

export default Page