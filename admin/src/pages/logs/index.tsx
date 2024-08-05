import { deleteLog, queryLogs } from "@/services/log";
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { Button, Popconfirm, message } from "antd";
import { useRef } from "react";

const LogPage: React.FC = () => {

    const actionRef = useRef<ActionType>();

    const remove = async (logId: string) => {
        const response = await deleteLog(logId);
        if (response.succeeded) {
            message.success('Deleted!');
            actionRef.current?.reload();
        } else {
            message.error(response[0].description);
        }
    }

    const columns: ProColumns<any>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
        },
        {
            title: 'User Name',
            render: (dom, entity) => (
                <div>
                    <div className="text-muted">{entity.userName}</div>
                </div>
            )
        },
        {
            title: 'Message',
            dataIndex: 'message'
        },
        {
            title: 'Date',
            dataIndex: 'createdDate',
            valueType: 'fromNow'
        },
        {
            title: '',
            valueType: 'option',
            render: (dom, entity) => [
                <Button key="publish" icon={<CheckOutlined />} type="primary" hidden={entity.status !== 0}></Button>,
                <Popconfirm
                    title="Are you sure?"
                    key={2}
                    onConfirm={() => remove(entity.id)}
                >
                    <Button icon={<DeleteOutlined />} type="primary" danger />
                </Popconfirm>,
            ],
        },
    ];

    return (
        <PageContainer extra={(
            <Popconfirm title="Are you sure?">
                <Button type="primary" danger icon={<DeleteOutlined />}>Xóa tất cả</Button>
            </Popconfirm>
        )}>
            <ProTable request={queryLogs} columns={columns} actionRef={actionRef}
                search={{
                    layout: 'vertical'
                }}
                rowSelection={{}} />
        </PageContainer>
    )
}

export default LogPage