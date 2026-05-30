import {
  apiAlbumImageList,
  apiAlbumImageUpload,
  apiImageAlbumCreate,
  apiImageAlbumList,
} from '@/services/image-library';
import {
  FolderOpenOutlined,
  InboxOutlined,
  PlusOutlined,
  ReloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  Badge,
  Button,
  Empty,
  Form,
  Image,
  Input,
  Modal,
  Select,
  Space,
  Spin,
  Tag,
  Upload,
  message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useMemo, useState } from 'react';

type ImageLibraryPickerProps = {
  value?: string;
  onChange?: (url: string) => void;
};

const ImageLibraryPicker: React.FC<ImageLibraryPickerProps> = ({ value, onChange }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loadingAlbums, setLoadingAlbums] = useState<boolean>(false);
  const [loadingImages, setLoadingImages] = useState<boolean>(false);
  const [albums, setAlbums] = useState<API.ImageAlbum[]>([]);
  const [albumId, setAlbumId] = useState<string>();
  const [images, setImages] = useState<API.ImageLibraryItem[]>([]);
  const [keyword, setKeyword] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [creatingAlbum, setCreatingAlbum] = useState<boolean>(false);
  const [createAlbumOpen, setCreateAlbumOpen] = useState<boolean>(false);
  const [albumForm] = Form.useForm();

  const selectedAlbum = useMemo(() => albums.find((item) => item.id === albumId), [albums, albumId]);

  const loadAlbums = async () => {
    try {
      setLoadingAlbums(true);
      const response = await apiImageAlbumList({ current: 1, pageSize: 100 });
      const data: API.ImageAlbum[] = response?.data || [];
      setAlbums(data);
      if (!albumId && data.length > 0) {
        setAlbumId(data[0].id);
      }
    } finally {
      setLoadingAlbums(false);
    }
  };

  const loadImages = async (selectedAlbumId?: string) => {
    if (!selectedAlbumId) {
      setImages([]);
      return;
    }

    try {
      setLoadingImages(true);
      const response = await apiAlbumImageList({ current: 1, pageSize: 100, albumId: selectedAlbumId });
      setImages(response?.data || []);
    } finally {
      setLoadingImages(false);
    }
  };

  const uploadImages = async () => {
    if (!albumId) {
      message.warning('Vui long chon album truoc khi upload');
      return;
    }

    if (fileList.length === 0) {
      message.warning('Vui long chon anh');
      return;
    }

    const formData = new FormData();
    fileList.forEach((file) => {
      const raw = file.originFileObj;
      if (raw) {
        formData.append('files', raw);
      }
    });

    if (!formData.has('files')) {
      message.warning('Khong tim thay file hop le de upload');
      return;
    }

    try {
      setUploading(true);
      await apiAlbumImageUpload(albumId, formData);
      message.success('Upload anh thanh cong');
      setFileList([]);
      await loadImages(albumId);
    } finally {
      setUploading(false);
    }
  };

  const createAlbum = async () => {
    try {
      const values = await albumForm.validateFields();
      setCreatingAlbum(true);
      await apiImageAlbumCreate({
        name: values.name,
        description: values.description,
      });
      message.success('Tao album thanh cong');

      const response = await apiImageAlbumList({ current: 1, pageSize: 100 });
      const data: API.ImageAlbum[] = response?.data || [];
      setAlbums(data);

      const created = data.find((item) => item.name === values.name);
      if (created?.id) {
        setAlbumId(created.id);
        await loadImages(created.id);
      }

      albumForm.resetFields();
      setCreateAlbumOpen(false);
    } finally {
      setCreatingAlbum(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    loadAlbums();
  }, [open]);

  useEffect(() => {
    if (open) return;
    setKeyword('');
    setFileList([]);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    loadImages(albumId);
  }, [albumId, open]);

  const filteredImages = useMemo(() => {
    if (!keyword.trim()) return images;
    const normalizedKeyword = keyword.trim().toLowerCase();
    return images.filter((image) => image.name?.toLowerCase().includes(normalizedKeyword));
  }, [images, keyword]);

  return (
    <>
      <Button
        size="small"
        icon={<FolderOpenOutlined />}
        onClick={() => setOpen(true)}
      >
        Image library
      </Button>

      <Modal
        title="Chon anh tu image library"
        open={open}
        footer={
          <Space>
            <Button onClick={() => setOpen(false)}>Dong</Button>
          </Space>
        }
        width={920}
        onCancel={() => setOpen(false)}
      >
        <div className="mb-4 rounded border border-gray-200 bg-gray-50 p-3">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Select
              className="min-w-64 flex-1"
              loading={loadingAlbums}
              value={albumId}
              placeholder="Chon album"
              showSearch
              optionFilterProp="label"
              onChange={(nextAlbumId) => setAlbumId(nextAlbumId)}
              options={albums.map((album) => ({
                label: `${album.name}${album.imageCount ? ` (${album.imageCount})` : ''}`,
                value: album.id,
              }))}
            />
            <Button icon={<ReloadOutlined />} onClick={() => loadAlbums()}>
              Tai lai
            </Button>
            <Button type="dashed" icon={<PlusOutlined />} onClick={() => setCreateAlbumOpen(true)}>
              Tao album
            </Button>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Input
              allowClear
              className="min-w-64 flex-1"
              placeholder="Tim theo ten anh"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <Tag color={selectedAlbum ? 'blue' : 'default'}>
              {selectedAlbum ? `Album: ${selectedAlbum.name}` : 'Chua chon album'}
            </Tag>
            <Tag>{`${filteredImages.length} anh`}</Tag>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Upload
              multiple
              accept="image/*"
              beforeUpload={() => false}
              fileList={fileList}
              listType="picture"
              onChange={({ fileList: next }) => setFileList(next)}
            >
              <Button icon={<InboxOutlined />}>Chon anh</Button>
            </Upload>
            <Badge count={fileList.length}>
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={uploadImages}
                loading={uploading}
                disabled={!albumId || fileList.length === 0}
              >
                Upload vao album
              </Button>
            </Badge>
          </div>
        </div>

        {loadingImages ? (
          <div className="rounded border border-gray-200 py-10 text-center">
            <Spin />
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="rounded border border-dashed border-gray-300 py-10">
            <Empty description="Khong co anh" />
          </div>
        ) : (
          <div className="grid max-h-[56vh] grid-cols-2 gap-3 overflow-y-auto pr-1 md:grid-cols-4">
            {filteredImages.map((image) => {
              const selected = value === image.url;

              return (
                <button
                  key={image.id}
                  type="button"
                  className={`group overflow-hidden rounded border bg-white text-left transition ${selected ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'}`}
                  onClick={() => {
                    onChange?.(image.url);
                    setOpen(false);
                  }}
                >
                  <Image
                    preview={false}
                    src={image.url}
                    alt={image.name}
                    className="h-36 w-full object-cover"
                  />
                  <div className="truncate px-2 py-1 text-xs">{image.name}</div>
                  <div className="px-2 pb-2">
                    <span className={`text-xs ${selected ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'}`}>
                      {selected ? 'Dang duoc chon' : 'Nhan de chon anh'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </Modal>

      <Modal
        title="Tao album moi"
        open={createAlbumOpen}
        okText="Tao"
        cancelText="Huy"
        confirmLoading={creatingAlbum}
        onCancel={() => setCreateAlbumOpen(false)}
        onOk={createAlbum}
      >
        <Form form={albumForm} layout="vertical">
          <Form.Item
            label="Ten album"
            name="name"
            rules={[{ required: true, message: 'Vui long nhap ten album' }]}
          >
            <Input maxLength={200} />
          </Form.Item>
          <Form.Item label="Mo ta" name="description">
            <Input.TextArea rows={3} maxLength={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ImageLibraryPicker;