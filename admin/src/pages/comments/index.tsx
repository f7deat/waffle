import { activeComment, queryComments, removeComment } from "@/services/comment"
import { CheckOutlined, DeleteOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components"
import { Button, Popconfirm, message } from "antd";
import { useRef } from "react";

const CommentPage: React.FC = () => {

    const actionRef = useRef<ActionType>();

    const active = async (commentId: string) => {
        const response = await activeComment(commentId);
        if (response.succeeded) {
            message.success('Actived!');
            actionRef.current?.reload();
        } else {
            message.error(response.errors[0].description);
        }
    }

    const remove = async (commentId: string) => {
        const response = await removeComment(commentId);
        if (response.succeeded) {
            message.success('Actived!');
            actionRef.current?.reload();
        } else {
            message.error(response.errors[0].description);
        }
    }

    const columns: ProColumns<any>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
        },
        {
            title: 'Content',
            render: (dom, entity) => (
                <div>
                    <div className="text-muted">{entity.userName}</div>
                    <div>{entity.content}</div>
                </div>
            )
        },
        {
            title: 'Catalog',
            render: (dom, entity) => <a href="#">{entity.catalogName}</a>
        },
        {
            title: 'Date',
            dataIndex: 'createdDate',
            valueType: 'fromNow',
            width: 130
        },
        {
            title: 'Status',
            dataIndex: 'status',
            valueEnum: {
                0: {
                    text: 'Draft',
                    status: 'Default',
                },
                1: {
                    text: 'Active',
                    status: 'Processing',
                },
            },
            width: 80
        },
        {
            title: '',
            valueType: 'option',
            render: (dom, entity) => [
                <Button key="publish" icon={<CheckOutlined />} type="primary" hidden={entity.status !== 0} onClick={() => active(entity.id)}></Button>,
                <Popconfirm
                    title="Are you sure?"
                    key={2}
                    onConfirm={() => remove(entity.id)}
                >
                    <Button icon={<DeleteOutlined />} type="text" size="small" danger />
                </Popconfirm>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable request={queryComments} columns={columns} actionRef={actionRef}
                search={{
                    layout: "vertical"
                }}
                rowSelection={{}} />
        </PageContainer>
    )
}

export default CommentPage