import { listRole } from "@/services/role"
import { FolderOutlined, SettingOutlined } from "@ant-design/icons"
import { PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { history } from "@umijs/max"
import { Button } from "antd"

const RolePage: React.FC = () => {

    const columns: ProColumns<any>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
            width: 30
        },
        {
            title: 'Name',
            dataIndex: 'name',
            copyable: true,
            width: 150
        },
        {
            title: 'Display Name',
            dataIndex: 'displayName'
        },
        {
            title: 'Số lượng',
            dataIndex: 'userCount',
            valueType: 'digit',
            width: 90,
            search: false
        },
        {
            title: <SettingOutlined />,
            valueType: 'option',
            render: (dom, entity) => [
                <Button type="primary" icon={<FolderOutlined />} size="small" key="detail" onClick={() => history.push(`/user/roles/${entity.name}`)} />
            ],
            width: 40,
            align: 'center'
        }
    ]

    return (
        <PageContainer>
            <ProTable request={listRole} columns={columns}
                search={{
                    layout: 'vertical'
                }}
                rowSelection={{}}
            />
        </PageContainer>
    )
}

export default RolePage