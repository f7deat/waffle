import { CatalogType } from "@/constants";
import { apiGetCatalogOptions } from "@/services/catalog";
import { apiAddToCollection, apiDeleteCatalogFromCollection, apiListCatalogByCollection, apiListCollectionByCatalog, apiUpdateCatalogCollection } from "@/services/collection";
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, ProFormDigit, ProFormInstance, ProFormSelect, ProFormText, ProTable } from "@ant-design/pro-components";
import { Link, useParams } from "@umijs/max";
import { Button, Dropdown, message, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";

type Props = {
    data?: API.Catalog;
}

const CatalogCollection: React.FC<Props> = ({ data }) => {

    const { id } = useParams();
    const [open, setOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();
    const formRef = useRef<ProFormInstance>();
    const [collection, setCollection] = useState<any>();

    useEffect(() => {
        formRef.current?.setFields([
            {
                name: 'catalogId',
                value: collection?.catalogId
            },
            {
                name: 'collectionId',
                value: data?.type === CatalogType.Collection ? data.id : collection?.collectionId
            },
            {
                name: 'sortOrder',
                value: collection?.sortOrder
            }
        ])
    }, [collection]);

    const onFinish = async (values: any) => {
        if (!values.catalogId) {
            values.catalogId = id;
            await apiAddToCollection(values);
        } else {
            await apiUpdateCatalogCollection(values);
        }
        message.success('Saved!');
        actionRef.current?.reload();
        formRef.current?.resetFields();
        setOpen(false);
    }

    return (
        <>
            <ProTable
                actionRef={actionRef}
                ghost
                request={(params) => {
                    if (data?.type === CatalogType.Collection) {
                        return apiListCatalogByCollection({
                            ...params,
                            collectionId: data?.id
                        })
                    }
                    return apiListCollectionByCatalog({
                        ...params,
                        catalogId: id
                    });
                }}
                search={{
                    layout: 'vertical'
                }}
                headerTitle={<Button icon={<PlusOutlined />} type="primary" onClick={() => setOpen(true)}>Thêm vào Collection</Button>}
                columns={[
                    {
                        title: '#',
                        valueType: 'indexBorder',
                        width: 30
                    },
                    {
                        title: 'Name',
                        dataIndex: 'name',
                        render: (dom, entity) => <Link to={`/catalog/center/${entity.collectionId}`}>{dom}</Link>
                    },
                    {
                        title: 'Thứ tự',
                        dataIndex: 'sortOrder',
                        valueType: 'digit',
                        search: false
                    },
                    {
                        title: 'Ngày tạo',
                        dataIndex: 'createdDate',
                        valueType: 'fromNow',
                        width: 150,
                        search: false
                    },
                    {
                        title: 'Modified date',
                        dataIndex: 'modifiedDate',
                        valueType: 'fromNow',
                        width: 150,
                        search: false
                    },
                    {
                        title: 'Lượt xem',
                        dataIndex: 'viewCount',
                        search: false,
                        valueType: 'digit',
                        width: 90
                    },
                    {
                        title: 'Status',
                        dataIndex: 'active',
                        valueEnum: {
                            true: {
                                status: 'Processing',
                                text: 'Active'
                            },
                            false: {
                                status: 'Default',
                                text: 'Draft'
                            }
                        },
                        width: 80
                    },
                    {
                        title: 'Option',
                        valueType: 'option',
                        render: (_, entity) => [
                            <Dropdown key="more" menu={{
                                items: [
                                    {
                                        key: 'edit',
                                        label: 'Chỉnh sửa',
                                        icon: <EditOutlined />
                                    }
                                ],
                                onClick: (info) => {
                                    setCollection(entity);
                                    if (info.key === 'edit') {
                                        setOpen(true);
                                        return;
                                    }
                                }
                            }}>
                                <Button type="dashed" icon={<MoreOutlined />} size="small" />
                            </Dropdown>,
                            <Popconfirm key="delete" title="Are you sure?" onConfirm={async () => {
                                await apiDeleteCatalogFromCollection(entity);
                                message.success('Saved!');
                                actionRef.current?.reload();
                            }}>
                                <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
                            </Popconfirm>
                        ],
                        width: 30
                    }
                ]}
            />
            <ModalForm open={open} onOpenChange={setOpen} title="Thêm vào Collection" onFinish={onFinish} formRef={formRef}>
                <ProFormText name="catalogId" hidden />
                <ProFormSelect
                    label="Collection" name="collectionId"
                    showSearch
                    rules={[
                        {
                            required: true
                        }
                    ]}
                    request={(params) => apiGetCatalogOptions({
                        ...params,
                        type: CatalogType.Collection
                    })}
                />
                <ProFormDigit name="sortOrder" label="Thứ tự" initialValue={1} />
            </ModalForm>
        </>
    )
}

export default CatalogCollection;