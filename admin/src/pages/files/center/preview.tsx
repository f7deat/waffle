import { DownloadOutlined } from '@ant-design/icons';
import { ProCard, ProDescriptions } from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Divider, Image, Empty, Button } from 'antd';

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
      headerBordered
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
      <ProDescriptions column={1} size='small' bordered title="File Details">
        <ProDescriptions.Item label="Name">{file?.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="Size">
          {((file?.size ?? 0) / 1024).toFixed(2)} KB
        </ProDescriptions.Item>
        <ProDescriptions.Item label="Type">{file?.type}</ProDescriptions.Item>
        <ProDescriptions.Item label="URL" className='flex items-center' copyable ellipsis>{file?.url}</ProDescriptions.Item>
      </ProDescriptions>
    </ProCard>
  );
};

export default FilePreview;
