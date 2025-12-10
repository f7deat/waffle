import FormEditor from "@/components/editorjs/editor-form";
import CatalogSetting from "@/pages/catalog/setting";
import { apiCatalogDetail } from "@/services/catalog";
import { apiProductDetail, apiProductSave } from "@/services/products/product";
import { LeftOutlined } from "@ant-design/icons";
import { PageContainer, ProCard, ProForm, ProFormDigit, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import { history, useParams, useRequest } from "@umijs/max";
import { Button, Col, message, Row } from "antd";
import { useEffect, useRef } from "react";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { data: catalog } = useRequest(() => apiCatalogDetail(id));
    const { data: product } = useRequest(() => apiProductDetail(id));
    const formRef = useRef<ProFormInstance>(null);

    useEffect(() => {
        if (product) {
            formRef.current?.setFieldsValue({
                ...product,
                content: JSON.parse(product.content || '{}')
            });
        }
    }, [product]);

    const onFinish = async (values: any) => {
        await apiProductSave({
            catalogId: id,
            ...values,
            content: JSON.stringify(values.content)
        });
        message.success('Lưu sản phẩm thành công');
    }

    return (
        <PageContainer title={catalog?.name}
            extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}>Quay lại</Button>}
        >
            <ProCard
                tabs={{
                    items: [
                        {
                            key: 'detail',
                            label: 'Chi tiết',
                            children: (
                                <div>
                                    <ProForm formRef={formRef} onFinish={onFinish}>
                                        <Row gutter={16}>
                                            <Col md={18}>
                                                <FormEditor name="content" label="Nội dung" rules={[
                                                    {
                                                        required: true
                                                    }
                                                ]} />
                                                <ProFormText name={"content"} hidden />
                                            </Col>
                                            <Col md={6}>
                                                <ProFormDigit name={"price"} label="Giá bán" />
                                                <ProFormDigit name="salePrice" label="Giá khuyến mãi" />
                                                <ProFormDigit name="unitInStock" label="Số lượng trong kho" />
                                                <ProFormText name={"sku"} label="SKU" />
                                                <ProFormText name={"affiliateLink"} label="Affiliate Link" />
                                            </Col>
                                        </Row>
                                    </ProForm>
                                </div>
                            )
                        },
                        {
                            key: 'overview',
                            label: 'Tổng quan',
                            children: <CatalogSetting />
                        },
                        {
                            key: 'variants',
                            label: 'Biến thể',
                            children: 'Biến thể'
                        }
                    ]
                }}
            />
        </PageContainer>
    )
}

export default Index;