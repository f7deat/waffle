import FormEditor from "@/components/editorjs/editor-form";
import { apiDistrictOptions } from "@/services/locations/district";
import {
    apiPlaceAddImages,
    apiPlaceDeleteImage,
    apiPlaceDetails,
    apiPlaceImageList,
    apiPlaceUpdate,
} from "@/services/locations/place";
import { apiProvinceOptions } from "@/services/locations/province";
import { apiInfluencerOptions } from "@/services/user";
import { DeleteOutlined, LeftOutlined, UploadOutlined } from "@ant-design/icons";
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormInstance,
    ProFormSelect,
    ProFormText,
} from "@ant-design/pro-components";
import { useParams, useRequest } from "@umijs/max";
import { Button, Col, message, Row, Spin, Upload } from "antd";
import { useEffect, useRef, useState } from "react";

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
    const formRef = useRef<ProFormInstance>();
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>(undefined);
    const [images, setImages] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
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
            influencerId: data?.influencerId,
            content: parseContent(data?.content),
        });
        setSelectedProvinceId(data?.provinceId);
    }, [data]);

    const handleUpload = async (file: File) => {
        try {
            if (!id) {
                message.error("Place ID is missing");
                return false;
            }
            setUploading(true);
            const formData = new FormData();
            formData.append("images", file);
            formData.append("placeId", id);
            await apiPlaceAddImages(formData);
            message.success("Image uploaded successfully");
            await loadImages();
        } catch {
            message.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
        return false;
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
        await apiPlaceUpdate({
            id,
            name: values.name,
            description: values.description,
            active: values.active,
            districtId: values.districtId,
            address: values.address,
            influencerId: values.influencerId,
            content: JSON.stringify(values.content || EMPTY_CONTENT),
        });
        message.success("Place updated successfully");
        await refresh();
        return true;
    };

    return (
        <PageContainer
            title={data?.name || "Place detail"}
            loading={loading}
            extra={<Button onClick={() => history.back()} icon={<LeftOutlined />}>Back</Button>}
        >
            <ProCard>
                <ProForm
                    onFinish={onFinish}
                    formRef={formRef}
                    submitter={{
                        searchConfig: {
                            submitText: "Save",
                        },
                    }}
                >
                    <Row gutter={16}>
                        <Col md={18} xs={24}>
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
                                                    beforeUpload={handleUpload as any}
                                                    accept="image/*"
                                                    multiple
                                                    disabled={uploading}
                                                    showUploadList={false}
                                                    className="h-64 block w-full border-dashed hover:border-blue-500 cursor-pointer border-2 border-gray-300 rounded flex items-center justify-center"
                                                >
                                                    <div className="flex gap-2 font-medium">
                                                        <UploadOutlined />
                                                        Upload Images
                                                    </div>
                                                </Upload>
                                            </Col>
                                        </Row>
                                    </div>
                                </Spin>
                            </div>
                        </Col>

                        <Col md={6} xs={24}>
                            <ProFormText
                                name="name"
                                label="Name"
                                rules={[{ required: true, message: "Please enter place name" }]}
                            />
                            <ProFormText name="description" label="Description" />
                            <ProFormSelect
                                name="active"
                                label="Status"
                                options={[
                                    { label: "Published", value: true as any },
                                    { label: "Draft", value: false as any },
                                ]}
                                allowClear={false}
                            />
                            <ProFormSelect
                                name="provinceId"
                                label="Province"
                                showSearch
                                request={apiProvinceOptions}
                                fieldProps={{
                                    onChange: (value) => {
                                        const parsed = Number(value);
                                        setSelectedProvinceId(Number.isNaN(parsed) ? undefined : parsed);
                                    },
                                }}
                            />
                            <ProFormSelect
                                name="districtId"
                                label="District"
                                showSearch
                                request={apiDistrictOptions}
                                params={{
                                    provinceId: selectedProvinceId,
                                }}
                            />
                            <ProFormText name="address" label="Address" />
                            <ProFormSelect
                                name="influencerId"
                                label="Influencer"
                                showSearch
                                request={apiInfluencerOptions}
                            />
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
        </PageContainer>
    );
};

export default PlaceDetail;
