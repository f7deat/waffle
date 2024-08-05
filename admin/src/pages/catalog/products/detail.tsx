import { ProCard, ProForm, ProFormDigit, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import { useParams } from "@umijs/max"
import { queryProduct, saveProduct } from "@/services/catalog";
import { Space, message } from "antd";
import { useEffect, useRef } from "react";
import ProductImage from "./image";

const ProductDetail: React.FC = () => {

    const { id } = useParams();
    const formRef = useRef<ProFormInstance>();

    useEffect(() => {
        queryProduct(id).then(response => {
            if (response) {
                formRef.current?.setFields([
                    {
                        name: 'sku',
                        value: response.sku
                    },
                    {
                        name: 'price',
                        value: response.price
                    },
                    {
                        name: 'salePrice',
                        value: response.salePrice
                    },
                    {
                        name: 'unitInStock',
                        value: response.unitInStock
                    },
                ])
            }
        })
    }, []);

    const onFinish = async (values: any) => {
        values.catalogId = id;
        const response = await saveProduct(values);
        if (response.succeeded) {
            message.success('Saved');
        }
    }

    return (
        <>
            <ProCard title="Details" headerBordered bordered className="mb-4">
                <ProForm onFinish={onFinish} formRef={formRef}>
                    <Space>
                        <ProFormText name="sku" label="SKU" />
                        <ProFormDigit name="price" label="Price" />
                        <ProFormDigit name="salePrice" label="Sale price" />
                        <ProFormDigit name="unitInStock" label="Stock" />
                    </Space>
                </ProForm>
            </ProCard>
            <ProductImage />
        </>
    )
}

export default ProductDetail