import { useMemo } from 'react';
import { useModel, history } from '@umijs/max';
import { PageContainer, ProCard, ProDescriptions } from '@ant-design/pro-components';
import {
    Avatar,
    Button,
    Col,
    Divider,
    Form,
    Input,
    Row,
    Select,
    Space,
    Statistic,
    Tag,
    Timeline,
    Typography,
} from 'antd';
import {
    EditOutlined,
    MailOutlined,
    PhoneOutlined,
    SafetyOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

const Index: React.FC = () => {
    const { initialState } = useModel('@@initialState');
    const currentUser = initialState?.currentUser;

    const metrics = useMemo(() => ([
        {
            title: 'Vai trò',
            value: currentUser?.roles?.length || 0,
            icon: <TeamOutlined />,
            suffix: 'nhóm',
        },
        {
            title: 'Bảo mật',
            value: 98,
            icon: <SafetyOutlined />,
            suffix: '%',
        },
        {
            title: 'Hoạt động',
            value: 24,
            icon: <EditOutlined />,
            suffix: 'tuần',
        },
    ]), [currentUser?.roles?.length]);

    const roleColor = currentUser?.roles?.includes('admin') ? 'volcano' : 'blue';

    return (
        <PageContainer
            onBack={() => history.back()}
            title="Hồ sơ cá nhân"
            content="Quản lý thông tin cơ bản, vai trò và tùy chọn bảo mật của tài khoản hiện tại."
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} lg={8}>
                    <ProCard
                        bordered={false}
                        className="overflow-hidden"
                        style={{
                            background: 'linear-gradient(180deg, #0f172a 0%, #111827 52%, #ffffff 52%, #ffffff 100%)',
                        }}
                    >
                        <div className="flex flex-col items-center text-center px-2 pt-3 pb-5">
                            <div className="mb-4 rounded-full p-1 bg-white/10 ring-8 ring-white/10 shadow-2xl">
                                <Avatar
                                    size={112}
                                    src={currentUser?.avatar}
                                    icon={<UserOutlined />}
                                    className="border-4 border-white shadow-xl"
                                />
                            </div>
                            <Typography.Title level={3} className="!text-white !mb-1">
                                {currentUser?.userName || 'Người dùng hiện tại'}
                            </Typography.Title>
                            <Typography.Text className="text-slate-300">
                                {currentUser?.email || 'Chưa có email được liên kết'}
                            </Typography.Text>
                            <Space size={8} wrap className="mt-4 justify-center">
                                {(currentUser?.roles || ['member']).map((role) => (
                                    <Tag key={role} color={roleColor} className="m-0 px-3 py-1 rounded-full">
                                        {role}
                                    </Tag>
                                ))}
                            </Space>
                            <Button type="primary" icon={<EditOutlined />} className="mt-5">
                                Chỉnh sửa hồ sơ
                            </Button>
                        </div>
                        <Divider className="!my-0 border-white/10" />
                        <div className="grid grid-cols-3 gap-3 px-1 py-4 text-center">
                            {metrics.map((item) => (
                                <div key={item.title} className="rounded-2xl bg-slate-50 px-2 py-3 shadow-sm">
                                    <div className="mb-1 text-slate-500">{item.icon}</div>
                                    <Statistic value={item.value} suffix={item.suffix} />
                                    <div className="mt-1 text-xs text-slate-500">{item.title}</div>
                                </div>
                            ))}
                        </div>
                    </ProCard>

                    <ProCard title="Thông tin nhanh" bordered={false} className="mt-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                <MailOutlined className="text-blue-500" />
                                <div>
                                    <div className="text-xs text-slate-500">Email</div>
                                    <div className="font-medium">{currentUser?.email || 'Chưa cập nhật'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                <PhoneOutlined className="text-emerald-500" />
                                <div>
                                    <div className="text-xs text-slate-500">Số điện thoại</div>
                                    <div className="font-medium">{currentUser?.phoneNumber || 'Chưa cập nhật'}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
                                <TeamOutlined className="text-amber-500" />
                                <div>
                                    <div className="text-xs text-slate-500">Số vai trò</div>
                                    <div className="font-medium">{currentUser?.roles?.length || 0}</div>
                                </div>
                            </div>
                        </div>
                    </ProCard>
                </Col>

                <Col xs={24} lg={16}>
                    <Row gutter={[16, 16]}>
                        <Col xs={24} md={8}>
                            <ProCard bordered={false}>
                                <Statistic title="Tài khoản" value={currentUser?.userName || 'Guest'} prefix={<UserOutlined />} />
                            </ProCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <ProCard bordered={false}>
                                <Statistic title="Email" value={currentUser?.email ? 'Đã liên kết' : 'Chưa có'} prefix={<MailOutlined />} />
                            </ProCard>
                        </Col>
                        <Col xs={24} md={8}>
                            <ProCard bordered={false}>
                                <Statistic title="Trạng thái" value="Hoạt động" prefix={<SafetyOutlined />} />
                            </ProCard>
                        </Col>
                    </Row>

                    <ProCard bordered={false} className="mt-4" title="Chỉnh sửa thông tin">
                        <Form layout="vertical" initialValues={{
                            userName: currentUser?.userName,
                            email: currentUser?.email,
                            phoneNumber: currentUser?.phoneNumber,
                            language: 'vi-VN',
                            timezone: 'Asia/Ho_Chi_Minh',
                        }}>
                            <Row gutter={16}>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Họ và tên" name="userName">
                                        <Input prefix={<UserOutlined />} placeholder="Nhập tên hiển thị" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Email" name="email">
                                        <Input prefix={<MailOutlined />} placeholder="Nhập email" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Số điện thoại" name="phoneNumber">
                                        <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={12}>
                                    <Form.Item label="Ngôn ngữ" name="language">
                                        <Select
                                            options={[
                                                { label: 'Tiếng Việt', value: 'vi-VN' },
                                                { label: 'English', value: 'en-US' },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24}>
                                    <Form.Item label="Múi giờ" name="timezone">
                                        <Select
                                            options={[
                                                { label: 'Asia/Ho_Chi_Minh', value: 'Asia/Ho_Chi_Minh' },
                                                { label: 'UTC', value: 'UTC' },
                                            ]}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Space>
                                <Button type="primary" icon={<EditOutlined />}>
                                    Lưu thay đổi
                                </Button>
                                <Button>Hủy</Button>
                            </Space>
                        </Form>
                    </ProCard>

                    <Row gutter={[16, 16]} className="mt-0">
                        <Col xs={24} md={12}>
                            <ProCard bordered={false} title="Quyền hạn hiện tại">
                                <Space size={[8, 8]} wrap>
                                    {(currentUser?.roles || ['member']).map((role) => (
                                        <Tag key={role} color={roleColor} className="px-3 py-1 rounded-full">
                                            {role}
                                        </Tag>
                                    ))}
                                </Space>
                                <Divider />
                                <Typography.Paragraph className="!mb-0 text-slate-500">
                                    Hồ sơ này đang hiển thị dữ liệu từ tài khoản đăng nhập hiện tại. Phần chỉnh sửa ở trên là giao diện sẵn sàng để nối vào API cập nhật sau.
                                </Typography.Paragraph>
                            </ProCard>
                        </Col>
                        <Col xs={24} md={12}>
                            <ProCard bordered={false} title="Hoạt động gần đây">
                                <Timeline
                                    items={[
                                        {
                                            children: 'Đăng nhập tài khoản thành công',
                                        },
                                        {
                                            children: 'Cập nhật hồ sơ cá nhân',
                                        },
                                        {
                                            children: 'Thay đổi mật khẩu gần nhất',
                                        },
                                    ]}
                                />
                            </ProCard>
                        </Col>
                    </Row>

                    <ProCard bordered={false} className="mt-4" title="Tổng quan hồ sơ">
                        <ProDescriptions
                            column={2}
                            dataSource={currentUser}
                            columns={[
                                {
                                    title: 'Tên hiển thị',
                                    dataIndex: 'userName',
                                    render: (_, record) => record?.userName || 'Chưa cập nhật',
                                },
                                {
                                    title: 'Email',
                                    dataIndex: 'email',
                                    render: (_, record) => record?.email || 'Chưa cập nhật',
                                },
                                {
                                    title: 'Số điện thoại',
                                    dataIndex: 'phoneNumber',
                                    render: (_, record) => record?.phoneNumber || 'Chưa cập nhật',
                                },
                                {
                                    title: 'Vai trò',
                                    dataIndex: 'roles',
                                    render: (_, record) => record?.roles?.join(', ') || 'member',
                                },
                            ]}
                        />
                    </ProCard>
                </Col>
            </Row>
        </PageContainer>
    );
}

export default Index;