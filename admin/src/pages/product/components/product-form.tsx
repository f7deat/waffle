import {
    ModalForm,
    ProFormDigit,
    ProFormText,
    ProFormTextArea,
} from "@ant-design/pro-components";

export type ProductCatalogForm = {
    id?: string;
    name: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    salePrice?: number;
    sku?: string;
    unitInStock?: number;
    affiliateLink?: string;
}

type ProductFormProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingRow?: ProductCatalogForm;
    onFinish: (values: ProductCatalogForm) => Promise<boolean>;
}

const ProductForm: React.FC<ProductFormProps> = ({
    open,
    onOpenChange,
    editingRow,
    onFinish,
}) => {
    return (
        <ModalForm<ProductCatalogForm>
            title={editingRow?.id ? "Cập nhật sản phẩm" : "Tạo sản phẩm"}
            open={open}
            onOpenChange={onOpenChange}
            onFinish={onFinish}
            initialValues={editingRow || { active: false }}
            modalProps={{
                destroyOnClose: true,
            }}
        >
            <ProFormText
                name="name"
                label="Tên sản phẩm"
                rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
            />
            <ProFormTextArea name="description" label="Mô tả" />
        </ModalForm>
    );
};

export default ProductForm;
