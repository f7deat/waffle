import { listRole } from "@/services/role"
import { FolderOutlined } from "@ant-design/icons"
import { PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { history } from "@umijs/max"
import { Button } from "antd"

const RolePage: React.FC = () => {
    const columns: ProColumns<API.Role>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: '',
            valueType: 'option',
            render: (dom, entity) => [
                <Button type="primary" icon={<FolderOutlined />} onClick={() => history.push(`/users/roles/${entity.name}`)} />
            ]
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