import { getExportData, getStatistic, importData } from '@/services/backup';
import { deleteWork, listUnuse } from '@/services/work-content';
import { DeleteOutlined, DownloadOutlined, EyeOutlined, InboxOutlined } from '@ant-design/icons';
import { ActionType, PageContainer, ProCard, ProColumns, ProTable, Statistic } from '@ant-design/pro-components';
import { Button, Col, Divider, message, Popconfirm, Row, Upload, UploadProps } from 'antd';
import { useEffect, useRef, useState } from 'react';
import WorksUnuse from './components/works-unuse';

const { Dragger } = Upload;

const Backup: React.FC = () => {
  const [statistic, setStatistic] = useState<API.Statistic>();
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    getStatistic().then((response) => {
      setStatistic(response);
    });
  }, []);

  const exportData = async () => {
    const response = await getExportData();
    const blob = new Blob([JSON.stringify(response)], {
      type: 'application/json',
    });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${localStorage
      .getItem('wf_URL')
      ?.replace('https://', '')
      .replace('/', '')}-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const props: UploadProps = {
    action: importData,
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const onConfirm = async (id: string) => {
    const response = await deleteWork(id);
    if (response.succeeded) {
      message.success('Deleted');
      actionRef.current?.reload();
    } else {
      message.error(response.errors[0].description);
    }
  }

  const columns: ProColumns<Entity.WorkContent>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 40
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: '',
      render: (text, row) => [
        <Button key={1} type='primary' icon={<EyeOutlined />} />,
        <Popconfirm
          key={2}
          title="Are you sure?"
          onConfirm={() => onConfirm(row.id)}
        >
          <Button type="primary" danger icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
      valueType: 'option',
      width: 60
    }
  ]

  return (
    <PageContainer
      title="Backup"
      extra={
        <Button type="primary" icon={<DownloadOutlined />} onClick={exportData}>
          Export
        </Button>
      }
    >
      <Row gutter={16}>
        <Col span={4}>
          <ProCard>
            <Statistic title="Catalog" value={statistic?.catalog} />
          </ProCard>
        </Col>
        <Col span={4}>
          <ProCard>
            <Statistic title="Component" value={statistic?.component} />
          </ProCard>
        </Col>
        <Col span={4}>
          <ProCard>
            <Statistic title="Work content" value={statistic?.workContent} />
          </ProCard>
        </Col>
        <Col span={4}>
          <ProCard>
            <Statistic title="Work item" value={statistic?.workItem} />
          </ProCard>
        </Col>
        <Col span={4}>
          <ProCard>
            <Statistic title="File" value={statistic?.fileContent} />
          </ProCard>
        </Col>
        <Col span={4}>
          <ProCard>
            <Statistic title="Localization" value={statistic?.localization} />
          </ProCard>
        </Col>
      </Row>
      <Divider />
      <Row gutter={16}>
        <Col span={8}>
          <ProCard title="Import">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Dragger>
          </ProCard>
        </Col>
        <Col md={16}>
          <Row gutter={16}>
            <Col md={12}>
              <ProCard title="Unuse Contents">
              <ProTable request={listUnuse} columns={columns} actionRef={actionRef} ghost search={false} />
              </ProCard>
            </Col>
            <Col md={12}>
              <WorksUnuse />
            </Col>
          </Row>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Backup;
