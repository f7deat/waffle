import TiptapEditor from '@/components/tiptap';
import { getArticleById, updateArticle } from '@/services/article';
import { uploadRcFile } from '@/services/file-service';
import { LeftOutlined, UploadOutlined } from '@ant-design/icons';
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormDateTimePicker,
    ProFormInstance,
    ProFormText,
    ProFormTextArea,
} from '@ant-design/pro-components';
import { history, useParams, useRequest } from '@umijs/max';
import { Button, Col, message, Row } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';

const Index: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const formRef = useRef<ProFormInstance>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const [thumbnailUploading, setThumbnailUploading] = useState(false);

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
            publishedAt: article.publishedAt ? dayjs(article.publishedAt) : undefined,
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
            id,
            name: values.name,
            description: values.description,
            thumbnail: values.thumbnail,
            content: values.content,
            publishedAt: values.publishedAt ? dayjs(values.publishedAt).format('YYYY-MM-DDTHH:mm:ssZ') : undefined,
        });
        message.success('Cap nhat bai viet thanh cong');
        return true;
    };

    return (
        <PageContainer
            title={article?.name || 'Article'}
            loading={loading}
            onBack={() => history.back()}
        >
            <ProCard>
                <ProForm formRef={formRef} onFinish={onFinish} submitter={{ searchConfig: { submitText: 'Luu thay doi' } }}>
                    <Row gutter={16}>
                        <Col xs={24} md={16}>

                            <ProFormText
                                name="name"
                                label="Tieu de"
                                rules={[{ required: true, message: 'Vui long nhap tieu de' }]}
                            />

                            <ProFormTextArea name="description" label="Mo ta" />

                            <ProForm.Item
                                name="content"
                                label="Noi dung"
                                rules={[{ required: true, message: 'Vui long nhap noi dung' }]}
                            >
                                <TiptapEditor />
                            </ProForm.Item>
                        </Col>
                        <Col xs={24} md={8}>

                            <ProFormText name="thumbnail" label="Thumbnail URL"
                                fieldProps={{
                                    suffix: (
                                        <Button
                                            size="small"
                                            icon={<UploadOutlined />}
                                            loading={thumbnailUploading}
                                            onClick={() => thumbnailInputRef.current?.click()}
                                        >Upload</Button>
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

                            <ProFormDateTimePicker name="publishedAt" label="Ngay xuat ban" />
                        </Col>
                    </Row>
                </ProForm>
            </ProCard>
        </PageContainer>
    )
}

export default Index;