import FormEditor from "@/components/editorjs/form-editor";
import ImageLibraryPicker from "@/components/image-library/picker";
import { uploadRcFile } from "@/services/file-service";
import { apiTagOptions } from "@/services/tag";
import { apiProductDetail, apiProductSave } from "@/services/products/product";
import {
    AppstoreOutlined,
    DollarOutlined,
    FileTextOutlined,
    InboxOutlined,
    LinkOutlined,
    PictureOutlined,
    TagsOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import { PageContainer, ProCard, ProForm, ProFormDigit, ProFormInstance, ProFormList, ProFormSelect, ProFormText, ProFormTextArea } from "@ant-design/pro-components"
import { history, useParams, useRequest } from "@umijs/max";
import { Button, Card, Col, message, Row, Typography } from "antd";
import type { RcFile } from "antd/lib/upload";
import { useEffect, useRef, useState } from "react";
import { apiCategoryOptions } from "@/services/settings/category";
import { apiBrandOptions } from "@/services/products/brand";

type ProductVariant = {
    name?: string;
    sku?: string;
    price?: number;
    salePrice?: number;
    unitInStock?: number;
    thumbnail?: string;
};

type ProductImage = {
    url?: string;
};

const EMPTY_EDITOR_CONTENT = {
    blocks: [],
    time: Date.now(),
    version: "2.28.2"
};

const parseContent = (content: any) => {
    if (!content) return undefined;
    if (typeof content === "string") {
        try {
            return JSON.parse(content);
        } catch {
            return undefined;
        }
    }
    return content;
};

const extractEditorContent = (content: any) => {
    const parsed = parseContent(content);
    if (parsed?.editorData && Array.isArray(parsed.editorData.blocks)) {
        return parsed.editorData;
    }
    if (Array.isArray(parsed?.blocks)) {
        return parsed;
    }
    return EMPTY_EDITOR_CONTENT;
};

const extractVariants = (content: any): ProductVariant[] => {
    const parsed = parseContent(content);
    if (!Array.isArray(parsed?.variants)) return [];
    return parsed.variants;
};

const extractImages = (product: any): ProductImage[] => {
    if (Array.isArray(product?.images) && product.images.length > 0) {
        return product.images
            .map((item: any) => ({ url: item?.url }))
            .filter((item: ProductImage) => !!item.url);
    }
    if (typeof product?.thumbnail === "string" && product.thumbnail.trim()) {
        return [{ url: product.thumbnail.trim() }];
    }
    return [];
};

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { data: product, loading } = useRequest(() => apiProductDetail(id), {
        ready: !!id
    });
    const formRef = useRef<ProFormInstance>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const imageInputRefs = useRef<Record<number, HTMLInputElement | null>>({});
    const [thumbnailUploading, setThumbnailUploading] = useState(false);
    const [imageUploadingIndex, setImageUploadingIndex] = useState<number | null>(null);
    const [thumbnail, setThumbnail] = useState<string | undefined>(product?.thumbnail);

    useEffect(() => {
        if (product) {
            formRef.current?.setFieldsValue({
                ...product,
                content: extractEditorContent(product.content),
                tags: product.tagIds || product.tags?.map((x: any) => x.id),
                variants: product.variants || extractVariants(product.content),
                images: extractImages(product)
            });
            setThumbnail(product.thumbnail);
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

            setThumbnail(imageUrl);
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

    const onProductImageSelected = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setImageUploadingIndex(index);
            const response = await uploadRcFile(file as RcFile);
            const imageUrl = resolveUploadedUrl(response);

            if (!imageUrl) {
                message.error("Khong lay duoc URL sau khi upload");
                return;
            }

            formRef.current?.setFieldValue(["images", index, "url"], imageUrl);
            message.success("Upload ảnh sản phẩm thành công");
        } catch (error) {
            message.error("Upload ảnh sản phẩm thất bại");
        } finally {
            setImageUploadingIndex(null);
            const imageInput = imageInputRefs.current[index];
            if (imageInput) {
                imageInput.value = "";
            }
        }
    };

    const onFinish = async (values: any) => {
        const variants = (values.variants || []).filter((item: ProductVariant) => {
            return !!(item?.name || item?.sku || item?.price || item?.salePrice || item?.unitInStock || item?.thumbnail);
        });

        const images = (values.images || [])
            .map((item: ProductImage) => ({ url: item?.url?.trim() }))
            .filter((item: ProductImage) => !!item.url);

        const thumbnailUrl = values.thumbnail?.trim() || images?.[0]?.url;

        await apiProductSave({
            id,
            ...values,
            thumbnail: thumbnailUrl,
            tagIds: values.tags || [],
            variants,
            images,
            content: JSON.stringify(extractEditorContent(values.content)),
        });
        message.success('Lưu sản phẩm thành công');
        return true;
    }

    return (
        <PageContainer
            title={product?.name || "Chi tiết sản phẩm"}
            subTitle="Quản lý nội dung, hình ảnh và thông tin kinh doanh của sản phẩm"
            onBack={() => history.back()}
        >
            <ProCard loading={loading} bordered>
                <ProForm
                    formRef={formRef}
                    onFinish={onFinish}
                    submitter={{ searchConfig: { submitText: "Lưu thay đổi" } }}
                >
                    <Row gutter={[20, 20]} align="top">
                        <Col xs={24} lg={16}>
                            <Card
                                className="mb-5"
                                title={<span><AppstoreOutlined className="mr-2" />Thông tin cơ bản</span>}
                                bordered={false}
                            >
                                <Typography.Paragraph type="secondary">
                                    Cung cấp tên và thông tin nhận diện giúp khách hàng hiểu rõ sản phẩm.
                                </Typography.Paragraph>
                                <ProFormText
                                    name="name"
                                    label="Tên sản phẩm"
                                    placeholder="Ví dụ: Áo sơ mi linen"
                                    rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
                                />
                                <ProFormTextArea
                                    name="description"
                                    label="Mô tả ngắn"
                                    placeholder="Tóm tắt điểm nổi bật của sản phẩm"
                                    fieldProps={{ rows: 4, showCount: true, maxLength: 500 }}
                                />
                                <Row gutter={16}>
                                    <Col xs={24} md={12}>
                                        <ProFormSelect
                                            name="brandId"
                                            label="Thương hiệu"
                                            request={apiBrandOptions}
                                            showSearch
                                            allowClear
                                            placeholder="Chọn thương hiệu"
                                        />
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <ProFormSelect
                                            name="tags"
                                            label="Tags"
                                            mode="multiple"
                                            request={apiTagOptions}
                                            showSearch
                                            placeholder="Chọn hoặc tìm tags"
                                        />
                                    </Col>
                                </Row>
                            </Card>

                            <Card
                                className="mb-5"
                                title={<span><PictureOutlined className="mr-2" />Thư viện hình ảnh</span>}
                                bordered={false}
                            >
                                <Typography.Paragraph type="secondary">
                                    Thêm các hình ảnh giúp khách hàng xem sản phẩm từ nhiều góc độ.
                                </Typography.Paragraph>
                                <ProFormList
                                    name="images"
                                    creatorButtonProps={{ creatorButtonText: "Thêm hình ảnh" }}
                                    copyIconProps={false}
                                    itemRender={({ listDom }, { index }) => (
                                        <ProCard key={index} type="inner" className="mb-3" title={`Ảnh sản phẩm ${index + 1}`}>
                                            {listDom}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                <Button
                                                    size="small"
                                                    icon={<UploadOutlined />}
                                                    loading={imageUploadingIndex === index}
                                                    onClick={() => imageInputRefs.current[index]?.click()}
                                                >
                                                    Tải ảnh lên
                                                </Button>
                                                <ImageLibraryPicker
                                                    value={formRef.current?.getFieldValue(["images", index, "url"])}
                                                    onChange={(url) => {
                                                        formRef.current?.setFieldValue(["images", index, "url"], url);
                                                    }}
                                                />
                                                <input
                                                    ref={(element) => {
                                                        imageInputRefs.current[index] = element;
                                                    }}
                                                    type="file"
                                                    accept="image/*"
                                                    style={{ display: "none" }}
                                                    onChange={(event) => onProductImageSelected(index, event)}
                                                />
                                            </div>
                                        </ProCard>
                                    )}
                                >
                                    <ProFormText name="url" label="Đường dẫn hình ảnh" placeholder="https://..." />
                                </ProFormList>
                            </Card>

                            <Card
                                className="mb-5"
                                title={<span><TagsOutlined className="mr-2" />Biến thể sản phẩm</span>}
                                bordered={false}
                            >
                                <Typography.Paragraph type="secondary">
                                    Khai báo các phiên bản khác nhau về màu sắc, kích thước hoặc cấu hình.
                                </Typography.Paragraph>
                                <ProFormList
                                    name="variants"
                                    creatorButtonProps={{ creatorButtonText: "Thêm biến thể" }}
                                    copyIconProps={false}
                                    itemRender={({ listDom }, { index }) => (
                                        <ProCard key={index} type="inner" className="mb-3" title={`Biến thể ${index + 1}`}>
                                            {listDom}
                                        </ProCard>
                                    )}
                                >
                                    <Row gutter={12}>
                                        <Col span={24}>
                                            <ProFormText name="name" label="Tên biến thể" placeholder="Ví dụ: Màu đỏ / Size M" />
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <ProFormText name="sku" label="SKU biến thể" />
                                        </Col>
                                        <Col xs={24} md={12}>
                                            <ProFormText name="thumbnail" label="Ảnh biến thể" placeholder="https://..." />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <ProFormDigit name="price" label="Giá" />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <ProFormDigit name="salePrice" label="Giá khuyến mãi" />
                                        </Col>
                                        <Col xs={24} md={8}>
                                            <ProFormDigit name="unitInStock" label="Tồn kho" />
                                        </Col>
                                    </Row>
                                </ProFormList>
                            </Card>

                            {product && (
                                <Card
                                    title={<span><FileTextOutlined className="mr-2" />Nội dung chi tiết</span>}
                                    bordered={false}
                                >
                                    <FormEditor
                                        name="content"
                                        label="Mô tả chi tiết"
                                        initialValue={extractEditorContent(product.content)}
                                    />
                                </Card>
                            )}
                        </Col>
                        <Col xs={24} lg={8}>
                            <Card
                                className="mb-5"
                                title={<span><PictureOutlined className="mr-2" />Ảnh đại diện</span>}
                                bordered={false}
                            >
                                <div className="mb-4 overflow-hidden rounded-lg border bg-gray-50">
                                    {thumbnail ? (
                                        <img src={thumbnail} alt="Ảnh đại diện sản phẩm" className="h-56 w-full object-cover" />
                                    ) : (
                                        <div className="flex h-56 flex-col items-center justify-center gap-2 text-gray-400">
                                            <PictureOutlined className="text-3xl" />
                                            <span>Chưa có ảnh đại diện</span>
                                        </div>
                                    )}
                                </div>
                                <ProFormText
                                    name="thumbnail"
                                    label="Đường dẫn ảnh"
                                    placeholder="https://..."
                                    fieldProps={{ onChange: (event) => setThumbnail(event.target.value) }}
                                />
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        icon={<UploadOutlined />}
                                        loading={thumbnailUploading}
                                        onClick={() => thumbnailInputRef.current?.click()}
                                    >
                                        Tải ảnh lên
                                    </Button>
                                    <ImageLibraryPicker
                                        value={thumbnail}
                                        onChange={(url) => {
                                            formRef.current?.setFieldValue("thumbnail", url);
                                            setThumbnail(url);
                                        }}
                                    />
                                </div>
                                <input
                                    ref={thumbnailInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    onChange={onThumbnailSelected}
                                />
                            </Card>

                            <Card
                                className="mb-5"
                                title={<span><DollarOutlined className="mr-2" />Giá & tồn kho</span>}
                                bordered={false}
                            >
                                <ProFormDigit name="price" label="Giá bán" />
                                <ProFormDigit name="salePrice" label="Giá khuyến mãi" />
                                <ProFormDigit name="unitInStock" label="Số lượng trong kho" />
                                <ProFormText name="sku" label="SKU" placeholder="Mã sản phẩm" />
                            </Card>

                            <Card
                                title={<span><InboxOutlined className="mr-2" />Phân loại & liên kết</span>}
                                bordered={false}
                            >
                                <ProFormSelect
                                    name="categoryId"
                                    label="Danh mục"
                                    request={apiCategoryOptions}
                                    showSearch
                                    placeholder="Chọn danh mục"
                                />
                                <ProFormText
                                    name="affiliateLink"
                                    label={<span><LinkOutlined className="mr-1" />Affiliate Link</span>}
                                    placeholder="https://..."
                                />
                            </Card>
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
        </PageContainer>
    )
}

export default Index;