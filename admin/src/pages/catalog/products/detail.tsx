import { ProCard, ProForm, ProFormDigit, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import { useParams } from "@umijs/max"
import { queryProduct, saveProduct } from "@/services/catalog";
import { Col, Row, message } from "antd";
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
                    {
                        name: 'affiliateLink',
                        value: response.affiliateLink
                    }
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
                            <ProFormDigit name="affiliateLink" label="Affiliate Link" placeholder="https://" />
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
            <ProductImage />
        </>
    )
}

export default ProductDetail