import {
    apiVideoCreateExternal,
    apiVideoDelete,
    apiVideoList,
    apiVideoUpdate,
    apiVideoUpload,
} from '@/services/video';
import {
    DeleteOutlined,
    EditOutlined,
    LinkOutlined,
    PlayCircleOutlined,
    PlusOutlined,
    UploadOutlined,
} from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Space, Tabs, Tag, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import dayjs from 'dayjs';
import { useMemo, useRef, useState } from 'react';

type VideoFormValues = {
    name?: string;
    description?: string;
    url?: string;
    thumbnailUrl?: string;
    durationSeconds?: number;
};

const sourceTypeLabel: Record<number, string> = {
    0: 'Uploaded',
    1: 'External',
};

const Index: React.FC = () => {
    const actionRef = useRef<ActionType>(null);
    const [createOpen, setCreateOpen] = useState<boolean>(false);
    const [createTab, setCreateTab] = useState<'upload' | 'external'>('upload');
    const [uploadFileList, setUploadFileList] = useState<UploadFile[]>([]);
    const [uploadForm] = Form.useForm<VideoFormValues>();
    const [externalForm] = Form.useForm<VideoFormValues>();
    const [editingItem, setEditingItem] = useState<API.Video | null>(null);

    const sourceOptions = useMemo(
        () => [
            { label: 'Uploaded', value: 0 },
            { label: 'External', value: 1 },
        ],
        []
    );

    const openCreateModal = (tab: 'upload' | 'external') => {
        setCreateTab(tab);
        uploadForm.resetFields();
        externalForm.resetFields();
        setUploadFileList([]);
        setCreateOpen(true);
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;
        await apiVideoDelete(id);
        message.success('Deleted video');
        actionRef.current?.reload();
    };

    const handleCreateUpload = async () => {
        const values = await uploadForm.validateFields();
        const file = uploadFileList[0]?.originFileObj;
        if (!file) {
            message.warning('Vui lòng chọn file video');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (values.name) formData.append('name', values.name);
        if (values.description) formData.append('description', values.description);
        if (values.thumbnailUrl) formData.append('thumbnailUrl', values.thumbnailUrl);
        if (typeof values.durationSeconds === 'number') {
            formData.append('durationSeconds', String(values.durationSeconds));
        }

        await apiVideoUpload(formData);
        message.success('Upload video thành công');
        setCreateOpen(false);
        actionRef.current?.reload();
    };

    const handleCreateExternal = async () => {
        const values = await externalForm.validateFields();
        await apiVideoCreateExternal({
            name: values.name,
            description: values.description,
            url: values.url!,
            thumbnailUrl: values.thumbnailUrl,
            durationSeconds: values.durationSeconds,
        });

        message.success('Đã thêm video external');
        setCreateOpen(false);
        actionRef.current?.reload();
    };

    const columns: ProColumns<API.Video>[] = [
        {
            title: '#',
            valueType: 'indexBorder',
            width: 48,
            align: 'center',
            search: false,
        },
        {
            title: 'Video',
            dataIndex: 'name',
            render: (_, item) => (
                <div className="flex flex-col gap-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-xs text-slate-500">{item.provider || 'local'}</div>
                </div>
            ),
        },
        {
            title: 'Nguồn',
            dataIndex: 'sourceType',
            valueType: 'select',
            fieldProps: {
                options: sourceOptions,
            },
            render: (_, item) => (
                <Tag color={item.sourceType === 0 ? 'blue' : 'green'}>{sourceTypeLabel[item.sourceType]}</Tag>
            ),
            width: 120,
        },
        {
            title: 'Link',
            dataIndex: 'url',
            search: false,
            render: (_, item) => (
                <Space>
                    {item.sourceType === 0 ? <PlayCircleOutlined /> : <LinkOutlined />}
                    <a href={item.url} target="_blank" rel="noreferrer">
                        Open
                    </a>
                </Space>
            ),
            width: 120,
        },
        {
            title: 'Dung lượng',
            dataIndex: 'size',
            search: false,
            width: 120,
            render: (_, item) => {
                if (!item.size) return '-';
                const mb = Number(item.size) / 1024 / 1024;
                return `${mb.toFixed(2)} MB`;
            },
        },
        {
            title: 'Thời lượng (s)',
            dataIndex: 'durationSeconds',
            search: false,
            width: 120,
            align: 'right',
        },
        {
            title: 'Tạo lúc',
            dataIndex: 'createdDate',
            valueType: 'dateTime',
            search: false,
            width: 170,
            render: (_, item) => dayjs(item.createdDate).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Thao tác',
            valueType: 'option',
            width: 120,
            render: (_, item) => [
                <Button
                    key="edit"
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => {
                        setEditingItem(item);
                    }}
                />,
                <Popconfirm
                    key="delete"
                    title="Xóa video này?"
                    okText="Xóa"
                    cancelText="Hủy"
                    onConfirm={() => handleDelete(item.id)}
                >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>,
            ],
        },
    ];

    return (
        <PageContainer>
            <ProTable<API.Video>
                actionRef={actionRef}
                rowKey="id"
                columns={columns}
                search={{ layout: 'vertical' }}
                request={async (params) =>
                    apiVideoList({
                        current: params.current,
                        pageSize: params.pageSize,
                        keyword: params.name,
                        sourceType: params.sourceType,
                    })
                }
                toolBarRender={() => [
                    <Button key="upload" type="primary" icon={<UploadOutlined />} onClick={() => openCreateModal('upload')}>
                        Upload Video
                    </Button>,
                    <Button key="external" icon={<PlusOutlined />} onClick={() => openCreateModal('external')}>
                        Thêm Link YouTube/External
                    </Button>,
                ]}
            />

            <Modal
                open={createOpen}
                title="Thêm video"
                okText={createTab === 'upload' ? 'Upload' : 'Lưu'}
                cancelText="Hủy"
                onCancel={() => setCreateOpen(false)}
                onOk={async () => {
                    if (createTab === 'upload') {
                        await handleCreateUpload();
                        return;
                    }
                    await handleCreateExternal();
                }}
            >
                <Tabs
                    activeKey={createTab}
                    onChange={(next) => setCreateTab(next as 'upload' | 'external')}
                    items={[
                        {
                            key: 'upload',
                            label: 'Upload file',
                            children: (
                                <Form layout="vertical" form={uploadForm}>
                                    <Form.Item label="Tên video" name="name">
                                        <Input maxLength={260} />
                                    </Form.Item>
                                    <Form.Item label="Mô tả" name="description">
                                        <Input.TextArea rows={3} maxLength={1000} />
                                    </Form.Item>
                                    <Form.Item
                                        label="File video"
                                        required
                                        help="Hỗ trợ mp4, webm, mov, m4v, avi, mkv. Tối đa 200MB"
                                    >
                                        <Upload
                                            beforeUpload={() => false}
                                            maxCount={1}
                                            fileList={uploadFileList}
                                            onChange={({ fileList }) => setUploadFileList(fileList)}
                                            accept="video/*,.mp4,.webm,.mov,.m4v,.avi,.mkv"
                                        >
                                            <Button icon={<UploadOutlined />}>Chọn file</Button>
                                        </Upload>
                                    </Form.Item>
                                    <Form.Item label="Thumbnail URL" name="thumbnailUrl">
                                        <Input placeholder="https://..." />
                                    </Form.Item>
                                    <Form.Item label="Thời lượng (giây)" name="durationSeconds">
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Form>
                            ),
                        },
                        {
                            key: 'external',
                            label: 'YouTube / External',
                            children: (
                                <Form layout="vertical" form={externalForm}>
                                    <Form.Item label="Tên video" name="name">
                                        <Input maxLength={260} />
                                    </Form.Item>
                                    <Form.Item label="Mô tả" name="description">
                                        <Input.TextArea rows={3} maxLength={1000} />
                                    </Form.Item>
                                    <Form.Item
                                        label="Video URL"
                                        name="url"
                                        rules={[{ required: true, message: 'Vui lòng nhập URL video' }]}
                                    >
                                        <Input placeholder="https://www.youtube.com/watch?v=..." />
                                    </Form.Item>
                                    <Form.Item label="Thumbnail URL" name="thumbnailUrl">
                                        <Input placeholder="https://..." />
                                    </Form.Item>
                                    <Form.Item label="Thời lượng (giây)" name="durationSeconds">
                                        <InputNumber min={0} style={{ width: '100%' }} />
                                    </Form.Item>
                                </Form>
                            ),
                        },
                    ]}
                />
            </Modal>

            <ModalForm<VideoFormValues>
                title="Cập nhật video"
                open={!!editingItem}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingItem(null);
                    }
                }}
                initialValues={{
                    name: editingItem?.name,
                    description: editingItem?.description,
                    thumbnailUrl: editingItem?.thumbnailUrl,
                    durationSeconds: editingItem?.durationSeconds,
                    url: editingItem?.sourceType === 1 ? editingItem?.url : undefined,
                }}
                onFinish={async (values) => {
                    if (!editingItem?.id) return false;
                    await apiVideoUpdate(editingItem.id, {
                        name: values.name,
                        description: values.description,
                        thumbnailUrl: values.thumbnailUrl,
                        durationSeconds: values.durationSeconds,
                        url: editingItem.sourceType === 1 ? values.url : undefined,
                    });
                    message.success('Cập nhật thành công');
                    setEditingItem(null);
                    actionRef.current?.reload();
                    return true;
                }}
            >
                <Form.Item label="Tên video" name="name" rules={[{ required: true, message: 'Vui lòng nhập tên video' }]}>
                    <Input maxLength={260} />
                </Form.Item>
                <Form.Item label="Mô tả" name="description">
                    <Input.TextArea rows={3} maxLength={1000} />
                </Form.Item>
                {editingItem?.sourceType === 1 && (
                    <Form.Item
                        label="Video URL"
                        name="url"
                        rules={[{ required: true, message: 'Vui lòng nhập URL video' }]}
                    >
                        <Input placeholder="https://www.youtube.com/watch?v=..." />
                    </Form.Item>
                )}
                <Form.Item label="Thumbnail URL" name="thumbnailUrl">
                    <Input placeholder="https://..." />
                </Form.Item>
                <Form.Item label="Thời lượng (giây)" name="durationSeconds">
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
            </ModalForm>
        </PageContainer>
    );
};

export default Index;