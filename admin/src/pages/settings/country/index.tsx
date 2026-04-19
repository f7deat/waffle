import { apiCountryList } from "@/services/locations/country";
import { apiCountryCreate, apiCountryUpdate, apiCountryDelete, apiCountryGet } from "@/services/settings/country";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import { ActionType, ModalForm, PageContainer, ProFormText, ProTable, ProFormInstance } from "@ant-design/pro-components"
import { Link } from "@umijs/max";
import { Button, message, Popconfirm } from "antd";
import { useState, useRef, useEffect } from "react";

const Index: React.FC = () => {

    const actionRef = useRef<ActionType>(null);
    const formRef = useRef<ProFormInstance>(null);
    const [openForm, setOpenForm] = useState<boolean>(false);
    const [country, setCountry] = useState<any>(null);

    useEffect(() => {
        if (country?.id) {
            apiCountryGet(country.id).then(response => {
                formRef.current?.setFieldsValue({
                    id: response.id,
                    name: response.name
                });
            });
        } else {
            formRef.current?.resetFields();
        }
    }, [country]);

    const onFinish = async (values: any) => {
        if (values.id) {
            await apiCountryUpdate(values);
            message.success("Country updated successfully");
        } else {
            await apiCountryCreate(values);
            message.success("Country created successfully");
        }
        actionRef.current?.reload();
        setCountry(null);
        return true;
    };

    const handleDelete = async (id: string) => {
        await apiCountryDelete(id);
        message.success("Country deleted successfully");
        actionRef.current?.reload();
    };

    return (
        <PageContainer extra={
            <Button type="primary" onClick={() => {
                setCountry(null);
                setOpenForm(true);
            }} icon={<PlusOutlined />}>Add Country</Button>
        }>
            <ProTable
                actionRef={actionRef}
                request={apiCountryList}
                rowKey={"id"}
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
                        render: (dom, record) => [
                            <Link key={"view"} to={`/settings/country/${record.id}`}>
                                <Button type="primary" icon={<EyeOutlined />} size="small" />
                            </Link>,
                            <Button
                                key="edit"
                                type="primary"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={() => {
                                    setCountry(record);
                                    setOpenForm(true);
                                }}
                            />,
                            <Popconfirm
                                key="delete"
                                title="Are you sure you want to delete this country?"
                                onConfirm={() => handleDelete(record.id)}
                            >
                                <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                            </Popconfirm>
                        ],
                        align: 'center'
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
                        setCountry(null);
                    }
                }}
                onFinish={onFinish}
                title={country?.id ? "Edit Country" : "Add Country"}
            >
                <ProFormText name="id" hidden />
                <ProFormText name="name" label="Country Name" rules={[
                    {
                        required: true
                    }
                ]} />
            </ModalForm>
        </PageContainer>
    );
}

export default Index;