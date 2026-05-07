import {
  apiAlbumImageDelete,
  apiAlbumImageList,
  apiAlbumImageUpload,
  apiImageAlbumCreate,
  apiImageAlbumDelete,
  apiImageAlbumList,
  apiImageAlbumUpdate,
} from '@/services/image-library';
import {
  DeleteOutlined,
  EditOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Card, Col, Empty, Form, Image, Input, Modal, Popconfirm, Row, Upload, message } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useRef, useState } from 'react';

const ImageLibraryPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [selectedAlbum, setSelectedAlbum] = useState<API.ImageAlbum | null>(null);
  const [images, setImages] = useState<API.ImageLibraryItem[]>([]);
  const [loadingImages, setLoadingImages] = useState<boolean>(false);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingAlbum, setEditingAlbum] = useState<API.ImageAlbum | null>(null);
  const [albumForm] = Form.useForm();

  const [uploading, setUploading] = useState<boolean>(false);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const loadImages = async (albumId?: string) => {
    if (!albumId) {
      setImages([]);
      return;
    }

    try {
      setLoadingImages(true);
      const response = await apiAlbumImageList({ current: 1, pageSize: 100, albumId });
      setImages(response?.data || []);
    } finally {
      setLoadingImages(false);
    }
  };

  useEffect(() => {
    loadImages(selectedAlbum?.id);
  }, [selectedAlbum?.id]);

  const openCreateModal = () => {
    setEditingAlbum(null);
    albumForm.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (album: API.ImageAlbum) => {
    setEditingAlbum(album);
    albumForm.setFieldsValue({
      name: album.name,
      description: album.description,
    });
    setModalOpen(true);
  };

  const saveAlbum = async () => {
    const values = await albumForm.validateFields();
    if (editingAlbum?.id) {
      await apiImageAlbumUpdate(values);
      message.success('Đã cập nhật album');
    } else {
      await apiImageAlbumCreate(values);
      message.success('Đã tạo album');
    }
    setModalOpen(false);
    actionRef.current?.reload();
  };

  const deleteAlbum = async (album: API.ImageAlbum) => {
    if (!album.id) return;
    await apiImageAlbumDelete(album.id);
    message.success('Đã xóa album');
    if (selectedAlbum?.id === album.id) {
      setSelectedAlbum(null);
      setImages([]);
    }
    actionRef.current?.reload();
  };

  const uploadImages = async () => {
    if (!selectedAlbum?.id) {
      message.warning('Vui lòng chọn album');
      return;
    }
    if (fileList.length === 0) {
      message.warning('Vui lòng chọn ảnh');
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      const raw = file.originFileObj;
      if (raw) {
        formData.append('files', raw);
      }
    });

    try {
      setUploading(true);
      await apiAlbumImageUpload(selectedAlbum.id, formData);
      message.success('Tải ảnh lên thành công');
      setFileList([]);
      await loadImages(selectedAlbum.id);
      actionRef.current?.reload();
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imageId?: string) => {
    if (!imageId || !selectedAlbum?.id) return;
    await apiAlbumImageDelete(imageId);
    message.success('Đã xóa ảnh');
    await loadImages(selectedAlbum.id);
    actionRef.current?.reload();
  };

  const columns: ProColumns<API.ImageAlbum>[] = [
    {
      title: 'Tên album',
      dataIndex: 'name',
      render: (_, entity) => (
        <Button
          type={selectedAlbum?.id === entity.id ? 'primary' : 'link'}
          onClick={() => setSelectedAlbum(entity)}
          icon={<FolderOpenOutlined />}
        >
          {entity.name}
        </Button>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: 'Slug',
      dataIndex: 'normalizedName',
      search: false,
    },
    {
      title: 'Số ảnh',
      dataIndex: 'imageCount',
      search: false,
      width: 90,
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 100,
      render: (_, entity) => [
        <Button key="edit" type="text" icon={<EditOutlined />} onClick={() => openEditModal(entity)} />,
        <Popconfirm
          key="delete"
          title="Xóa album này?"
          onConfirm={() => deleteAlbum(entity)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col xl={10} lg={11} xs={24}>
          <ProTable<API.ImageAlbum>
            actionRef={actionRef}
            rowKey="id"
            search={{ layout: 'vertical' }}
            columns={columns}
            request={apiImageAlbumList}
            toolBarRender={() => [
              <Button key="new" type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                Thêm album
              </Button>,
            ]}
            pagination={{ defaultPageSize: 8 }}
          />
        </Col>

        <Col xl={14} lg={13} xs={24}>
          <Card
            title={selectedAlbum ? `Album: ${selectedAlbum.name}` : 'Ảnh trong album'}
            extra={
              <div className="flex gap-2">
                <Upload
                  multiple
                  accept="image/*"
                  beforeUpload={() => false}
                  fileList={fileList}
                  onChange={({ fileList: next }) => setFileList(next)}
                >
                  <Button icon={<PlusOutlined />}>Chọn ảnh</Button>
                </Upload>
                <Button type="primary" icon={<UploadOutlined />} onClick={uploadImages} loading={uploading}>
                  Upload
                </Button>
              </div>
            }
            loading={loadingImages}
          >
            {!selectedAlbum ? (
              <Empty description="Chọn một album để quản lý ảnh" />
            ) : images.length === 0 ? (
              <Empty description="Album chưa có ảnh" />
            ) : (
              <Row gutter={[12, 12]}>
                {images.map((image) => (
                  <Col key={image.id} xl={8} md={12} xs={24}>
                    <Card
                      hoverable
                      cover={<Image src={image.url} alt={image.name} style={{ height: 180, objectFit: 'cover' }} />}
                      actions={[
                        <Popconfirm
                          key="delete"
                          title="Xóa ảnh này?"
                          onConfirm={() => deleteImage(image.id)}
                          okText="Xóa"
                          cancelText="Hủy"
                        >
                          <DeleteOutlined />
                        </Popconfirm>,
                      ]}
                    >
                      <Card.Meta title={image.name} description={new Date(image.uploadedAt).toLocaleString()} />
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        open={modalOpen}
        title={editingAlbum ? 'Cập nhật album' : 'Thêm album'}
        okText={editingAlbum ? 'Cập nhật' : 'Tạo mới'}
        cancelText="Hủy"
        onCancel={() => setModalOpen(false)}
        onOk={saveAlbum}
      >
        <Form form={albumForm} layout="vertical">
          <Form.Item
            label="Tên album"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên album' }]}
          >
            <Input maxLength={200} />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} maxLength={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ImageLibraryPage;