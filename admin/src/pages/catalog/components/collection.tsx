import { CatalogType } from "@/constants";
import { apiGetCatalogOptions } from "@/services/catalog";
import { apiAddToCollection, apiListCollectionByCatalog } from "@/services/collection";
import { PlusOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, ProFormDigit, ProFormSelect, ProTable } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";
import { Button, message } from "antd";
import { useRef, useState } from "react";

const CatalogCollection: React.FC = () => {

    const { id } = useParams();
    const [open, setOpen] = useState<boolean>(false);
    const actionRef = useRef<ActionType>();

    const onFinish = async (values: any) => {
        values.catalogId = id;
        await apiAddToCollection(values);
        message.success('Saved!');
        actionRef.current?.reload();
        setOpen(false);
    }

    return (
        <>
            <ProTable
                actionRef={actionRef}
                ghost
                request={(params) => apiListCollectionByCatalog({
                    ...params,
                    catalogId: id
                })}
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
                        dataIndex: 'name'
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
                    }
                ]}
            />
            <ModalForm open={open} onOpenChange={setOpen} title="Thêm vào Collection" onFinish={onFinish}>
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