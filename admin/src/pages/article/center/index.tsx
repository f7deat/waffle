import ImagePicker from '@/components/image-library/picker';
import { getArticleById, publishArticle, updateArticle } from '@/services/article';
import { uploadRcFile } from '@/services/file-service';
import { EyeOutlined, PictureOutlined, SaveOutlined, SendOutlined } from '@ant-design/icons';
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormDateTimePicker,
    ProFormDigit,
    ProFormInstance,
    ProFormList,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
    ProFormTreeSelect,
} from '@ant-design/pro-components';
import { history, useParams, useRequest } from '@umijs/max';
import { Button, Col, message, Row } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import FormEditor from '@/components/editorjs/form-editor';
import { apiArticleCategoryTreeOptions } from '@/services/settings/category';
import { apiTagOptions } from '@/services/tag';

const Index: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const formRef = useRef<ProFormInstance>(null);
    const publishAfterSaveRef = useRef(false);
    const [form] = ProForm.useForm();
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const thumbnail = ProForm.useWatch('thumbnail', form);
    const [openImagePicker, setOpenImagePicker] = useState(false);

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
            categoryId: article.categoryId,
            isFeatured: article.isFeatured,
            tagIds: article.tagIds || article.tags?.map((tag: { tagId: string }) => tag.tagId) || [],
            publishedAt: article.scheduledAt
                ? dayjs(article.scheduledAt)
                : article.publishedAt
                    ? dayjs(article.publishedAt)
                    : undefined,
            content: article.content || '',
            editorial: {
                spotlightLabel: article.editorial?.spotlightLabel,
                heroCaption: article.editorial?.heroCaption,
                authorName: article.editorial?.authorName,
                authorHandle: article.editorial?.authorHandle,
                authorTitle: article.editorial?.authorTitle,
                authorAvatar: article.editorial?.authorAvatar,
                authorBio: article.editorial?.authorBio,
                readingMinutes: article.editorial?.readingMinutes,
                topics: article.editorial?.topics || [],
                routeTitle: article.editorial?.routeTitle,
                routeDescription: article.editorial?.routeDescription,
                routeAddress: article.editorial?.routeAddress,
                routeMapUrl: article.editorial?.routeMapUrl,
                routeDownloadUrl: article.editorial?.routeDownloadUrl,
                routeStops: article.editorial?.routeStops || [],
            },
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
            if (thumbnailInputRef.current) {
                thumbnailInputRef.current.value = '';
            }
        }
    };

    const onFinish = async (values: any) => {
        if (!id) return false;
        const shouldPublishAfterSave = publishAfterSaveRef.current;
        publishAfterSaveRef.current = false;
        const response = await updateArticle({
            ...values,
            content: typeof values.content === 'string' ? values.content : JSON.stringify(values.content),
            id,
            publishedAt: values.publishedAt ? dayjs(values.publishedAt).toISOString() : null,
        });
        if (!response.succeeded) {
            message.error(response.message || 'Không thể cập nhật bài viết.');
            return false;
        }

        if (shouldPublishAfterSave) {
            const publishResponse = await publishArticle(id);
            if (!publishResponse.succeeded) {
                message.error(publishResponse.message || 'Không thể xuất bản bài viết.');
                return false;
            }
            message.success('Đã lưu và xuất bản bài viết.');
        } else {
            message.success('Đã lưu bài viết.');
        }
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
                    <Button icon={<SaveOutlined />} onClick={() => {
                        publishAfterSaveRef.current = false;
                        form.submit();
                    }}>Lưu nháp</Button>
                    <Button type="primary" onClick={() => {
                        publishAfterSaveRef.current = true;
                        form.submit();
                    }} icon={<SendOutlined />}>Xuất bản</Button>
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
                            <FormEditor name="content" label="Nội dung" initialValue={article?.content} />
                        </ProCard>
                    </div>
                    <div className="md:w-96">
                        <div className="mb-4">
                            <ProCard title="Thông tin phân loại">
                                <ProFormTreeSelect
                                    name="categoryId"
                                    label="Danh mục"
                                    request={() => apiArticleCategoryTreeOptions({ locale: article?.locale || 'vi-VN' })}
                                    fieldProps={{ showSearch: true, treeDefaultExpandAll: true, treeNodeFilterProp: 'label' }}
                                />
                                <ProFormSelect
                                    name="tagIds"
                                    label="Thẻ bài viết"
                                    mode="multiple"
                                    request={apiTagOptions}
                                    placeholder="Chọn thẻ"
                                />
                                <ProFormDateTimePicker name="publishedAt" label="Ngày xuất bản" width="xl" />
                                <ProFormSwitch name="isFeatured" label="Bài viết tiêu điểm" />
                            </ProCard>
                        </div>
                        <ProCard title={<div><span className="text-blue-500 mr-1"><PictureOutlined /></span>Ảnh đại diện (Featured)</div>}>
                            <div className="border rounded p-1 mb-2">
                                <img src={thumbnail} alt="Thumbnail" className="w-full h-52 rounded object-cover" />
                            </div>
                            <ProFormText name="thumbnail" label="Thumbnail URL" />
                            <Button type="dashed" block onClick={() => setOpenImagePicker(true)}>Chọn từ thư viện ảnh</Button>
                            <ImagePicker
                                open={openImagePicker}
                                onOpenChange={setOpenImagePicker}
                                value={thumbnail}
                                onChange={(url) => formRef.current?.setFieldValue('thumbnail', url)}
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
                <ProCard title="Thông tin bài viết tạp chí" className="mt-4">
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <ProFormText name={['editorial', 'spotlightLabel']} label="Nhãn tiêu điểm" placeholder="Ví dụ: Tiêu điểm Thổ Địa" />
                            <ProFormText name={['editorial', 'heroCaption']} label="Chú thích ảnh bìa" />
                            <ProFormDigit name={['editorial', 'readingMinutes']} label="Thời gian đọc (phút)" min={1} max={120} fieldProps={{ precision: 0 }} />
                            <ProFormSelect
                                name={['editorial', 'topics']}
                                label="Chủ đề / hashtag"
                                mode="tags"
                                placeholder="Nhập chủ đề rồi nhấn Enter"
                                fieldProps={{ tokenSeparators: [','] }}
                            />
                        </Col>
                        <Col xs={24} md={12}>
                            <ProFormText name={['editorial', 'authorName']} label="Tên tác giả hiển thị" />
                            <ProFormText name={['editorial', 'authorHandle']} label="Tài khoản tác giả" placeholder="@ten-tac-gia" />
                            <ProFormText name={['editorial', 'authorTitle']} label="Vai trò / danh xưng" />
                            <ProFormText name={['editorial', 'authorAvatar']} label="URL ảnh tác giả" />
                            <ProFormTextArea name={['editorial', 'authorBio']} label="Giới thiệu tác giả" />
                        </Col>
                    </Row>
                    <ProCard title="Bản đồ & hành trình" type="inner" className="mb-4">
                        <Row gutter={16}>
                            <Col xs={24} md={12}>
                                <ProFormText name={['editorial', 'routeTitle']} label="Tiêu đề hành trình" />
                                <ProFormTextArea name={['editorial', 'routeDescription']} label="Mô tả hành trình" />
                                <ProFormText name={['editorial', 'routeAddress']} label="Khu vực / địa chỉ" />
                            </Col>
                            <Col xs={24} md={12}>
                                <ProFormText name={['editorial', 'routeMapUrl']} label="Liên kết Google Maps" />
                                <ProFormText name={['editorial', 'routeDownloadUrl']} label="Liên kết tải GPX/KML" />
                            </Col>
                        </Row>
                        <ProFormList
                            name={['editorial', 'routeStops']}
                            label="Điểm dừng chân"
                            creatorButtonProps={{ creatorButtonText: 'Thêm điểm dừng' }}
                            copyIconProps={false}
                            itemRender={({ listDom }, { index }) => (
                                <ProCard key={index} type="inner" className="mb-3" title={`Điểm dừng #${index + 1}`}>
                                    {listDom}
                                </ProCard>
                            )}
                        >
                            <Row gutter={12}>
                                <Col xs={24} md={12}><ProFormText name="name" label="Tên địa điểm" /></Col>
                                <Col xs={24} md={12}><ProFormText name="imageUrl" label="URL ảnh" /></Col>
                                <Col xs={24} md={12}><ProFormText name="address" label="Địa chỉ" /></Col>
                                <Col xs={24} md={12}><ProFormText name="mapsUrl" label="Liên kết chỉ đường" /></Col>
                                <Col xs={24} md={12}><ProFormText name="priceRange" label="Khoảng giá" /></Col>
                                <Col xs={24} md={12}><ProFormText name="openingHours" label="Giờ mở cửa" /></Col>
                                <Col span={24}><ProFormText name="voucher" label="Mã ưu đãi" /></Col>
                            </Row>
                        </ProFormList>
                    </ProCard>
                </ProCard>
            </ProForm>
        </PageContainer>
    )
}

export default Index;