import ImageLibraryPicker from "@/components/image-library/picker";
import TiptapEditor from "@/components/tiptap";
import { uploadRcFile } from "@/services/file-service";
import { apiProductDetail, apiProductSave } from "@/services/products/product";
import { LeftOutlined, UploadOutlined } from "@ant-design/icons";
import { PageContainer, ProCard, ProForm, ProFormDigit, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import { history, useParams, useRequest } from "@umijs/max";
import { Button, Col, message, Row } from "antd";
import type { RcFile } from "antd/lib/upload";
import { useEffect, useRef, useState } from "react";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { data: product, loading } = useRequest(() => apiProductDetail(id));
    const formRef = useRef<ProFormInstance>(null);
    const [form] = ProForm.useForm();
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);
    const thumbnail = ProForm.useWatch("thumbnail", form);

    useEffect(() => {
        if (product) {
            formRef.current?.setFieldsValue({
                ...product,
                content: product.content || ""
            });
        }
    }, [product]);

    const resolveUploadedUrl = (response: any): string | undefined => {
        if (!response) return undefined;
        if (typeof response === "string") return response;
        if (typeof response.data === "string") return response.data;
        if (typeof response.url === "string") return response.url;
        return undefined;
    };

    const onThumbnailSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setThumbnailUploading(true);
            const response = await uploadRcFile(file as RcFile);
            const imageUrl = resolveUploadedUrl(response);

            if (!imageUrl) {
                message.error("Khong lay duoc URL sau khi upload");
                return;
            }

            formRef.current?.setFieldValue("thumbnail", imageUrl);
            message.success("Upload thumbnail thanh cong");
        } catch (error) {
            message.error("Upload thumbnail that bai");
        } finally {
            setThumbnailUploading(false);
            if (thumbnailInputRef.current) {
                thumbnailInputRef.current.value = "";
            }
        }
    };

    const onFinish = async (values: any) => {
        await apiProductSave({
            id,
            ...values,
            content: values.content || ""
        });
        message.success('Lưu sản phẩm thành công');
        return true;
    }

    return (
        <PageContainer title={product?.name || 'Chi tiết sản phẩm'}
            extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}>Quay lại</Button>}
        >
            <ProCard
                loading={loading}
                tabs={{
                    items: [
                        {
                            key: 'detail',
                            label: 'Chi tiết',
                            children: (
                                <div>
                                    <ProForm form={form} formRef={formRef} onFinish={onFinish} submitter={{ searchConfig: { submitText: "Lưu thay đổi" } }}>
                                        <Row gutter={16}>
                                            <Col md={18}>
                                                <ProForm.Item
                                                    name="content"
                                                    label="Nội dung"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: "Vui lòng nhập nội dung"
                                                        }
                                                    ]}
                                                >
                                                    <TiptapEditor placeholder="Nhập chi tiết sản phẩm..." />
                                                </ProForm.Item>
                                            </Col>
                                            <Col md={6}>
                                                <div className="border rounded p-1 mb-2">
                                                    <img src={thumbnail} alt="Thumbnail" className="w-full h-64 rounded object-cover" />
                                                </div>
                                                <ProFormText
                                                    name={"thumbnail"}
                                                    label="Thumbnail URL"
                                                    fieldProps={{
                                                        suffix: (
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    size="small"
                                                                    icon={<UploadOutlined />}
                                                                    loading={thumbnailUploading}
                                                                    onClick={() => thumbnailInputRef.current?.click()}
                                                                >Upload</Button>
                                                                <ImageLibraryPicker
                                                                    value={thumbnail}
                                                                    onChange={(url) => formRef.current?.setFieldValue("thumbnail", url)}
                                                                />
                                                            </div>
                                                        )
                                                    }}
                                                />
                                                <input
                                                    ref={thumbnailInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={onThumbnailSelected}
                                                />
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