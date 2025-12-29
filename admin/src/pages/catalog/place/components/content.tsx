import FormEditor from "@/components/editorjs/editor-form";
import { apiDistrictOptions } from "@/services/locations/district";
import { apiPlaceDetails, apiPlaceUpdate, apiPlaceAddImages, apiPlaceDeleteImage, apiPlaceImageList } from "@/services/locations/place";
import { apiProvinceOptions } from "@/services/locations/province";
import { ProForm, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { useParams, useRequest } from "@umijs/max";
import { Col, message, Row, Upload, Image as AntImage, Button, Spin } from "antd";
import { useState, useEffect, useRef } from "react";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";

const PlaceContent: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { data, loading } = useRequest(() => apiPlaceDetails(id));
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>(data?.provinceId);
    const [images, setImages] = useState<any[]>([]);
    const [uploading, setUploading] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const formRef = useRef<ProFormInstance>();

    useEffect(() => {
        if (id) {
            loadImages();
        }
    }, [id]);

    useEffect(() => {
        if (data) {
            formRef.current?.setFields([
                {
                    name: 'districtId',
                    value: data.districtId
                },
                {
                    name: 'provinceId',
                    value: data.provinceId
                },
                {
                    name: 'address',
                    value: data.address
                }
            ])
        }
    }, [data]);

    useEffect(() => {
        if (data?.provinceId) {
            setSelectedProvinceId(data.provinceId);
        }
    }, [data]);

    const loadImages = async () => {
        try {
            if (!id) return;
            setLoadingImages(true);
            const result = await apiPlaceImageList(id);
            setImages(result?.data || []);
        } catch (error) {
            message.error('Failed to load images');
        } finally {
            setLoadingImages(false);
        }
    }

    const handleUpload = async (file: any) => {
        try {
            if (!id) {
                message.error('Place ID is missing');
                return false;
            }
            setUploading(true);
            const formData = new FormData();
            formData.append('images', file);
            formData.append('placeId', id);
            await apiPlaceAddImages(formData);
            message.success('Image uploaded successfully');
            await loadImages();
        } catch (error) {
            message.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
        return false;
    }

    const handleDeleteImage = async (imageId: string) => {
        try {
            await apiPlaceDeleteImage(imageId);
            message.success('Image deleted successfully');
            await loadImages();
        } catch (error) {
            message.error('Failed to delete image');
        }
    }

    const onFinish = async (values: any) => {
        await apiPlaceUpdate({
            id,
            ...values,
            content: JSON.stringify(values.content)
        });
        message.success('Succeeded!');
    }

    return (
        <div>
            <ProForm onFinish={onFinish} formRef={formRef}>
                <Row gutter={16}>
                    <Col md={18} xs={24}>
                        {
                            !loading && (
                                <FormEditor name={"content"} label="Content"
                                    rules={[
                                        {
                                            required: true
                                        }
                                    ]}
                                    initialValue={data?.content}
                                />
                            )
                        }
                        <div className="mb-4">
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                                Images
                            </label>
                            <Spin spinning={loadingImages}>
                                <div style={{ marginBottom: '16px' }}>
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
                                                            position: 'absolute',
                                                            top: 0,
                                                            right: 0
                                                        }}
                                                    />
                                                </div>
                                            </Col>
                                        ))}
                                        <Col xs={12} sm={8}>
                                            <Upload
                                                beforeUpload={handleUpload}
                                                accept="image/*"
                                                maxCount={5}
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
                        <ProFormSelect name={"provinceId"} label="Province" initialValue={data?.provinceId}
                            showSearch
                            request={apiProvinceOptions}
                            onChange={(value: string) => setSelectedProvinceId(value)}
                        />
                        <ProFormSelect name="districtId" label="District" initialValue={data?.districtId}
                            showSearch
                            dependencies={['provinceId']}
                            request={apiDistrictOptions}
                            params={{
                                provinceId: selectedProvinceId
                            }}
                        />
                        <ProFormText name={"address"} label="Address" initialValue={data?.address} />
                    </Col>
                </Row>
            </ProForm>
        </div>
    )
}

export default PlaceContent;