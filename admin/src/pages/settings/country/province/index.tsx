import { apiProvinceList } from "@/services/locations/province";
import { apiProvinceCreate, apiProvinceUpdate, apiProvinceDelete, apiProvinceGet } from "@/services/settings/province";
import { apiCountryList } from "@/services/locations/country";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProFormInstance, ProFormSelect, ProFormText, ProTable } from "@ant-design/pro-components";
import { history, Link, useParams } from "@umijs/max";
import { Button, message, Popconfirm } from "antd";
import { useEffect, useRef, useState } from "react";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const actionRef = useRef<ActionType>(null);
    const formRef = useRef<ProFormInstance>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [province, setProvince] = useState<any>(null);

    useEffect(() => {
        if (province?.id) {
            apiProvinceGet(province.id).then(response => {
                formRef.current?.setFieldsValue({
                    id: response.id,
                    name: response.name,
                    countryId: response.countryId
                });
            });
        } else {
            formRef.current?.resetFields();
            // Set default countryId from URL params
            if (id) {
                formRef.current?.setFieldsValue({
                    countryId: parseInt(id)
                });
            }
        }
    }, [province, id]);

    const onFinish = async (values: any) => {
        if (values.id) {
            await apiProvinceUpdate(values);
            message.success("Province updated successfully");
        } else {
            await apiProvinceCreate(values);
            message.success("Province created successfully");
        }
        actionRef.current?.reload();
        setProvince(null);
        return true;
    };

    const handleDelete = async (id: string) => {
        await apiProvinceDelete(id);
        message.success("Province deleted successfully");
        actionRef.current?.reload();
    };

    return (
        <PageContainer
            onBack={() => history.back()}
            extra={
                <Button type="primary" onClick={() => {
                    setProvince(null);
                    setOpenForm(true);
                }} icon={<PlusOutlined />}>Add Province</Button>
            }
        >
            <ProTable
                actionRef={actionRef}
                request={apiProvinceList}
                rowKey={"id"}
                params={{ countryId: id }}
                columns={[
                    {
                        title: '#',
                        valueType: 'indexBorder',
                        width: 30,
                        align: 'center'
                    },
                    {
                        title: 'Name',
                        dataIndex: 'name'
                    },
                    {
                        title: <SettingOutlined />,
                        valueType: 'option',
                        width: 150,
                        align: 'center',
                        render: (dom, record) => [
                            <Link key={"view"} to={`/settings/country/province/${record.id}`}>
                                <Button type="primary" icon={<EyeOutlined />} size="small" />
                            </Link>,
                            <Button
                                key="edit"
                                type="primary"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => {
                                    setProvince(record);
                                    setOpenForm(true);
                                }}
                            />,
                            <Popconfirm
                                key="delete"
                                title="Are you sure you want to delete this province?"
                                onConfirm={() => handleDelete(record.id)}
                            >
                                <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                            </Popconfirm>
                        ]
                    }
                ]}
                search={{
                    layout: 'vertical'
                }}
            />
            <ModalForm
                formRef={formRef}
                open={openForm}
                onOpenChange={(visible) => {
                    setOpenForm(visible);
                    if (!visible) {
                        setProvince(null);
                    }
                }}
                onFinish={onFinish}
                title={province?.id ? "Edit Province" : "Add Province"}
            >
                <ProFormText name="id" hidden />
                <ProFormText name="name" label="Province Name" rules={[
                    {
                        required: true
                    }
                ]} />
                <ProFormSelect 
                    name="countryId" 
                    label="Country" 
                    request={async () => {
                        const response = await apiCountryList({});
                        return response.data.map((item: any) => ({
                            label: item.name,
                            value: item.id
                        }));
                    }}
                    rules={[
                        {
                            required: true
                        }
                    ]}
                />
            </ModalForm>
        </PageContainer>
    );
}

export default Index;