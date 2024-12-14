import { apiAddProductLink, apiDeleteProductLink, apiListLinkByProductId } from "@/services/products/product";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, ProCard, ProFormInstance, ProFormText, ProTable } from "@ant-design/pro-components";
import { FormattedMessage } from "@umijs/max";
import { Button, message, Popconfirm } from "antd";
import { useRef, useState } from "react";

const ProductLink: React.FC<{ productId?: string }> = ({ productId }) => {

    const [open, setOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const formRef = useRef<ProFormInstance>();

    const onFinish = async (values: any) => {
        values.productId = productId;
        await apiAddProductLink(values);
        message.success('Thành công!');
        formRef.current?.resetFields();
        actionRef.current?.reload();
        setOpen(false);
    }

    const onConfirm = async (id: string) => {
        await apiDeleteProductLink(id);
        message.success('Thành công!');
        actionRef.current?.reload();
    }

    return (
        <>
            <ProCard title="Affiliate Link" headerBordered bordered className="mb-4">
                <ProTable
                    actionRef={actionRef}
                    request={(params) => apiListLinkByProductId(params, productId)}
                    ghost
                    columns={[
                        {
                            title: '#',
                            valueType: 'indexBorder',
                            width: 30,
                            align: 'center'
                        },
                        {
                            title: 'Url',
                            dataIndex: 'url'
                        },
                        {
                            title: 'Name',
                            dataIndex: 'name'
                        },
                        {
                            title: 'Lượt mua',
                            dataIndex: 'clickCount',
                            valueType: 'digit'
                        },
                        {
                            title: 'Ngày tạo',
                            dataIndex: 'createdDate',
                            valueType: 'fromNow',
                            width: 150,
                            search: false
                        },
                        {
                            title: 'Ngày cập nhật',
                            dataIndex: 'modifiedDate',
                            valueType: 'fromNow',
                            width: 140,
                            search: false
                        },
                        {
                            title: 'Action',
                            valueType: 'option',
                            render: (_, entity) => [
                                <Popconfirm key="delete" title="Are you sure?" onConfirm={() => onConfirm(entity.id)}>
                                    <Button type="primary" size="small" icon={<DeleteOutlined />} danger />
                                </Popconfirm>
                            ],
                            width: 60
                        }
                    ]}
                    headerTitle={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}><FormattedMessage id="general.new" /></Button>} />
            </ProCard>
            <ModalForm open={open} onOpenChange={setOpen} title="Affiliate Link Setting" onFinish={onFinish} formRef={formRef}>
                <ProFormText name="url" label="URL" placeholder="https://" rules={[
                    {
                        required: true
                    }
                ]} />
                <ProFormText name="name" label="Name" rules={[
                    {
                        required: true
                    }
                ]} />
            </ModalForm>
        </>
    )
}

export default ProductLink;