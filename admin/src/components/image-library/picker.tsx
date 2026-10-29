import {
  apiAlbumImageList,
  apiAlbumImageUpload,
  apiImageAlbumCreate,
  apiImageAlbumList,
} from '@/services/image-library';
import {
  AppstoreOutlined,
  CheckOutlined,
  CloudUploadOutlined,
  CloseOutlined,
  FileImageOutlined,
  FolderOpenOutlined,
  InboxOutlined,
  LinkOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UnorderedListOutlined,
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
  ModalProps,
  Select,
  Spin,
  Upload,
  message,
} from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { useEffect, useMemo, useState } from 'react';

type ImageLibraryPickerProps = ModalProps & {
  value?: string;
  onOpenChange?: (open: boolean) => void;
  onChange?: (url: string) => void;
};

const ImagePicker: React.FC<ImageLibraryPickerProps> = ({ value, onOpenChange, onChange, ...rest }) => {
  const { open } = rest;
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
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'url'>('library');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedUrl, setSelectedUrl] = useState<string>();
  const [imageDimensions, setImageDimensions] = useState<string>();
  const [externalUrl, setExternalUrl] = useState<string>('');
  const [externalPreviewUrl, setExternalPreviewUrl] = useState<string>();
  const [externalUrlError, setExternalUrlError] = useState<string>();
  const [albumForm] = Form.useForm();

  const selectedAlbum = useMemo(() => albums.find((item) => item.id === albumId), [albums, albumId]);
  const selectedImage = useMemo(
    () => images.find((image) => image.url === selectedUrl),
    [images, selectedUrl],
  );

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
      message.warning('Vui lòng chọn album trước khi tải ảnh lên');
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

    if (!formData.has('files')) {
      message.warning('Không tìm thấy tệp hợp lệ để tải lên');
      return;
    }

    try {
      setUploading(true);
      await apiAlbumImageUpload(albumId, formData);
      message.success('Tải ảnh lên thành công');
      setFileList([]);
      await loadImages(albumId);
      setActiveTab('library');
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
      message.success('Tạo album thành công');

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
    setSelectedUrl(value);
  }, [open, value]);

  useEffect(() => {
    if (open) return;
    setKeyword('');
    setFileList([]);
    setActiveTab('library');
    setExternalUrl('');
    setExternalPreviewUrl(undefined);
    setExternalUrlError(undefined);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    loadImages(albumId);
  }, [albumId, open]);

  useEffect(() => {
    setImageDimensions(undefined);
  }, [selectedUrl]);

  const filteredImages = useMemo(() => {
    if (!keyword.trim()) return images;
    const normalizedKeyword = keyword.trim().toLowerCase();
    return images.filter((image) => image.name?.toLowerCase().includes(normalizedKeyword));
  }, [images, keyword]);

  const closePicker = () => onOpenChange?.(false);

  const confirmSelection = () => {
    if (!selectedUrl) return;
    onChange?.(selectedUrl);
    closePicker();
  };

  const previewExternalUrl = () => {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(externalUrl.trim());
    } catch {
      setExternalUrlError('Vui lòng nhập một URL hợp lệ bắt đầu bằng http:// hoặc https://.');
      setExternalPreviewUrl(undefined);
      setSelectedUrl(undefined);
      return;
    }

    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      setExternalUrlError('Chỉ hỗ trợ URL ảnh bắt đầu bằng http:// hoặc https://.');
      setExternalPreviewUrl(undefined);
      setSelectedUrl(undefined);
      return;
    }

    setExternalUrlError(undefined);
    setImageDimensions(undefined);
    setSelectedUrl(undefined);
    setExternalPreviewUrl(parsedUrl.href);
  };

  const openExternalUrlTab = () => {
    setActiveTab('url');
    setSelectedUrl(externalPreviewUrl);
    if (!externalPreviewUrl) setImageDimensions(undefined);
    setExternalUrlError(undefined);
  };

  return (
    <>
      <Modal
        {...rest}
        title={null}
        footer={null}
        width={1180}
        onCancel={closePicker}
      >
        <div className="flex h-[min(88vh,900px)] min-h-[480px] flex-col overflow-hidden rounded-xl bg-surface text-on-surface">
          <header className="shrink-0 bg-slate-100-low px-5 py-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <FolderOpenOutlined className="text-lg text-secondary" />
                  <h2 className="m-0 text-lg font-semibold">Thư viện Media &amp; Chọn ảnh đại diện</h2>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-on-secondary-fixed">
                    Featured Image Picker
                  </span>
                </div>
                <p className="mb-0 mt-1 text-sm text-on-surface-variant">
                  Chọn ảnh từ thư viện hoặc tải tệp mới lên album.
                </p>
              </div>
            </div>

            <nav aria-label="Nguồn ảnh" className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                type={activeTab === 'library' ? 'default' : 'text'}
                icon={<AppstoreOutlined />}
                onClick={() => setActiveTab('library')}
              >
                Kho media có sẵn
                <span className="ml-1 rounded-full bg-slate-100-high px-1.5 py-0.5 text-xs">
                  {images.length}
                </span>
              </Button>
              <Button
                type={activeTab === 'upload' ? 'default' : 'text'}
                icon={<UploadOutlined />}
                onClick={() => setActiveTab('upload')}
              >
                Tải tệp mới lên
              </Button>
              <Button
                type={activeTab === 'url' ? 'default' : 'text'}
                icon={<LinkOutlined />}
                onClick={openExternalUrlTab}
              >
                Chèn từ URL bên ngoài
              </Button>
            </nav>
          </header>

          {activeTab !== 'url' && <section className="flex shrink-0 flex-wrap items-center gap-3 bg-white px-5 py-3 shadow-sm sm:px-6">
            <Input
              allowClear
              className="min-w-52 flex-1"
              prefix={<SearchOutlined className="text-on-surface-variant" />}
              placeholder="Tìm theo tên ảnh..."
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
            <Select
              className="min-w-52 flex-1 sm:max-w-xs"
              loading={loadingAlbums}
              value={albumId}
              placeholder="Chọn album"
              showSearch
              optionFilterProp="label"
              onChange={setAlbumId}
              options={albums.map((album) => ({
                label: `${album.name}${album.imageCount ? ` (${album.imageCount})` : ''}`,
                value: album.id,
              }))}
            />
            <Button icon={<ReloadOutlined />} aria-label="Tải lại album" onClick={() => loadAlbums()} />
            <Button icon={<PlusOutlined />} onClick={() => setCreateAlbumOpen(true)}>
              Tạo album
            </Button>
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5">
              <Button
                type={viewMode === 'grid' ? 'default' : 'text'}
                size="small"
                aria-label="Hiển thị dạng lưới"
                icon={<AppstoreOutlined />}
                onClick={() => setViewMode('grid')}
              />
              <Button
                type={viewMode === 'list' ? 'default' : 'text'}
                size="small"
                aria-label="Hiển thị dạng danh sách"
                icon={<UnorderedListOutlined />}
                onClick={() => setViewMode('list')}
              />
            </div>
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={() => setActiveTab('upload')}
            >
              Tải ảnh từ máy
            </Button>
          </section>}

          <main className="grid min-h-0 flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_340px] lg:overflow-hidden">
            <section className="min-w-0 p-4 sm:p-5 lg:overflow-y-auto bg-gray-100">
              {activeTab === 'url' ? (
                <div className="mx-auto max-w-2xl">
                  <div className="mb-5">
                    <h3 className="mb-1 text-base font-semibold">Chèn ảnh từ URL bên ngoài</h3>
                    <p className="m-0 text-sm text-on-surface-variant">
                      Nhập địa chỉ ảnh công khai. URL sẽ được lưu làm ảnh đại diện, ảnh không được tải vào thư viện.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                      autoComplete="url"
                      prefix={<LinkOutlined className="text-on-surface-variant" />}
                      placeholder="https://example.com/image.jpg"
                      value={externalUrl}
                      status={externalUrlError ? 'error' : undefined}
                      onChange={(event) => {
                        setExternalUrl(event.target.value);
                        setExternalPreviewUrl(undefined);
                        setExternalUrlError(undefined);
                        setSelectedUrl(undefined);
                        setImageDimensions(undefined);
                      }}
                      onPressEnter={previewExternalUrl}
                    />
                    <Button type="primary" icon={<SearchOutlined />} onClick={previewExternalUrl}>
                      Xem trước
                    </Button>
                  </div>
                  {externalUrlError && (
                    <p role="alert" className="mb-0 mt-2 text-sm text-red-600">
                      {externalUrlError}
                    </p>
                  )}
                  {externalPreviewUrl && (
                    <div className="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white">
                      <div className="flex aspect-video items-center justify-center bg-slate-100">
                        <img
                          key={externalPreviewUrl}
                          src={externalPreviewUrl}
                          alt="Xem trước ảnh từ URL bên ngoài"
                          className="h-full w-full object-contain"
                          onLoad={(event) => {
                            const { naturalWidth, naturalHeight } = event.currentTarget;
                            if (naturalWidth && naturalHeight) {
                              setImageDimensions(`${naturalWidth} × ${naturalHeight} px`);
                              setSelectedUrl(externalPreviewUrl);
                              setExternalUrlError(undefined);
                            }
                          }}
                          onError={() => {
                            setSelectedUrl(undefined);
                            setImageDimensions(undefined);
                            setExternalUrlError(
                              'Không thể tải ảnh từ URL này. Hãy kiểm tra địa chỉ và quyền truy cập công khai.',
                            );
                          }}
                        />
                      </div>
                      <div className="break-all p-3 text-sm text-on-surface-variant">{externalPreviewUrl}</div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'upload' ? (
                <div className="mx-auto max-w-2xl">
                  <div className="mb-4">
                    <h3 className="mb-1 text-base font-semibold">Tải ảnh mới lên</h3>
                    <p className="m-0 text-sm text-on-surface-variant">
                      Ảnh sẽ được thêm vào album đang chọn: {selectedAlbum?.name || 'chưa chọn album'}.
                    </p>
                  </div>
                  <Upload.Dragger
                    accept="image/*"
                    multiple
                    beforeUpload={() => false}
                    fileList={fileList}
                    onChange={({ fileList: next }) => setFileList(next)}
                  >
                    <p className="mb-2 text-3xl text-secondary">
                      <InboxOutlined />
                    </p>
                    <p className="mb-1 font-medium">Nhấn hoặc kéo ảnh vào khu vực này</p>
                    <p className="m-0 text-sm text-on-surface-variant">
                      Hỗ trợ tải lên nhiều ảnh cùng lúc.
                    </p>
                  </Upload.Dragger>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <Badge count={fileList.length} color="#006398">
                      <span className="pr-2 text-sm text-on-surface-variant">Ảnh đã chọn</span>
                    </Badge>
                    <Button
                      type="primary"
                      icon={<UploadOutlined />}
                      onClick={uploadImages}
                      loading={uploading}
                      disabled={!albumId || fileList.length === 0}
                    >
                      Tải lên album
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium">Kết quả lọc:</span>
                      <span className="rounded-full bg-slate-100-high px-2 py-0.5 font-medium">
                        {filteredImages.length} ảnh
                      </span>
                      {selectedAlbum && (
                        <span className="text-on-surface-variant">trong album “{selectedAlbum.name}”</span>
                      )}
                    </div>
                    <span className="text-sm text-on-surface-variant">
                      {keyword ? `Từ khóa: “${keyword}”` : 'Tất cả ảnh trong album'}
                    </span>
                  </div>

                  {loadingImages ? (
                    <div className="flex min-h-64 items-center justify-center">
                      <Spin />
                    </div>
                  ) : filteredImages.length === 0 ? (
                    <div className="flex min-h-64 items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white">
                      <Empty description={keyword ? 'Không tìm thấy ảnh phù hợp' : 'Album chưa có ảnh'} />
                    </div>
                  ) : (
                    <div
                      className={
                        viewMode === 'grid'
                          ? 'grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4'
                          : 'flex flex-col gap-2'
                      }
                    >
                      {filteredImages.map((image) => {
                        const selected = selectedUrl === image.url;
                        const fileType = image.type?.split('/').pop()?.toUpperCase() || 'ẢNH';

                        return (
                          <button
                            key={image.id}
                            type="button"
                            aria-pressed={selected}
                            className={`group relative min-w-0 overflow-hidden rounded-xl border border-white bg-white text-left transition hover:-translate-y-0.5 hover:shadow-md ${
                              viewMode === 'list' ? 'flex items-center gap-3 p-2' : ''
                            } ${
                              selected
                                ? 'border-blue-100 ring-2 ring-blue-200'
                                : 'border-gray-200/60'
                            }`}
                            onClick={() => setSelectedUrl(image.url)}
                          >
                            <div
                              className={`relative shrink-0 overflow-hidden bg-slate-100 ${
                                viewMode === 'list' ? 'h-16 w-24 rounded-md' : 'aspect-video w-full'
                              }`}
                            >
                              <Image
                                preview={false}
                                src={image.url}
                                alt={image.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                {fileType}
                              </span>
                              {selected && (
                                <span className="absolute right-2 text-xs top-2 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white shadow">
                                  <CheckOutlined />
                                </span>
                              )}
                            </div>
                            <div className={`min-w-0 ${viewMode === 'grid' ? 'p-2.5' : 'flex-1'}`}>
                              <div
                                className={`truncate text-sm font-medium ${
                                  selected ? 'text-secondary' : 'text-on-surface'
                                }`}
                                title={image.name}
                              >
                                {image.name}
                              </div>
                              <div className="mt-1 flex items-center justify-between gap-2 text-xs text-on-surface-variant">
                                <span className="truncate">{selected ? 'Đang chọn' : 'Nhấn để chọn'}</span>
                                {image.uploadedAt && (
                                  <span className="shrink-0">
                                    {new Date(image.uploadedAt).toLocaleDateString('vi-VN')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </section>

            <aside className="flex min-w-0 flex-col gap-4 border-t border-gray-200 bg-white p-4 sm:p-5 lg:overflow-y-auto lg:border-l lg:border-t-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="m-0 text-base font-semibold">Chi tiết ảnh được chọn</h3>
                {selectedUrl && (
                  <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-on-secondary-fixed">
                    Đang chọn
                  </span>
                )}
              </div>

              {selectedUrl ? (
                <>
                  <div className="overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      preview={false}
                      src={selectedUrl}
                      alt={selectedImage?.name || 'Ảnh đang chọn'}
                      className="aspect-video w-full object-contain"
                      onLoad={(event) => {
                        const { naturalWidth, naturalHeight } = event.currentTarget;
                        if (naturalWidth && naturalHeight) {
                          setImageDimensions(`${naturalWidth} × ${naturalHeight} px`);
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-on-surface-variant">Tên tệp</div>
                      <div className="break-all font-medium">{selectedImage?.name || selectedUrl}</div>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
                      <span className="text-on-surface-variant">Kích thước</span>
                      <span className="text-right font-medium">{imageDimensions || 'Đang tải thông tin ảnh'}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
                      <span className="text-on-surface-variant">Định dạng</span>
                      <span className="text-right font-medium">
                        {selectedImage?.type?.toUpperCase() || (selectedImage ? 'Không rõ' : 'URL bên ngoài')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
                      <span className="text-on-surface-variant">Album</span>
                      <span className="truncate text-right font-medium">
                        {selectedImage ? selectedAlbum?.name || '—' : 'Không áp dụng'}
                      </span>
                    </div>
                    {selectedImage?.uploadedAt && (
                      <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-3">
                        <span className="text-on-surface-variant">Tải lên</span>
                        <span className="text-right font-medium">
                          {new Date(selectedImage.uploadedAt).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-outline-variant p-6 text-center text-on-surface-variant">
                  <FileImageOutlined className="text-3xl" />
                  <p className="m-0 text-sm">Chọn một ảnh để xem thông tin chi tiết.</p>
                </div>
              )}
            </aside>
          </main>

          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              {selectedUrl ? (
                <Image
                  preview={false}
                  src={selectedUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-on-surface-variant">
                  <FileImageOutlined />
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">
                  {selectedUrl
                    ? `Đã chọn: ${selectedImage?.name || 'URL bên ngoài'}`
                    : 'Chưa chọn ảnh'}
                </div>
                <div className="truncate text-xs text-on-surface-variant">
                  {imageDimensions ||
                    (selectedImage ? selectedAlbum?.name : selectedUrl ? 'URL bên ngoài' : selectedAlbum?.name) ||
                    'Chọn ảnh từ thư viện media'}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Button onClick={closePicker}>Hủy bỏ</Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                disabled={!selectedUrl}
                onClick={confirmSelection}
              >
                Chọn làm ảnh đại diện
              </Button>
            </div>
          </footer>
        </div>
      </Modal>

      <Modal
        title="Tạo album mới"
        open={createAlbumOpen}
        okText="Tạo"
        cancelText="Hủy"
        confirmLoading={creatingAlbum}
        onCancel={() => setCreateAlbumOpen(false)}
        onOk={createAlbum}
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
            <Input.TextArea rows={3} maxLength={1000} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ImagePicker;
