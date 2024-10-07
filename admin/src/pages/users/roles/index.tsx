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
            width: 30
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'Option',
            valueType: 'option',
            render: (dom, entity) => [
                <Button type="primary" icon={<FolderOutlined />} size="small" key="detail" onClick={() => history.push(`/users/roles/${entity.name}`)} />
            ],
            width: 50
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