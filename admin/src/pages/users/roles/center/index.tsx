import { DeleteOutlined, PlusOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProColumns, ProFormSelect, ProTable } from "@ant-design/pro-components"
import { FormattedMessage, history, useParams } from "@umijs/max"
import { Button, Tag, message, Popconfirm } from "antd";
import { apiRoleUsers, apiAddUserToRole, apiRemoveUserFromRole, apiRoleByName, RoleUserListItem } from "@/services/role";
import { listUser } from "@/services/user";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { useRequest } from "@umijs/max";

const RoleCenter: React.FC = () => {

    const { id } = useParams();

    const { data } = useRequest(() => apiRoleByName(id));

    const roleName = id;
    const actionRef = useRef<ActionType>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);

    const onFinish = async (values: any) => {
        const response = await apiAddUserToRole({
            id: values.userId,
            roleName: roleName || ''
        });
        if (response.succeeded) {
            message.success('User added to role successfully');
            setOpenForm(false);
            actionRef.current?.reload();
        } else {
            message.error(response.errors?.[0]?.description || 'Failed to add user to role');
        }
        return true;
    };

    const handleRemoveFromRole = async (userId: string) => {
        const response = await apiRemoveUserFromRole({
            id: userId,
            roleName: roleName || ''
        });
        if (response.succeeded) {
            message.success('User removed from role successfully');
            actionRef.current?.reload();
        } else {
            message.error(response.errors?.[0]?.description || 'Failed to remove user from role');
        }
    };

    const columns: ProColumns<RoleUserListItem>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
            width: 30,
            align: 'center'
        },
        {
            title: <UserOutlined />,
            dataIndex: 'avatar',
            key: 'avatar',
            width: 40,
            align: 'center',
            valueType: 'avatar',
            search: false
        },
        {
            title: 'Tài khoản',
            dataIndex: 'userName',
            key: 'userName',
            width: 150,
        },
        {
            title: 'Name',
            dataIndex: 'name'
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
            width: 160,
            valueType: 'dateTime'
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
        {
            title: <SettingOutlined />,
            valueType: 'option',
            width: 40,
            align: 'center',
            render: (dom, record) => [
                <Popconfirm
                    key="remove"
                    title="Are you sure you want to remove this user from the role?"
                    onConfirm={() => handleRemoveFromRole(record.id)}
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            ]
        }
    ];

    return (
        <PageContainer title={data?.displayName}
            onBack={() => history.back()}
            extra={
                <Button 
                    icon={<PlusOutlined />} 
                    type="primary"
                    onClick={() => setOpenForm(true)}
                >
                    Add to role
                </Button>
            }
        >
            <ProTable<RoleUserListItem>
                actionRef={actionRef}
                columns={columns}
                request={apiRoleUsers}
                params={{ roleName: roleName }}
                rowKey="id"
                search={{
                    layout: 'vertical'
                }}
            />
            <ModalForm
                open={openForm}
                onOpenChange={setOpenForm}
                onFinish={onFinish}
                title="Add User to Role"
            >
                <ProFormSelect
                    name="userId"
                    label="Select User"
                    showSearch
                    request={async (params) => {
                        const response = await listUser({ name: params.keyWords });
                        return response.data.map((user: any) => ({
                            label: `${user.userName} - ${user.name || 'N/A'}`,
                            value: user.id
                        }));
                    }}
                    rules={[
                        {
                            required: true,
                            message: 'Please select a user'
                        }
                    ]}
                />
            </ModalForm>
        </PageContainer>
    );
}

export default RoleCenter