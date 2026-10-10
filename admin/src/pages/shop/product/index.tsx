import { apiProductDelete, apiProductExport, apiProductList } from "@/services/products/product";
import { DeleteOutlined, DownloadOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
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
import { apiCategoryOptions } from "@/services/settings/category";

const Index: React.FC = () => {
    const actionRef = useRef<ActionType>(null);
    const tableParamsRef = useRef<Record<string, any>>({});
    const [openForm, setOpenForm] = useState(false);

    const handleDelete = async (id?: string) => {
        if (!id) {
            return;
        }
        await apiProductDelete(id);
        message.success("Xóa sản phẩm thành công");
        actionRef.current?.reload();
    };

    const handleExport = async () => {
        try {
            const { name, categoryId } = tableParamsRef.current;
            const blob = await apiProductExport({ name, categoryId, locale: getLocale() });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `products-${dayjs().format("YYYYMMDD-HHmmss")}.xlsx`;
            link.click();
            URL.revokeObjectURL(url);
        } catch {
            message.error("Xuất Excel thất bại");
        }
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
            title: 'Ảnh',
            dataIndex: 'thumbnail',
            width: 80,
            search: false,
            render: (_, record) => (
                <img src={record.thumbnail} alt="Thumbnail" style={{ width: 60, height: 60, objectFit: "cover" }} />
            )
        },
        {
            title: "Tên sản phẩm",
            dataIndex: "name",
            minWidth: 240,
            render: (_, record) => (
                <>
                    <Link to={`/shop/product/center/${record.id}`} className="font-medium text-blue-600 hover:underline">
                        {record.name}
                    </Link>
                    <div className="text-gray-500 text-xs">
                        {record.description}
                    </div>
                </>
            ),
        },
        {
            title: "Danh mục",
            dataIndex: "categoryId",
            width: 120,
            valueType: "select",
            request: apiCategoryOptions,
            fieldProps: {
                showSearch: true
            },
            render: (_, record) => record.categoryName ?? "-",
        },
        {
            title: "Cập nhật",
            dataIndex: "modifiedDate",
            width: 180,
            search: false,
            render: (_, record) => dayjs(record.modifiedDate ?? record.createdDate).format("YYYY-MM-DD HH:mm"),
        },
        {
            title: 'Lượt xem',
            dataIndex: 'viewCount',
            width: 120,
            search: false,
            valueType: 'digit'
        },
        {
            title: <SettingOutlined />,
            dataIndex: "option",
            valueType: "option",
            width: 60,
            align: "center",
            render: (_, record) => [
                <Popconfirm key="delete"
                        title="Xóa sản phẩm"
                        description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
                        okText="Xóa"
                        cancelText="Hủy"
                        onConfirm={() => handleDelete(record.id)}
                    >
                        <Button danger size="small" icon={<DeleteOutlined />} />
                    </Popconfirm>
            ]
        }
    ];

    return (
        <PageContainer
            extra={
                <Space>
                    <Button icon={<DownloadOutlined />} onClick={handleExport}>Xuất Excel</Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenForm(true);
                        }}
                    >
                        Thêm sản phẩm
                    </Button>
                </Space>
            }
        >
            <ProTable
                actionRef={actionRef}
                scroll={{ x: true }}
                rowKey="id"
                request={(params) => {
                    tableParamsRef.current = params;
                    return apiProductList(params);
                }}
                columns={columns}
                search={{
                    layout: "vertical",
                }}
                size="small"
            />

            <ProductForm open={openForm} reload={() => actionRef.current?.reload()} onOpenChange={setOpenForm} />
        </PageContainer>
    )
}

export default Index;