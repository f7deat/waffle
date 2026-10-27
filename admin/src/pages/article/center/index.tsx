import ImageLibraryPicker from '@/components/image-library/picker';
import { getArticleById, updateArticle } from '@/services/article';
import { uploadRcFile } from '@/services/file-service';
import { EyeOutlined, PictureOutlined, SaveOutlined, SendOutlined, UploadOutlined } from '@ant-design/icons';
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormDateTimePicker,
    ProFormInstance,
    ProFormSelect,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { history, useParams, useRequest } from '@umijs/max';
import { Button, Col, message, Row } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import FormEditor from '@/components/editorjs/form-editor';
import { apiCategoryOptions } from '@/services/settings/category';

const Index: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const formRef = useRef<ProFormInstance>(null);
    const [form] = ProForm.useForm();
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);
    const thumbnail = ProForm.useWatch('thumbnail', form);

    const { data: detailResponse, loading } = useRequest(
        () => getArticleById(id as string),
        {
            ready: !!id,
        }
    );

    const article = useMemo(() => {
        if (!detailResponse) return undefined;
        return (detailResponse as any).data ?? detailResponse;
    }, [detailResponse]);

    useEffect(() => {
        if (!article) return;
        formRef.current?.setFieldsValue({
            name: article.name,
            description: article.description,
            thumbnail: article.thumbnail,
            normalizedName: article.normalizedName,
            publishedAt: article.scheduledAt
                ? dayjs(article.scheduledAt)
                : article.publishedAt
                    ? dayjs(article.publishedAt)
                    : undefined,
            content: article.content || '',
        });
    }, [article]);

    const resolveUploadedUrl = (response: any): string | undefined => {
        if (!response) return undefined;
        if (typeof response === 'string') return response;
        if (typeof response.data === 'string') return response.data;
        if (typeof response.url === 'string') return response.url;
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
                message.error('Khong lay duoc URL sau khi upload');
                return;
            }

            formRef.current?.setFieldValue('thumbnail', imageUrl);
            message.success('Upload thumbnail thanh cong');
        } catch (error) {
            message.error('Upload thumbnail that bai');
        } finally {
            setThumbnailUploading(false);
            if (thumbnailInputRef.current) {
                thumbnailInputRef.current.value = '';
            }
        }
    };

    const onFinish = async (values: any) => {
        if (!id) return false;
        await updateArticle({
            ...values,
            content: JSON.stringify(values.content),
            id,
            publishedAt: values.publishedAt ? dayjs(values.publishedAt).toISOString() : null,
        });
        message.success('Cap nhat bai viet thanh cong');
        return true;
    };

    return (
        <PageContainer
            title={article?.name || 'Article'}
            loading={loading}
            onBack={() => history.back()}
            extra={(
                <>
                    <Button type="dashed" icon={<EyeOutlined />}>Xem trước</Button>
                    <Button icon={<SaveOutlined />}>Lưu nháp</Button>
                    <Button type="primary" onClick={() => form.submit()} icon={<SendOutlined />}>Xuất bản</Button>
                </>
            )}
        >
            <ProForm loading={loading} form={form} formRef={formRef} onFinish={onFinish} submitter={false}>
                <div className="md:flex gap-4">

                    <div className="flex-1">
                        <ProCard>
                            <ProFormText
                                name="name"
                                label="Tiêu đề"
                                rules={[{ required: true, message: 'Vui long nhap tieu de' }]}
                            />
                            <ProFormText name="normalizedName" label="Tên chuẩn hóa" disabled />
                            <ProFormTextArea name="description" label="Mô tả" />
                            <FormEditor name="content" label="Nội dung" initialValue={detailResponse?.content} />
                        </ProCard>
                    </div>
                    <div className="md:w-96">
                        <div className="mb-4">
                            <ProCard title="Thông tin phân loại">
                                <ProFormSelect name="categoryId" showSearch label="Danh mục" request={apiCategoryOptions} />
                                <ProFormDateTimePicker name="publishedAt" label="Ngày xuất bản" width="xl" />
                            </ProCard>
                        </div>
                        <ProCard title={<div><span className="text-blue-500 mr-1"><PictureOutlined /></span>Ảnh đại diện (Featured)</div>}>
                            <div className="border rounded p-1 mb-2">
                                <img src={thumbnail} alt="Thumbnail" className="w-full h-52 rounded object-cover" />
                            </div>
                            <ProFormText name="thumbnail" label="Thumbnail URL"
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
                                                onChange={(url) => formRef.current?.setFieldValue('thumbnail', url)}
                                            />
                                        </div>
                                    )
                                }}
                            />

                            <input
                                ref={thumbnailInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={onThumbnailSelected}
                            />
                        </ProCard>
                    </div>
                </div>
            </ProForm>
        </PageContainer>
    )
}

export default Index;