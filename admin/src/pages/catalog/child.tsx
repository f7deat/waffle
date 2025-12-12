import FormCatalogList from "@/components/form/catalog-list";
import FormCatalogType from "@/components/form/catalog-type";
import { addCatalog, deleteCatalog, listCatalog } from "@/services/catalog";
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, ProFormText, ProFormTextArea, ProList } from "@ant-design/pro-components";
import { FormattedMessage, useParams, history } from "@umijs/max";
import { Button, Col, Popconfirm, Row, message } from "antd";
import { useEffect, useRef, useState } from "react";

type ChildCatalogProps = {
    parent?: API.Catalog;
}

const ChildCatalog: React.FC<ChildCatalogProps> = ({ parent }) => {

    const { id } = useParams();

    const [open, setOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();

    useEffect(() => {
        if (parent && actionRef) {
            actionRef.current?.reload();
        }
    }, [parent]);

    const onFinish = async (values: API.Catalog) => {
        values.parentId = id;
        values.type = Number(values.type);
        const response = await addCatalog(values);
        if (response.succeeded) {
            message.success('Added!');
            actionRef.current?.reload();
            setOpen(false);
        }
    };

    const onConfirm = async (id?: string) => {
        const response = await deleteCatalog(id);
        if (response.succeeded) {
            message.success('Deleted');
            actionRef.current?.reload();
        } else {
            message.error(response.errors[0].description);
        }
    };

    const onEdit = (id?: string) => {
        history.push(`/catalog/${id}`);
        actionRef.current?.reload();
    }

    return (
        <>
            <ProList<API.Catalog>
                ghost
                headerTitle="Trang con"
                actionRef={actionRef}
                toolBarRender={() => {
                    return [
                        <Button key="3" type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)} disabled={parent?.parentId != null}>
                            <span><FormattedMessage id="general.new" /></span>
                        </Button>
                    ];
                }}
                metas={{
                    title: {
                        dataIndex: 'name'
                    },
                    description: {
                        dataIndex: 'description'
                    },
                    avatar: {
                        valueType: 'indexBorder'
                    },
                    actions: {
                        render: (dom, entity) => [
                            <Button icon={<MoreOutlined />} type="dashed" size="small" key="more" />,
                            <Button
                                icon={<EditOutlined />}
                                key={1}
                                type="primary"
                                onClick={() => onEdit(entity.id)} size="small"
                            ></Button>,
                            <Popconfirm
                                title="Are you sure?"
                                key={2}
                                onConfirm={() => onConfirm(entity.id)}
                            >
                                <Button icon={<DeleteOutlined />} type="primary" danger size="small" />
                            </Popconfirm>,
                        ]
                    }
                }}
                request={listCatalog}
                params={{ parentId: id }}
                pagination={{
                    pageSize: 10
                }}
            />

            <ModalForm
                open={open}
                onOpenChange={setOpen}
                onFinish={onFinish}
                title={<FormattedMessage id="general.new" />}
            >
                <ProFormText
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                />
                <Row gutter={16}>
                    <Col span={12}>
                        <FormCatalogType label='Type' name='type' initialValue={parent?.type?.toString()} disabled />
                    </Col>
                    <Col span={12}>
                        <FormCatalogList label="Parent" name="parentId" initialValue={parent?.id} />
                    </Col>
                </Row>
                <ProFormTextArea label="Description" name="description" />
            </ModalForm>
        </>
    )
}

export default ChildCatalog