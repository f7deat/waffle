import { ArrowLeftOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { FormattedMessage, history, useParams } from "@umijs/max"
import { Button, Space, Tag, Avatar } from "antd";
import { apiRoleUsers } from "@/services/role";
import dayjs from "dayjs";

const RoleCenter: React.FC = () => {

    const { id } = useParams();
    const roleName = id;

    const columns: ProColumns<API.RoleUserListItem>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
            width: 30,
            align: 'center'
        },
        {
            title: <FormattedMessage id='general.avatar' defaultMessage='Avatar' />,
            dataIndex: 'avatar',
            key: 'avatar',
            width: 60,
            align: 'center',
            valueType: 'avatar',
            search: false
        },
        {
            title: <FormattedMessage id='general.username' defaultMessage='Username' />,
            dataIndex: 'userName',
            key: 'userName',
            width: 150,
        },
        {
            title: <FormattedMessage id='general.email' defaultMessage='Email' />,
            dataIndex: 'email',
            key: 'email',
            width: 180,
        },
        {
            title: <FormattedMessage id='general.phone' defaultMessage='Phone' />,
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            width: 120,
            render: (text) => text || '-',
        },
        {
            title: <FormattedMessage id='general.dateOfBirth' defaultMessage='Date of Birth' />,
            dataIndex: 'dateOfBirth',
            key: 'dateOfBirth',
            width: 120,
            render: (text, record) => record.dateOfBirth ? dayjs(record.dateOfBirth).format('YYYY-MM-DD') : '-',
        },
        {
            title: <FormattedMessage id='general.createdAt' defaultMessage='Created At' />,
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (text, record) => dayjs(record.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        },
        {
            title: <FormattedMessage id='general.status' defaultMessage='Status' />,
            dataIndex: 'lockoutEnabled',
            key: 'lockoutEnabled',
            width: 100,
            align: 'center',
            render: (lockoutEnabled) => (
                <Tag color={lockoutEnabled ? 'red' : 'green'}>
                    {lockoutEnabled ? 'Locked' : 'Active'}
                </Tag>
            ),
        },
    ];

    return (
        <PageContainer extra={
            <Space>
                <Button icon={<PlusOutlined />} type="primary">Add to role</Button>
                <Button icon={<ArrowLeftOutlined />}>
                    <span><FormattedMessage id='general.back' /></span>
                </Button>
            </Space>
        }>
            <ProTable<API.RoleUserListItem>
                columns={columns}
                request={async (params) => {
                    try {
                        const response = await apiRoleUsers({
                            roleName: roleName || '',
                            name: params.name,
                            userName: params.userName,
                        });
                        return {
                            data: response.data || [],
                            success: true,
                            total: response.total || 0,
                        };
                    } catch (error) {
                        return {
                            data: [],
                            success: false,
                        };
                    }
                }}
                rowKey="id"
                search={{
                    layout: 'vertical'
                }}
                pagination={{
                    pageSize: 10,
                }}
            />
        </PageContainer>
    )
}

export default RoleCenter