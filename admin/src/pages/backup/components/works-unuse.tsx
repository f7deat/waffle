import { apiUnuseWorks, deleteItem } from "@/services/work-content"
import { DeleteOutlined } from "@ant-design/icons"
import { ActionType, ProCard, ProColumns, ProTable } from "@ant-design/pro-components"
import { Link } from "@umijs/max"
import { Button, Popconfirm, message } from "antd"
import { useRef } from "react"

const WorksUnuse: React.FC = () => {

    const actionRef = useRef<ActionType>();

    const onConfirm = async (catalogId: string, workId: string) => {
        const response = await deleteItem({
            catalogId,
            workId,
            sortOrder: 0,
        });
        if (response.succeeded) {
            message.success('Deleted');
            actionRef.current?.reload();
        } else {
            message.error(response.errors[0].description);
        }
    };

    const columns: ProColumns<any>[] = [
        {
            title: '#',
            valueType: 'indexBorder'
        },
        {
            title: 'Catalog',
            dataIndex: 'catalogName',
            render: (dom, entity) => <Link to={`/catalog/${entity.catalogId}`}>{dom}</Link>
        },
        {
            title: 'Work',
            valueType: 'option',
            render: (dom, entity) => [
                <Popconfirm title="Are you sure?" onConfirm={() => onConfirm(entity.catalogId, entity.workId)}>
                    <Button size="small" danger type="text" icon={<DeleteOutlined />} />
                </Popconfirm>
            ]
        }
    ]

    return (
        <ProCard title="Unuse Works">
            <ProTable
                actionRef={actionRef}
                request={apiUnuseWorks} columns={columns} ghost search={false} />
        </ProCard>
    )
}

export default WorksUnuse