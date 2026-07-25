import { apiProductAdd } from "@/services/products/product";
import {
    ModalForm,
    ModalFormProps,
    ProFormDigit,
    ProFormText,
    ProFormTextArea,
} from "@ant-design/pro-components";
import { message } from "antd";

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

type ProductFormProps = ModalFormProps & {
    reload?: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
    reload, ...props
}) => {

    const onFinish = async (values: any) => {
        await apiProductAdd(values);
        message.success("Tạo sản phẩm thành công");
        reload?.();
        return true;
    }

    return (
        <ModalForm
            title="Tạo sản phẩm"
            {...props}
            onFinish={onFinish}
            modalProps={{
                destroyOnHidden: true,
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
