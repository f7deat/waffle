import FormEditor from "@/components/editorjs/form-editor";
import { apiDistrictOptions } from "@/services/locations/district";
import {
    apiPlaceAddImages,
    apiPlaceAddImageUrl,
    apiPlaceDeleteImage,
    apiPlaceDetails,
    apiPlaceImageList,
    apiPlaceUpdate,
} from "@/services/locations/place";
import { apiProvinceOptions } from "@/services/locations/province";
import { apiInfluencerOptions } from "@/services/user";
import { DeleteOutlined, SendOutlined, ShopOutlined, UploadOutlined } from "@ant-design/icons";
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormDigit,
    ProFormInstance,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from "@ant-design/pro-components";
import { useParams, useRequest } from "@umijs/max";
import { Button, Col, Input, message, Row, Spin, Upload } from "antd";
import { useEffect, useRef, useState } from "react";
import CatalogSetting from "../catalog/setting";

const EMPTY_CONTENT = {
    blocks: [],
    time: Date.now(),
    version: "2.28.2",
};

const parseContent = (value: any) => {
    if (!value) return EMPTY_CONTENT;
    if (typeof value === "string") {
        try {
            return JSON.parse(value);
        } catch {
            return EMPTY_CONTENT;
        }
    }
    return value;
};

const PlaceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const formRef = useRef<ProFormInstance>(null);
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(undefined);
    const [images, setImages] = useState<any[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [savingImageUrl, setSavingImageUrl] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [loadingImages, setLoadingImages] = useState(false);

    const { data, loading, refresh } = useRequest(() => apiPlaceDetails(id), {
        ready: !!id,
    });

    const loadImages = async () => {
        try {
            if (!id) return;
            setLoadingImages(true);
            const result = await apiPlaceImageList(id);
            setImages(result?.data || []);
        } catch {
            message.error("Failed to load images");
        } finally {
            setLoadingImages(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, [id]);

    useEffect(() => {
        if (!data) return;
        formRef.current?.setFieldsValue({
            name: data?.name,
            description: data?.description,
            active: data?.active,
            districtId: data?.districtId,
            provinceId: data?.provinceId,
            address: data?.address,
            phoneNumber: data?.phoneNumber,
            openingHours: data?.openingHours,
            priceFrom: data?.priceFrom,
            priceTo: data?.priceTo,
            amenities: data?.amenities,
            latitude: data?.latitude,
            longitude: data?.longitude,
            influencerId: data?.influencerId,
            content: parseContent(data?.content),
            affiliateLink: data?.affiliateLink
        });
        setSelectedProvinceId(data?.provinceId);
    }, [data]);

    const handleUploadImage = async (file: File) => {
        if (!id) {
            message.error("Place ID is missing");
            return false;
        }

        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append("placeId", id);
            formData.append("images", file);
            await apiPlaceAddImages(formData);
            message.success("Image uploaded successfully");
            await loadImages();
        } catch {
            message.error("Failed to upload image");
        } finally {
            setUploadingImage(false);
        }
        return false;
    };

    const handleAddImageUrl = async () => {
        if (!id) {
            message.error("Place ID is missing");
            return;
        }

        let url: URL;
        try {
            url = new URL(imageUrl.trim());
        } catch {
            message.warning("Please enter a valid image URL");
            return;
        }

        if (url.protocol !== "http:" && url.protocol !== "https:") {
            message.warning("Image URL must use HTTP or HTTPS");
            return;
        }

        try {
            setSavingImageUrl(true);
            await apiPlaceAddImageUrl(id, url.toString());
            message.success("Image added successfully");
            setImageUrl("");
            await loadImages();
        } catch {
            message.error("Failed to add image");
        } finally {
            setSavingImageUrl(false);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        try {
            await apiPlaceDeleteImage(imageId);
            message.success("Image deleted successfully");
            await loadImages();
        } catch {
            message.error("Failed to delete image");
        }
    };

    const onFinish = async (values: any) => {
        if (!id) return false;
        const result = await apiPlaceUpdate({
            id,
            name: values.name,
            description: values.description,
            active: values.active,
            districtId: values.districtId,
            address: values.address,
            phoneNumber: values.phoneNumber,
            openingHours: values.openingHours,
            priceFrom: values.priceFrom,
            priceTo: values.priceTo,
            amenities: values.amenities,
            latitude: values.latitude,
            longitude: values.longitude,
            influencerId: values.influencerId,
            content: JSON.stringify(values.content || EMPTY_CONTENT),
        });
        if (result?.succeeded === false) {
            message.error(result.message || "Failed to update place");
            return false;
        }
        message.success("Place updated successfully");
        await refresh();
        return true;
    };

    return (
        <PageContainer
            title={data?.name || "Place detail"}
            onBack={() => history.back()}
            extra={<Button type="primary" onClick={() => formRef.current?.submit()} icon={<SendOutlined />}>Lưu lại</Button>}
        >
            <div className="md:flex gap-4 mb-4">
                <div className="flex-1">
                    <ProCard title={(
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-500">
                                    <ShopOutlined />
                                </span>
                            </div>
                            Thông tin chung & Định danh
                        </div>
                    )}>
                        <ProForm
                            onFinish={onFinish}
                            formRef={formRef}
                            submitter={{
                                searchConfig: {
                                    submitText: "Save",
                                },
                            }}
                        >
                            {!loading && (
                                <FormEditor
                                    name="content"
                                    label="Content"
                                    rules={[{ required: true, message: "Please enter content" }]}
                                    initialValue={parseContent(data?.content)}
                                />
                            )}

                            <div className="mb-4">
                                <label style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}>
                                    Images
                                </label>
                                <Spin spinning={loadingImages}>
                                    <div style={{ marginBottom: "16px" }}>
                                        <Row gutter={[8, 8]}>
                                            {images?.map((image) => (
                                                <Col key={image.id} xs={12} sm={8}>
                                                    <div className="relative">
                                                        <img
                                                            src={image.url}
                                                            alt={image.name}
                                                            className="object-cover h-64 w-full"
                                                        />
                                                        <Button
                                                            type="dashed"
                                                            danger
                                                            size="small"
                                                            icon={<DeleteOutlined />}
                                                            onClick={() => handleDeleteImage(image.id)}
                                                            style={{
                                                                position: "absolute",
                                                                top: 0,
                                                                right: 0,
                                                            }}
                                                        />
                                                    </div>
                                                </Col>
                                            ))}
                                            <Col xs={12} sm={8}>
                                                <Upload
                                                    accept="image/*"
                                                    beforeUpload={handleUploadImage}
                                                    disabled={uploadingImage || savingImageUrl}
                                                    showUploadList={false}
                                                    className="h-64 block w-full border-dashed hover:border-blue-500 cursor-pointer border-2 border-gray-300 rounded flex items-center justify-center"
                                                >
                                                    <div className="flex gap-2 font-medium">
                                                        <UploadOutlined />
                                                        Tải ảnh lên
                                                    </div>
                                                </Upload>
                                            </Col>
                                            <Col xs={12} sm={8}>
                                                <div className="h-64 flex items-center">
                                                    <Input.Search
                                                        type="url"
                                                        placeholder="Dán link ảnh"
                                                        enterButton="Thêm link"
                                                        value={imageUrl}
                                                        onChange={(event) => setImageUrl(event.target.value)}
                                                        onSearch={handleAddImageUrl}
                                                        loading={savingImageUrl}
                                                        disabled={savingImageUrl || uploadingImage}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Spin>
                            </div>
                            <ProFormText name="affiliateLink" label="Affiliate Link" fieldProps={{
                                variant: 'filled'
                            }} />
                            <ProFormSelect
                                name="influencerId"
                                label="Influencer"
                                showSearch
                                request={apiInfluencerOptions}
                            />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <ProFormSelect
                                    name="provinceId"
                                    label="Province"
                                    showSearch
                                    request={apiProvinceOptions}
                                    fieldProps={{
                                        variant: 'filled',
                                        onChange: (value) => {
                                            const parsed = Number(value);
                                            setSelectedProvinceId(Number.isNaN(parsed) ? undefined : parsed);
                                        },
                                    }}
                                />
                                <ProFormSelect
                                    name="districtId"
                                    label="District"
                                    showSearch fieldProps={{
                                        variant: 'filled',
                                    }}
                                    request={apiDistrictOptions}
                                    params={{
                                        provinceId: selectedProvinceId,
                                    }}
                                />
                            </div>
                            <ProFormText name="address" label="Địa chỉ chi tiết" fieldProps={{
                                variant: 'filled'
                            }} />
                            <ProFormText name="phoneNumber" label="Số điện thoại" fieldProps={{
                                variant: 'filled',
                                type: 'tel'
                            }} />
                            <ProFormText name="openingHours" label="Giờ mở cửa" placeholder="07:00 - 22:00" fieldProps={{
                                variant: 'filled'
                            }} />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <ProFormDigit name="priceFrom" label="Giá từ (VND)" min={0} fieldProps={{
                                    variant: 'filled',
                                    precision: 0
                                }} />
                                <ProFormDigit name="priceTo" label="Giá đến (VND)" min={0} fieldProps={{
                                    variant: 'filled',
                                    precision: 0
                                }} />
                                <ProFormDigit name="latitude" label="Vĩ độ" min={-90} max={90} fieldProps={{
                                    variant: 'filled',
                                    precision: 7
                                }} />
                                <ProFormDigit name="longitude" label="Kinh độ" min={-180} max={180} fieldProps={{
                                    variant: 'filled',
                                    precision: 7
                                }} />
                            </div>
                            <ProFormTextArea
                                name="amenities"
                                label="Tiện nghi"
                                placeholder="Mỗi tiện nghi trên một dòng"
                                fieldProps={{ variant: 'filled', rows: 4 }}
                            />
                        </ProForm>
                    </ProCard>
                </div>
                <div className="md:w-1/3">
                    <ProCard>
                        <CatalogSetting />
                    </ProCard>
                </div>
            </div>

        </PageContainer>
    );
};

export default PlaceDetail;
