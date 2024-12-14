import { ProCard, ProForm, ProFormDigit, ProFormInstance, ProFormSwitch, ProFormText } from "@ant-design/pro-components"
import { useParams } from "@umijs/max"
import { queryProduct, saveProduct } from "@/services/catalog";
import { Col, Row, message } from "antd";
import { useEffect, useRef, useState } from "react";
import ProductImage from "./image";
import ProductLink from "./components/product-link";

const ProductDetail: React.FC = () => {

    const { id } = useParams();
    const formRef = useRef<ProFormInstance>();
    const [isAffiliate, setIsAffiliate] = useState<boolean>(false);
    const [product, setProduct] = useState<any>();

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
                    {
                        name: 'isAffiliate',
                        value: response.isAffiliate
                    }
                ]);
                setIsAffiliate(response.isAffiliate);
                setProduct(response);
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
                    <Row gutter={16}>
                        <Col md={6} xs={12}>
                            <ProFormText name="sku" label="SKU" />
                        </Col>
                        <Col md={6} xs={12}>
                            <ProFormDigit name="price" label="Price" />
                        </Col>
                        <Col md={6} xs={12}>
                            <ProFormDigit name="salePrice" label="Sale price" />
                        </Col>
                        <Col md={6} xs={12}>
                            <ProFormDigit name="unitInStock" label="Stock" />
                        </Col>
                        <Col md={24} xs={24}>
                            <ProFormSwitch name="isAffiliate" label="Affiliate" fieldProps={{
                                onChange: (checked) => setIsAffiliate(checked)
                            }} />
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
            {
                isAffiliate && <ProductLink productId={product?.id} />
            }
            <ProductImage />
        </>
    )
}

export default ProductDetail