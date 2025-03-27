import WfUpload from '@/components/file-explorer/upload';
import { apiMultiUpload, countFile, deleteFileContent, listFile, totalFileSize } from '@/services/file-service';
import {
  ArrowUpOutlined,
  ClearOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileFilled,
  FolderFilled,
} from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Avatar, Button, Col, message, Popconfirm, Row, Space, Statistic, UploadFile } from 'antd';
import { useEffect, useRef, useState } from 'react';
import FolderForm from './components/folder-form';
import { formatFileSize } from './utils';

const FilePage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const [open, setOpen] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [size, setSize] = useState<number>(0);

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

  const columns: ProColumns<API.FileListItem>[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (_, entity) => {
        if (entity.isFolder) {
          return <div className='font-medium cursor-pointer'><FolderFilled className='text-orange-500' /> {entity.name}</div>
        }
        return <div className='text-slate-800'><FileFilled /> {entity.name}</div>
      },
    },
    {
      title: 'Ngày upload',
      dataIndex: 'createdDate',
      valueType: 'fromNow',
      search: false,
      width: 160
    },
    {
      title: 'Size',
      dataIndex: 'size',
      search: false,
      render: (_, entity) => formatFileSize(entity.size),
      width: 100
    },
    {
      title: '',
      valueType: 'option',
      render: (dom, entity) => [
        <Button size='small'
          type="primary"
          icon={<EyeOutlined />}
          key={1}
          onClick={() => {
            history.push(`/files/center/${entity.id}`);
          }}
        />,
        <Button size='small'
          key={2}
          icon={<DownloadOutlined />}
          onClick={() => (window.location.href = entity.url)}
        />,
        <Popconfirm
          title="Are you sure?"
          onConfirm={() => handleDelete(entity.id)}
          key={3}
        >
          <Button type="primary" icon={<DeleteOutlined />} danger size='small' />
        </Popconfirm>,
      ],
      width: 100
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
      <WfUpload open={open} onCancel={() => setOpen(false)} onFinish={async (files: UploadFile[]) => {
        const formData = new FormData();
        console.log(files);
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
    </PageContainer>
  );
};

export default FilePage;
