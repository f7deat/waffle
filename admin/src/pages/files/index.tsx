import WfUpload from '@/components/file-explorer/upload';
import { apiMultiUpload, countFile, deleteFileContent, listFile, totalFileSize } from '@/services/file-service';
import {
  ArrowsAltOutlined,
  ArrowUpOutlined,
  ClearOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileFilled,
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
import { Avatar, Button, Col, Dropdown, message, Modal, Row, Space, Statistic, UploadFile } from 'antd';
import { useEffect, useRef, useState } from 'react';
import FolderForm from './components/folder-form';
import { formatFileSize } from './utils';
import FilePreview from './components/preview';

const FilePage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [size, setSize] = useState<number>(0);
  const [folderId, setFolderId] = useState<string>('');
  const [previewOpen, setPreviewOpen] = useState<boolean>(false);
  const [previewFile, setPreviewFile] = useState<API.FileListItem | null>(null);

  useEffect(() => {
    countFile().then(response => setCount(response || 0));
    totalFileSize().then(response => setSize(response || 0));
  }, []);

  const handleDelete = async (id?: string) => {
    const response = await deleteFileContent(id);
    if (response.succeeded) {
      message.success('Deleted!');
      actionRef.current?.reload();
    } else {
      message.error(response.errors[0].description);
    }
  };

  const confirmDelete = (id?: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa mục này?',
      onOk: () => handleDelete(id),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        message.success('Copied to clipboard!');
      },
      () => {
        message.error('Failed to copy!');
      }
    );
  };

  const columns: ProColumns<API.FileListItem>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, entity) => {
        if (entity.isFolder) {
          return <div className='font-medium cursor-pointer' onClick={() => {
            setFolderId(entity.id || '');
            actionRef.current?.reload();
          }}>
            <FolderFilled className='text-orange-500' /> {entity.name}</div>
        }
        return (
          <div className='text-slate-800 cursor-pointer hover:text-blue-600' onClick={() => {
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
                window.open(entity.url, '_blank');
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
                message.info('Chức năng đang phát triển');
              }
            },
            {
              key: 'move',
              label: 'Di chuyển',
              icon: <ArrowsAltOutlined />,
              onClick: () => {
                message.info('Chức năng đang phát triển');
              }
            },
            {
              key: 'delete',
              label: 'Xóa',
              icon: <DeleteOutlined />,
              onClick: () => {
                confirmDelete(entity.id);
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
        <Button
          icon={<ArrowUpOutlined />}
          type="primary"
          onClick={() => setOpen(true)}
        >
          Upload
        </Button>
      }
    >
      <WfUpload open={open}
        multiple
        onCancel={() => setOpen(false)} onFinish={async (files: UploadFile[]) => {
          const formData = new FormData();
          files.forEach((file) => {
            if (file.size && file.size > 10 * 1024 * 1024) { // Example: Limit file size to 10MB
              message.error(`File ${file.name} exceeds the size limit.`);
              return;
            }
            formData.append('files', file as any);
          });
          await apiMultiUpload(formData);
          message.success('Uploaded!');
          actionRef.current?.reload();
          setOpen(false);
        }} />
      <Row gutter={16}>
        <Col span={18}>
          <ProTable
            rowSelection={{}}
            search={{
              layout: 'vertical'
            }}
            params={{
              folderId
            }}
            pagination={{
              defaultPageSize: 8
            }}
            headerTitle={<FolderForm reload={() => {
              actionRef.current?.reload();
            }} />}
            request={(params) => listFile(params, [])}
            columns={columns}
            rowKey="id"
            actionRef={actionRef}
          />
        </Col>
        <Col span={6}>
          <Row gutter={16}>
            <Col span={12}>
              <ProCard className='mb-4'>
                <Statistic title="Total Files" value={count} />
              </ProCard>
            </Col>
            <Col span={12}>
              <ProCard className='mb-4'>
                <Statistic title="Total Size" value={size} />
              </ProCard>
            </Col>
          </Row>
          <ProCard>
            <div className='flex justify-between items-center'>
              <Col span={4}>
                <Avatar icon="T" />
              </Col>
              <Col>
                <Space>
                  Clean up your space
                </Space>
              </Col>
              <Col>
                <Button icon={<ClearOutlined />}>Clean</Button>
              </Col>
            </div>
          </ProCard>
        </Col>
      </Row>
      <FilePreview open={previewOpen} file={previewFile} onClose={() => setPreviewOpen(false)} />
    </PageContainer>
  );
};

export default FilePage;
