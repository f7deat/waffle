import WfUpload from '@/components/file-explorer/upload';
import {
  apiMultiUpload,
  countFile,
  deleteFileContent,
  listFile,
  totalFileSize,
  updateFileContent,
} from '@/services/file-service';
import { apiFolderDelete, apiFolderList, apiFolderUpdate } from '@/services/folder';
import {
  ArrowsAltOutlined,
  ArrowUpOutlined,
  ClearOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileFilled,
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  FolderAddOutlined,
  FolderFilled,
  MoreOutlined,
  SettingOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Alert,
  Avatar,
  Card,
  Breadcrumb,
  Button,
  Col,
  Divider,
  Dropdown,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Progress,
  Row,
  Segmented,
  Select,
  Space,
  Statistic,
  Tag,
  Typography,
  UploadFile,
} from 'antd';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FolderForm from './components/folder-form';
import { formatFileSize } from './utils';
import FilePreview from './components/preview';
import { RcFile } from 'antd/lib/upload';

type FolderPathItem = {
  id: string;
  name: string;
};

type FolderOption = {
  id: string;
  name: string;
  parentId?: string;
  pathLabel: string;
};

const FilePage: React.FC = () => {
  const { Text, Title } = Typography;
  const actionRef = useRef<ActionType>(null);
  const [renameForm] = Form.useForm();
  const [moveForm] = Form.useForm();

  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [folderTrail, setFolderTrail] = useState<FolderPathItem[]>([]);
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<API.FileListItem | null>(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<API.FileListItem[]>([]);
  const [actionEntity, setActionEntity] = useState<API.FileListItem | null>(null);
  const [renameOpen, setRenameOpen] = useState<boolean>(false);
  const [moveOpen, setMoveOpen] = useState<boolean>(false);
  const [folderOptions, setFolderOptions] = useState<FolderOption[]>([]);
  const [dragEntity, setDragEntity] = useState<API.FileListItem | null>(null);
  const [dropFolderId, setDropFolderId] = useState<string>('');
  const [currentItems, setCurrentItems] = useState<API.FileListItem[]>([]);
  const [isBusy, setIsBusy] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [viewFilter, setViewFilter] = useState<'all' | 'files' | 'folders' | 'images'>('all');

  const currentFolderId = folderTrail.length > 0 ? folderTrail[folderTrail.length - 1].id : undefined;

  const pageStats = useMemo(() => {
    const folderCount = currentItems.filter((x) => x.isFolder).length;
    const fileCount = currentItems.filter((x) => !x.isFolder).length;
    const totalSize = currentItems.reduce((sum, item) => sum + Number(item.size || 0), 0);
    const imageCount = currentItems.filter((x) => !x.isFolder && (x.type || '').startsWith('image/')).length;
    const largestFile = currentItems
      .filter((x) => !x.isFolder)
      .sort((a, b) => Number(b.size || 0) - Number(a.size || 0))[0];

    const totalItems = folderCount + fileCount;
    const fileRatio = totalItems > 0 ? Math.round((fileCount / totalItems) * 100) : 0;
    const folderRatio = totalItems > 0 ? Math.round((folderCount / totalItems) * 100) : 0;

    return {
      folderCount,
      fileCount,
      totalSize,
      imageCount,
      largestFile,
      fileRatio,
      folderRatio,
      totalItems,
    };
  }, [currentItems]);

  const refreshStats = useCallback(async () => {
    const [countResponse, sizeResponse] = await Promise.all([countFile(), totalFileSize()]);
    setCount(countResponse || 0);
    setSize(sizeResponse || 0);
  }, []);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const reloadData = () => {
    actionRef.current?.reload();
    refreshStats();
  };

  const handleDelete = async (entity: API.FileListItem) => {
    try {
      setIsBusy(true);
      if (!entity.id) return;

      if (entity.isFolder) {
        await apiFolderDelete(entity.id);
      } else {
        await deleteFileContent(entity.id);
      }

      message.success('Deleted!');
      reloadData();
    } catch (error: any) {
      message.error(error?.data?.message || 'Delete failed!');
    } finally {
      setIsBusy(false);
    }
  };

  const confirmDelete = (entity: API.FileListItem) => {
    Modal.confirm({
      title: entity.isFolder ? 'Xác nhận xóa thư mục' : 'Xác nhận xóa file',
      content: 'Bạn có chắc chắn muốn xóa mục này?',
      onOk: () => handleDelete(entity),
    });
  };

  const handleDeleteSelected = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select at least one item.');
      return;
    }

    Modal.confirm({
      title: 'Xác nhận xóa nhiều mục',
      content: `Bạn có chắc chắn muốn xóa ${selectedRowKeys.length} mục đã chọn?`,
      onOk: async () => {
        try {
          setIsBusy(true);
          for (const row of selectedRows) {
            if (!row.id) continue;
            if (row.isFolder) {
              await apiFolderDelete(row.id);
            } else {
              await deleteFileContent(row.id);
            }
          }
          setSelectedRowKeys([]);
          setSelectedRows([]);
          message.success('Deleted selected items!');
          reloadData();
        } catch (error: any) {
          message.error(error?.data?.message || 'Delete selected failed!');
        } finally {
          setIsBusy(false);
        }
      },
    });
  };

  const copyToClipboard = (text?: string) => {
    if (!text) {
      message.warning('Không có URL để sao chép!');
      return;
    }

    navigator.clipboard.writeText(text).then(
      () => {
        message.success('Copied to clipboard!');
      },
      () => {
        message.error('Failed to copy!');
      }
    );
  };

  const openRename = (entity: API.FileListItem) => {
    setActionEntity(entity);
    renameForm.setFieldsValue({
      name: entity.name,
    });
    setRenameOpen(true);
  };

  const handleRename = async () => {
    const values = await renameForm.validateFields();
    if (!actionEntity?.id) return;

    try {
      if (actionEntity.isFolder) {
        await apiFolderUpdate({
          id: actionEntity.id,
          name: values.name,
          parentId: actionEntity.parentId || null,
        });
      } else {
        await updateFileContent({
          id: actionEntity.id,
          name: values.name,
          folderId: actionEntity.parentId,
        });
      }

      message.success('Updated!');
      setRenameOpen(false);
      setActionEntity(null);
      reloadData();
    } catch (error: any) {
      message.error(error?.data?.message || 'Update failed!');
    }
  };

  const buildFolderOptions = async () => {
    const allFolders: FolderOption[] = [];

    const loadChildren = async (parentId?: string, pathPrefix = '') => {
      const response = await apiFolderList({
        current: 1,
        pageSize: 200,
        parentId,
      });

      const folders = response?.data || [];
      for (const folder of folders) {
        const pathLabel = pathPrefix ? `${pathPrefix}/${folder.name}` : folder.name;
        allFolders.push({
          id: folder.id,
          name: folder.name,
          parentId: folder.parentId,
          pathLabel,
        });
        await loadChildren(folder.id, pathLabel);
      }
    };

    await loadChildren();
    setFolderOptions(allFolders);
    return allFolders;
  };

  const getDisabledMoveTargets = (sourceId?: string, options: FolderOption[] = []) => {
    if (!sourceId) return new Set<string>();

    const disabled = new Set<string>([sourceId]);
    const queue = [sourceId];

    while (queue.length > 0) {
      const currentId = queue.shift();
      const children = options.filter((x) => x.parentId === currentId);
      children.forEach((child) => {
        if (!disabled.has(child.id)) {
          disabled.add(child.id);
          queue.push(child.id);
        }
      });
    }

    return disabled;
  };

  const openMove = async (entity: API.FileListItem) => {
    setActionEntity(entity);
    const options = await buildFolderOptions();
    moveForm.setFieldsValue({
      folderId: entity.parentId,
    });
    setFolderOptions(options);
    setMoveOpen(true);
  };

  const handleMove = async () => {
    const values = await moveForm.validateFields();
    if (!actionEntity?.id) return;

    const folderId = values.folderId || undefined;
    try {
      setIsBusy(true);
      if (actionEntity.isFolder) {
        const invalidTargetIds = getDisabledMoveTargets(actionEntity.id, folderOptions);
        if (folderId && invalidTargetIds.has(folderId)) {
          message.error('Không thể di chuyển thư mục vào chính nó hoặc thư mục con của nó.');
          return;
        }

        await apiFolderUpdate({
          id: actionEntity.id,
          name: actionEntity.name,
          parentId: folderId || null,
        });
      } else {
        await updateFileContent({
          id: actionEntity.id,
          name: actionEntity.name,
          folderId,
        });
      }

      message.success('Moved!');
      setMoveOpen(false);
      setActionEntity(null);
      reloadData();
    } catch (error: any) {
      message.error(error?.data?.message || 'Move failed!');
    } finally {
      setIsBusy(false);
    }
  };

  const moveEntityToFolder = async (entity: API.FileListItem, folderId?: string) => {
    if (!entity.id) return;

    if (!entity.isFolder && entity.parentId === folderId) {
      message.info('Item đã ở thư mục đích.');
      return;
    }

    if (entity.isFolder && entity.parentId === folderId) {
      message.info('Folder đã ở vị trí đích.');
      return;
    }

    setIsBusy(true);
    try {
      if (entity.isFolder) {
        const options = await buildFolderOptions();
        const invalidTargetIds = getDisabledMoveTargets(entity.id, options);
        if (folderId && invalidTargetIds.has(folderId)) {
          message.error('Không thể di chuyển thư mục vào chính nó hoặc thư mục con của nó.');
          return;
        }

        await apiFolderUpdate({
          id: entity.id,
          name: entity.name,
          parentId: folderId || null,
        });
        message.success('Moved!');
        reloadData();
        return;
      }

      await updateFileContent({
        id: entity.id,
        name: entity.name,
        folderId,
      });
      message.success('Moved!');
      reloadData();
    } finally {
      setIsBusy(false);
    }
  };

  const applyViewFilter = (items: API.FileListItem[]) => {
    switch (viewFilter) {
      case 'files':
        return items.filter((x) => !x.isFolder);
      case 'folders':
        return items.filter((x) => x.isFolder);
      case 'images':
        return items.filter((x) => !x.isFolder && (x.type || '').startsWith('image/'));
      default:
        return items;
    }
  };

  const handleDragStart = (entity: API.FileListItem) => {
    setDragEntity(entity);
  };

  const handleDragEnd = () => {
    setDragEntity(null);
    setDropFolderId('');
  };

  const handleDropOnFolder = async (targetFolder: API.FileListItem) => {
    if (!targetFolder.id || !dragEntity) return;
    setDropFolderId('');
    try {
      await moveEntityToFolder(dragEntity, targetFolder.id);
    } catch (error: any) {
      message.error(error?.data?.message || 'Move failed!');
    } finally {
      setDragEntity(null);
    }
  };

  const handleDropToRoot = async () => {
    if (!dragEntity) return;
    setDropFolderId('');
    try {
      await moveEntityToFolder(dragEntity, undefined);
    } catch (error: any) {
      message.error(error?.data?.message || 'Move failed!');
    } finally {
      setDragEntity(null);
    }
  };

  const onFolderClick = (entity: API.FileListItem) => {
    if (!entity.id) return;
    setFolderTrail((prev) => [...prev, { id: entity.id!, name: entity.name }]);
    actionRef.current?.reload();
  };

  const goBackOneFolder = () => {
    if (folderTrail.length === 0) return;
    setFolderTrail((prev) => prev.slice(0, prev.length - 1));
    actionRef.current?.reload();
  };

  const goToFolderByTrailIndex = (index: number) => {
    if (index < 0) {
      setFolderTrail([]);
      actionRef.current?.reload();
    } else {
      setFolderTrail((prev) => prev.slice(0, index + 1));
      actionRef.current?.reload();
    }
  };

  const getTypeBadge = (entity: API.FileListItem) => {
    if (entity.isFolder) {
      return {
        label: 'Folder',
        color: 'gold',
        icon: <FolderFilled />,
      };
    }

    const mimeType = (entity.type || '').toLowerCase();
    if (mimeType.startsWith('image/')) {
      return {
        label: 'Image',
        color: 'blue',
        icon: <FileImageOutlined />,
      };
    }

    if (mimeType.includes('pdf')) {
      return {
        label: 'PDF',
        color: 'red',
        icon: <FilePdfOutlined />,
      };
    }

    if (mimeType.startsWith('text/')) {
      return {
        label: 'Text',
        color: 'geekblue',
        icon: <FileTextOutlined />,
      };
    }

    return {
      label: 'File',
      color: 'default',
      icon: <FileFilled />,
    };
  };

  const columns: ProColumns<API.FileListItem>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, entity) => {
        if (entity.isFolder) {
          const isDropTarget = dropFolderId === entity.id;
          return <div
            className={`font-medium cursor-pointer p-1 rounded ${isDropTarget ? 'bg-orange-100' : ''}`}
            draggable
            onDragStart={() => handleDragStart(entity)}
            onDragEnd={handleDragEnd}
            onDragOver={(event) => {
              event.preventDefault();
              setDropFolderId(entity.id || '');
            }}
            onDragLeave={() => {
              if (dropFolderId === entity.id) {
                setDropFolderId('');
              }
            }}
            onDrop={async (event) => {
              event.preventDefault();
              await handleDropOnFolder(entity);
            }}
            onClick={() => {
              onFolderClick(entity);
            }}>
            <FolderFilled className='text-orange-500' /> {entity.name}
          </div>
        }
        return (
          <div
            className='text-slate-800 cursor-pointer hover:text-blue-600'
            draggable
            onDragStart={() => handleDragStart(entity)}
            onDragEnd={handleDragEnd}
            onClick={() => {
              setPreviewFile(entity);
              setPreviewOpen(true);
            }}>
            <FileFilled className='text-slate-500' /> {entity.name}
          </div>
        )
      },
    },
    {
      title: 'Uploaded At',
      dataIndex: 'createdDate',
      valueType: 'dateTime',
      search: false,
      width: 160
    },
    {
      title: 'Type',
      dataIndex: 'type',
      search: false,
      width: 110,
      render: (_, entity) => {
        const badge = getTypeBadge(entity);
        return (
          <Tag color={badge.color} icon={badge.icon} style={{ borderRadius: 999 }}>
            {badge.label}
          </Tag>
        );
      }
    },
    {
      title: 'File Size',
      dataIndex: 'size',
      search: false,
      render: (_, entity) => {
        if (entity.size === 0) {
          return '-';
        }
        return formatFileSize(entity.size);
      },
      width: 90
    },
    {
      title: <SettingOutlined />,
      valueType: 'option',
      render: (dom, entity) => [
        <Dropdown key={"more"} menu={{
          items: [
            {
              key: 'preview',
              label: 'Xem trước',
              icon: <EyeOutlined />,
              onClick: () => {
                setPreviewFile(entity);
                setPreviewOpen(true);
              },
              disabled: entity.isFolder
            },
            {
              key: 'view',
              label: 'Chi tiết',
              icon: <EyeOutlined />,
              onClick: () => {
                history.push(`/files/center/${entity.id}`);
              }
            },
            {
              key: 'download',
              label: 'Tải xuống',
              icon: <DownloadOutlined />,
              onClick: () => {
                if (entity.url) {
                  window.open(entity.url, '_blank');
                }
              },
              disabled: entity.isFolder
            },
            {
              key: 'share',
              label: 'Chia sẻ',
              icon: <ShareAltOutlined />,
              onClick: () => {
                copyToClipboard(entity.url);
              }
            },
            {
              key: 'rename',
              label: 'Đổi tên',
              icon: <EditOutlined />,
              onClick: () => {
                openRename(entity);
              }
            },
            {
              key: 'move',
              label: 'Di chuyển',
              icon: <ArrowsAltOutlined />,
              onClick: () => {
                openMove(entity);
              }
            },
            {
              key: 'delete',
              label: 'Xóa',
              icon: <DeleteOutlined />,
              onClick: () => {
                confirmDelete(entity);
              },
              danger: true
            }
          ]
        }}>
          <Button size='small' type='dashed' icon={<MoreOutlined />} />
        </Dropdown>
      ],
      width: 30,
      align: 'center'
    },
  ];

  return (
    <PageContainer
      extra={
        <Space>
          <Button icon={<ArrowUpOutlined />} onClick={goBackOneFolder} disabled={folderTrail.length === 0}>
            Up
          </Button>
        </Space>
      }
    >
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 16,
          background: 'linear-gradient(135deg, #0f766e 0%, #155e75 50%, #1d4ed8 100%)',
          color: '#fff',
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={14}>
            <Space direction="vertical" size={2}>
              <Tag color="cyan" style={{ width: 'fit-content', borderRadius: 999 }}>
                Smart File Hub
              </Tag>
              <Title level={3} style={{ color: '#fff', margin: 0 }}>
                Quản lý tệp tin tập trung và trực quan
              </Title>
              <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                Theo dõi dung lượng, tối ưu cấu trúc thư mục và thao tác kéo thả nhanh ngay trên danh sách.
              </Text>
            </Space>
          </Col>
          <Col xs={24} md={10}>
            <Row gutter={12}>
              <Col span={12}>
                <Card size="small" bordered={false} style={{ borderRadius: 12, background: 'rgba(255,255,255,0.15)' }}>
                  <Statistic title={<span style={{ color: '#dbeafe' }}>Current Items</span>} value={pageStats.totalItems} valueStyle={{ color: '#fff' }} />
                </Card>
              </Col>
              <Col span={12}>
                <Card size="small" bordered={false} style={{ borderRadius: 12, background: 'rgba(255,255,255,0.15)' }}>
                  <Statistic title={<span style={{ color: '#dbeafe' }}>Current Size</span>} value={formatFileSize(pageStats.totalSize)} valueStyle={{ color: '#fff' }} />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <WfUpload open={open}
        multiple
        onCancel={() => setOpen(false)} onFinish={async (files: RcFile[]) => {
          setIsUploading(true);
          debugger;
          const validFiles: File[] = [];
          const formData = new FormData();
          try {
            files.forEach((file) => {
              if (file.size && file.size > 10 * 1024 * 1024) {
                message.error(`File ${file.name} exceeds the size limit.`);
                return;
              }
              if (file) {
                validFiles.push(file);
              }
            });

            if (validFiles.length === 0) {
              return;
            }

            validFiles.forEach((file) => formData.append('files', file));
            if (currentFolderId) {
              formData.append('folderId', currentFolderId);
            }

            await apiMultiUpload(formData);
            message.success('Uploaded!');
            reloadData();
            setOpen(false);
          } catch (error: any) {
            message.error(error?.data?.message || 'Upload failed!');
          } finally {
            setIsUploading(false);
          }
        }} />

      {dragEntity && (
        <Alert
          type="info"
          showIcon
          className='mb-4'
          message={`Đang kéo: ${dragEntity.name}`}
          description="Thả vào thư mục, Root hoặc vùng Current Folder để di chuyển nhanh."
        />
      )}

      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 14, background: '#f0fdfa' }}>
            <Statistic title="Files In View" value={pageStats.fileCount} suffix={<Tag color="blue">{pageStats.fileRatio}%</Tag>} />
            <Progress percent={pageStats.fileRatio} showInfo={false} strokeColor="#2563eb" />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 14, background: '#fff7ed' }}>
            <Statistic title="Folders In View" value={pageStats.folderCount} suffix={<Tag color="orange">{pageStats.folderRatio}%</Tag>} />
            <Progress percent={pageStats.folderRatio} showInfo={false} strokeColor="#ea580c" />
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 14, background: '#eef2ff' }}>
            <Statistic title="Images" value={pageStats.imageCount} />
            <Text type="secondary">Dựa trên MIME image/* trong thư mục hiện tại</Text>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card bordered={false} style={{ borderRadius: 14, background: '#f5f3ff' }}>
            <Statistic title="Largest File" value={pageStats.largestFile ? formatFileSize(pageStats.largestFile.size) : 'N/A'} />
            <Text type="secondary" ellipsis>{pageStats.largestFile?.name || 'Không có file'}</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={18}>
          <div
            className={`mb-3 border border-dashed rounded p-2 text-sm transition-colors ${dropFolderId === 'current' ? 'bg-blue-100 border-blue-300' : 'bg-slate-50 border-slate-300'}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDropFolderId('current');
            }}
            onDragLeave={() => {
              if (dropFolderId === 'current') {
                setDropFolderId('');
              }
            }}
            onDrop={async (event) => {
              event.preventDefault();
              setDropFolderId('');
              if (!dragEntity) return;
              try {
                await moveEntityToFolder(dragEntity, currentFolderId);
              } catch (error: any) {
                message.error(error?.data?.message || 'Move failed!');
              } finally {
                setDragEntity(null);
              }
            }}
          >
            Drop vào thư mục hiện tại: <b>{folderTrail.length > 0 ? folderTrail[folderTrail.length - 1].name : 'Root'}</b>
          </div>


          <Breadcrumb className='mb-4' items={[
            {
              title: <a
                onClick={() => goToFolderByTrailIndex(-1)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDropFolderId('root');
                }}
                onDragLeave={() => {
                  if (dropFolderId === 'root') {
                    setDropFolderId('');
                  }
                }}
                onDrop={async (event) => {
                  event.preventDefault();
                  await handleDropToRoot();
                }}
                className={dropFolderId === 'root' ? 'bg-blue-100 px-2 py-1 rounded' : ''}
              >Root</a>
            },
            ...folderTrail.map((item, index) => ({
              title: <a onClick={() => goToFolderByTrailIndex(index)}>{item.name}</a>
            }))
          ]} />
          <ProTable
            rowSelection={{
              selectedRowKeys,
              onChange: (keys, rows) => {
                setSelectedRowKeys(keys as string[]);
                setSelectedRows(rows as API.FileListItem[]);
              },
            }}
            search={{
              layout: 'vertical'
            }}
            params={{
              folderId: currentFolderId,
              parentId: currentFolderId,
            }}
            pagination={{
              defaultPageSize: 8
            }}
            headerTitle={<Space>
              <Dropdown menu={{
                items: [
                  {
                    key: 'new-folder',
                    label: 'New Folder',
                    icon: <FolderAddOutlined />,
                  },
                  {
                    key: 'upload',
                    label: 'Upload',
                    icon: <ArrowUpOutlined />,
                    onClick: () => setOpen(true)
                  }
                ]
              }}>
                <Button icon={<MoreOutlined />}>Actions</Button>
              </Dropdown>
              <FolderForm
                parentId={currentFolderId}
                reload={() => {
                  reloadData();
                }}
              />
              <Button icon={<DeleteOutlined />} danger onClick={handleDeleteSelected}>
                Delete Selected
              </Button>
              <Tag color="geekblue" style={{ marginLeft: 4 }}>
                Current: {folderTrail.length > 0 ? folderTrail[folderTrail.length - 1].name : 'Root'}
              </Tag>
            </Space>}
            toolBarRender={() => [
              <Segmented
                key="view-filter"
                value={viewFilter}
                onChange={(value) => {
                  setViewFilter(value as 'all' | 'files' | 'folders' | 'images');
                  actionRef.current?.reload();
                }}
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Files', value: 'files' },
                  { label: 'Folders', value: 'folders' },
                  { label: 'Images', value: 'images' },
                ]}
              />,
            ]}
            request={async (params) => {
              const response = await listFile(params, []);
              const rawItems = response?.data || [];
              const filteredItems = applyViewFilter(rawItems);
              setCurrentItems(filteredItems);
              return {
                ...response,
                data: filteredItems,
                total: filteredItems.length,
              };
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={viewFilter === 'all' ? 'Không có dữ liệu trong thư mục này' : 'Không có dữ liệu phù hợp bộ lọc'}
                />
              )
            }}
            columns={columns}
            rowKey="id"
            actionRef={actionRef}
          />
        </Col>
        <Col span={6}>
          <ProCard className='mb-4' style={{ borderRadius: 14 }}>
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Text type="secondary">Workspace Totals</Text>
              <Title level={5} style={{ margin: 0 }}>Tổng quan toàn bộ kho tệp</Title>
              <Divider style={{ margin: '8px 0' }} />
              <Statistic title="Total Files" value={count} />
              <Statistic title="Total Size" value={formatFileSize(size)} />
            </Space>
          </ProCard>

          <ProCard className='mb-4' style={{ borderRadius: 14 }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <div className='flex justify-between items-center'>
                <Space>
                  <Avatar style={{ background: '#0f766e' }}>FS</Avatar>
                  <div>
                    <Text strong>Storage Health</Text>
                    <br />
                    <Text type="secondary">Theo dõi tỷ lệ file/thư mục</Text>
                  </div>
                </Space>
              </div>
              <Progress
                percent={pageStats.fileRatio}
                strokeColor={{ from: '#0ea5e9', to: '#2563eb' }}
                format={() => `Files ${pageStats.fileRatio}%`}
              />
              <Progress
                percent={pageStats.folderRatio}
                strokeColor={{ from: '#f97316', to: '#ea580c' }}
                format={() => `Folders ${pageStats.folderRatio}%`}
              />
            </Space>
          </ProCard>

          <ProCard style={{ borderRadius: 14 }}>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              <Text strong>Quick Cleanup</Text>
              <Text type="secondary">Xóa lựa chọn, tối ưu không gian làm việc ngay lập tức.</Text>
              <Button icon={<ClearOutlined />} onClick={() => {
                setSelectedRowKeys([]);
                setSelectedRows([]);
              }}>Clear Selection</Button>
            </Space>
          </ProCard>
        </Col>
      </Row>
      <FilePreview open={previewOpen} file={previewFile} onClose={() => setPreviewOpen(false)} />

      <Modal
        title="Đổi tên"
        open={renameOpen}
        onCancel={() => {
          setRenameOpen(false);
          setActionEntity(null);
        }}
        onOk={handleRename}
        okText="Lưu"
      >
        <Form form={renameForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tên!'
              }
            ]}
          >
            <Input maxLength={256} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Di chuyển"
        open={moveOpen}
        onCancel={() => {
          setMoveOpen(false);
          setActionEntity(null);
        }}
        onOk={handleMove}
        okText="Di chuyển"
      >
        <Form form={moveForm} layout="vertical">
          <Form.Item name="folderId" label="Thư mục đích">
            <Select
              allowClear
              placeholder="Root"
              options={folderOptions.map((folder) => ({
                label: folder.pathLabel,
                value: folder.id,
                disabled: actionEntity?.isFolder
                  ? getDisabledMoveTargets(actionEntity.id, folderOptions).has(folder.id)
                  : false,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default FilePage;
