import { apiProductDelete, apiProductList, apiProductSave } from "@/services/products/product";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
    ActionType,
    PageContainer,
    ProColumns,
    ProTable
} from "@ant-design/pro-components";
import { Link, getLocale } from "@umijs/max";
import { Button, Popconfirm, Space, message } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import ProductForm, { ProductCatalogForm } from "./components/product-form";

const ProductPage: React.FC = () => {
    const actionRef = useRef<ActionType>(null);
    const [openForm, setOpenForm] = useState(false);
    const [editingRow, setEditingRow] = useState<ProductCatalogForm>();

    const handleCreate = async (values: ProductCatalogForm) => {
        await apiProductSave({
            ...values,
            locale: getLocale(),
        });
        message.success("Tạo sản phẩm thành công");
        setOpenForm(false);
        actionRef.current?.reload();
        return true;
    };

    const handleUpdate = async (values: ProductCatalogForm) => {
        if (!editingRow?.id) {
            return false;
        }
        await apiProductSave({
            ...editingRow,
            ...values,
            id: editingRow.id,
        });
        message.success("Cập nhật sản phẩm thành công");
        setOpenForm(false);
        setEditingRow(undefined);
        actionRef.current?.reload();
        return true;
    };

    const handleDelete = async (id?: string) => {
        if (!id) {
            return;
        }
        await apiProductDelete(id);
        message.success("Xóa sản phẩm thành công");
        actionRef.current?.reload();
    };

    const columns: ProColumns<any>[] = [
        {
            title: "#",
            valueType: "indexBorder",
            width: 48,
            align: "center",
            search: false,
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            minWidth: 240,
            render: (_, record) => (
                <Link to={`/shop/product/center/${record.id}`} className="font-medium text-blue-600 hover:underline">
                    {record.name}
                </Link>
            ),
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            search: false,
            ellipsis: true,
        },
        {
            title: "Giá",
            dataIndex: "price",
            search: false,
            width: 120,
            render: (_, record) => record.price ? Number(record.price).toLocaleString("vi-VN") : "-",
        },
        {
            title: "Cập nhật",
            dataIndex: "modifiedDate",
            width: 180,
            search: false,
            render: (_, record) => record.modifiedDate ? dayjs(record.modifiedDate).format("YYYY-MM-DD HH:mm") : "-",
        },
        {
            title: "",
            dataIndex: "option",
            valueType: "option",
            width: 120,
            align: "center",
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditingRow(record);
                            setOpenForm(true);
                        }}
                    />
                    <Popconfirm
                        title="Xóa sản phẩm"
                        description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <PageContainer
            extra={
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingRow(undefined);
                        setOpenForm(true);
                    }}
                >
                    Thêm sản phẩm
                </Button>
            }
        >
            <ProTable
                actionRef={actionRef}
                rowKey="id"
                request={(params) => apiProductList(params)}
                columns={columns}
                search={{
                    layout: "vertical",
                }}
            />

            <ProductForm
                open={openForm}
                editingRow={editingRow}
                onOpenChange={(nextOpen) => {
                    setOpenForm(nextOpen);
                    if (!nextOpen) {
                        setEditingRow(undefined);
                    }
                }}
                onFinish={async (values) => {
                    if (editingRow?.id) {
                        return handleUpdate(values);
                    }
                    return handleCreate(values);
                }}
            />
        </PageContainer>
    )
}

export default ProductPage;