import { AbstractBlock } from "@/typings/work";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ModalForm, ProForm, ProFormDigit, ProFormInstance, ProFormSelect, ProFormText, ProFormTextArea, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { uuidv4 } from "@/utils/common";
import { apiGetCatalogOptions, apiGetCatalogTypes } from "@/services/catalog";
import { CatalogType } from "@/constants";

const RankComponent: React.FC<AbstractBlock> = ({ data }) => {

    const formRef = ProForm.useFormInstance<ProFormInstance>();
    const [open, setOpen] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<any[]>([]);
    const [catalogOptions, setCatalogOptions] = useState<any[]>([]);
    const [selectedType, setSelectedType] = useState<CatalogType>(CatalogType.Default);

    useEffect(() => {
        setDataSource(data?.items);
    }, [data]);

    useEffect(() => {
        apiGetCatalogOptions({ type: selectedType }).then(response => setCatalogOptions(response));
    }, [selectedType]);

    const onFinish = async (values: any) => {
        const newDataSource = dataSource || [];
        values.id = uuidv4()
        newDataSource.push({
            ...dataSource,
            ...values
        })
        formRef.setFieldValue('items' as any, newDataSource)
        setDataSource(newDataSource);
        setOpen(false);
        message.success('Saved!');
    }

    const onDelete = (id: string) => {
        setDataSource(dataSource?.filter((x: any) => x.id !== id));
    }

    return (
        <>
            <ProFormText name="items" hidden />
            <ProTable
                ghost
                className="mb-4"
                rowKey="id"
                search={false}
                headerTitle={<Button icon={<PlusOutlined />} type="primary" onClick={() => setOpen(true)}>Thêm mới</Button>}
                dataSource={dataSource}
                columns={[
                    {
                        title: '#',
                        width: 30,
                        valueType: 'indexBorder'
                    },
                    {
                        title: 'Name',
                        dataIndex: 'name'
                    },
                    {
                        title: 'Description',
                        dataIndex: 'description'
                    },
                    {
                        title: 'Rating',
                        dataIndex: 'rating'
                    },
                    {
                        title: 'Option',
                        valueType: 'option',
                        render: (_, entity) => [
                            <Popconfirm key="delete" onConfirm={() => onDelete(entity.id)} title="Are you sure?">
                                <Button type="primary" icon={<DeleteOutlined />} size="small" danger />
                            </Popconfirm>
                        ],
                        width: 60
                    }
                ]}
            />
            <ModalForm open={open} onOpenChange={setOpen} title="Thêm mới" onFinish={onFinish}>
                <ProFormText name="name" label="Name" />
                <ProFormSelect name="type" label="Type" request={apiGetCatalogTypes} showSearch onChange={(value) => {
                    setSelectedType(value as CatalogType);
                }} />
                <ProFormSelect name="url" label="Catalog" options={catalogOptions} showSearch />
                <ProFormTextArea name="description" label="Descrription" />
                <ProFormDigit name="rating" label="Rating" />
            </ModalForm>
        </>
    )
}

export default RankComponent;