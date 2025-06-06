import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Divider, Descriptions, Image, Empty, Button, Input } from 'antd';

type FilePreviewProps = {
  file?: API.FileContent;
  onChange?: any;
};

const FilePreview: React.FC<FilePreviewProps> = (props) => {
  const supportImage = [
    'image/jpeg',
    'image/png',
    'image/webp',
    '.svg',
    '.jpg',
    '.png',
    '.jpeg'
  ];

  const intl = useIntl();

  const { file } = props;

  const handleChane = () => {
    if (props.onChange) {
      props.onChange();
    }
  };

  const renderPreview = () => {
    if (supportImage.includes(file?.type ?? '')) {
      return (
        <div
          className="flex justify-center items-center"
          style={{
            minHeight: 130,
          }}
        >
          <Image src={file?.url} />
        </div>
      );
    }
    return (
      <div onClick={handleChane}>
        <Empty />
      </div>
    );
  };
  return (
    <ProCard
      title={intl.formatMessage({
        id: 'general.preview',
      })}
      actions={[
        <Button key="download" type='link' onClick={() => (window.location.href = file?.url || '')} icon={<DownloadOutlined />}>
          Download
        </Button>
      ]}
    >
      {renderPreview()}
      <Divider orientation='left'>File info</Divider>
      <Descriptions column={1}>
        <Descriptions.Item label="Name">{file?.name}</Descriptions.Item>
        <Descriptions.Item label="Size">
          {((file?.size ?? 0) / 1024).toFixed(2)} KB
        </Descriptions.Item>
        <Descriptions.Item label="Type">{file?.type}</Descriptions.Item>
        <Descriptions.Item label="URL" className='flex items-center'>
          <Input value={file?.url} readOnly addonAfter={<Button type='text' size='small' icon={<CopyOutlined />} />} />
        </Descriptions.Item>
      </Descriptions>
    </ProCard>
  );
};

export default FilePreview;
