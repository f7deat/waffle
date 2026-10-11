import {
    apiBrandCreate,
    apiBrandDelete,
    apiBrandList,
    apiBrandUpdate,
} from "@/services/products/brand";
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import {
    ActionType,
    ModalForm,
    PageContainer,
    ProFormInstance,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProTable,
} from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import { useRef, useState } from "react";

type BrandItem = {
    id: number;
    name: string;
    description?: string;
    logo?: string;
    isActive: boolean;
    productCount: number;
};

const Index: React.FC = () => {
    const actionRef = useRef<ActionType>(null);
    const formRef = useRef<ProFormInstance>(null);
    const [openForm, setOpenForm] = useState(false);
    const [brand, setBrand] = useState<BrandItem | null>(null);

    const onFinish = async (values: Record<string, unknown>) => {
        if (brand) {
            await apiBrandUpdate({ ...values, id: brand.id });
            message.success("Cập nhật thương hiệu thành công");
        } else {
            await apiBrandCreate(values);
            message.success("Tạo thương hiệu thành công");
        }
        setBrand(null);
        actionRef.current?.reload();
        return true;
    };

    const handleDelete = async (id: number) => {
        await apiBrandDelete(id);
        message.success("Xóa thương hiệu thành công");
        actionRef.current?.reload();
    };

    return (
        <PageContainer
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setBrand(null);
                        setOpenForm(true);
                    }}
                >
                    Thêm thương hiệu
                </Button>
            }
        >
            <ProTable<BrandItem>
                actionRef={actionRef}
                rowKey="id"
                search={{
                    layout: "vertical"
                }}
                request={apiBrandList}
                columns={[
                    {
                        title: "#",
                        valueType: "indexBorder",
                        width: 48,
                        search: false,
                    },
                    {
                        title: "Logo",
                        dataIndex: "logo",
                        search: false,
                        render: (_, item) => item.logo
                            ? <img src={item.logo} alt={item.name} style={{ width: 48, height: 48, objectFit: "contain" }} />
                            : "-",
                    },
                    { title: "Tên thương hiệu", dataIndex: "name" },
                    {
                        title: "Mô tả",
                        dataIndex: "description",
                        search: false,
                        ellipsis: true,
                    },
                    {
                        title: "Sản phẩm",
                        dataIndex: "productCount",
                        search: false,
                    },
                    {
                        title: "Trạng thái",
                        dataIndex: "isActive",
                        valueType: "select",
                        valueEnum: {
                            true: { text: "Đang hiển thị" },
                            false: { text: "Ẩn" },
                        },
                        render: (_, item) => item.isActive ? "Đang hiển thị" : "Ẩn",
                    },
                    {
                        title: <SettingOutlined />,
                        valueType: "option",
                        width: 100,
                        align: "center",
                        render: (_, item) => [
                            <Button
                                key="edit"
                                type="primary"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() => {
                                    setBrand(item);
                                    formRef.current?.setFieldsValue(item);
                                    setOpenForm(true);
                                }}
                            />,
                            <Popconfirm
                                key="delete"
                                title="Bạn có chắc muốn xóa thương hiệu này?"
                                onConfirm={() => handleDelete(item.id)}
                            >
                                <Button danger size="small" icon={<DeleteOutlined />} />
                            </Popconfirm>,
                        ],
                    },
                ]}
            />

            <ModalForm
                formRef={formRef}
                title={brand ? "Cập nhật thương hiệu" : "Thêm thương hiệu"}
                open={openForm}
                initialValues={{ isActive: true }}
                onOpenChange={(visible) => {
                    setOpenForm(visible);
                    if (!visible) {
                        setBrand(null);
                        formRef.current?.resetFields();
                    }
                }}
                onFinish={onFinish}
            >
                <ProFormText
                    name="name"
                    label="Tên thương hiệu"
                    rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
                />
                <ProFormText name="logo" label="URL logo" />
                <ProFormTextArea name="description" label="Mô tả" fieldProps={{ rows: 4 }} />
                <ProFormSwitch name="isActive" label="Hiển thị trên website" />
            </ModalForm>
        </PageContainer>
    );
};

export default Index;
