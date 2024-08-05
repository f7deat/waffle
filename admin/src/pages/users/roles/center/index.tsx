import { getUserInRoles } from "@/services/user";
import { ArrowLeftOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { FormattedMessage, history, useParams } from "@umijs/max"
import { Button, Space } from "antd";

const RoleCenter: React.FC = () => {

    const { id } = useParams();

    const columns: ProColumns<API.User>[] = [
        {
          title: '#',
          valueType: 'indexBorder',
        },
        {
            title: 'Username',
            dataIndex: 'userName'
        },
        {
            title: 'Email',
            dataIndex: 'email'
        },
        {
            title: 'Phone number',
            dataIndex: 'phoneNumber'
        },
        {
            title: '',
            valueType: 'option',
            render: (dom, entity) => [
                <Button type="primary" icon={<UserOutlined />} onClick={() => history.push(`/users/profile/${entity.id}`)} />
            ]
        }
    ]

    return (
        <PageContainer extra={
            <Space>
                <Button icon={<PlusOutlined />} type="primary">Add to role</Button>
                <Button icon={<ArrowLeftOutlined />}>
                <span><FormattedMessage id='general.back' /></span>
            </Button>
            </Space>
        }>
            <ProTable search={{
                layout: 'vertical'
            }} request={() => getUserInRoles(id)} columns={columns} />
        </PageContainer>
    )
}

export default RoleCenter