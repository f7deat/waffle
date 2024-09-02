import ButtonUpload from '@/components/file-explorer/button';
import WfUpload from '@/components/file-explorer/upload';
import { apiMultiUpload, listFile } from '@/services/file-service';
import { absolutePath } from '@/utils/format';
import { ArrowUpOutlined, PlusCircleOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProList,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { Button, Image, message, UploadFile } from 'antd';
import { useRef, useState } from 'react';

type GalleryProps = {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect?: any;
};

const Gallery: React.FC<GalleryProps> = (props) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [open, setOpen] = useState<boolean>(false);

  const onFinish = async (files: UploadFile[]) => {
    const formData = new FormData();
    files.map(file => {
      formData.append('files', file as any)
    });
    await apiMultiUpload(formData);
    message.success('Tải lên thành công!');
    actionRef.current?.reload();
  }

  return (
    <>
      <ModalForm open={props.open} onOpenChange={props.onOpenChange} submitter={false} title="Gallery">
        <ProList<API.FileContent>
          ghost
          toolBarRender={() => {
            return [
              <Button
                key="upload"
                icon={<ArrowUpOutlined />}
                type="primary"
                onClick={() => setOpen(true)}
              >
                Upload
              </Button>
            ];
          }}
          headerTitle={intl.formatMessage({
            id: 'menu.fileManager',
          })}
          request={(params: any) =>
            listFile(
              {
                ...params,
              },
              ['.png', '.jpg', '.jpeg', 'image/jpeg', 'image/png'],
            )
          }
          search={{
            layout: 'vertical'
          }}
          pagination={{
            pageSize: 8,
            size: 'small'
          }}
          onItem={(record: any) => {
            return {
              onClick: () => {
                if (!props.onSelect) {
                  return;
                }
                props.onSelect(record);
              },
            };
          }}
          metas={{
            avatar: {
              dataIndex: 'url',
              search: false
            },
            title: {
              dataIndex: 'name',
              title: 'Name'
            },
            actions: {
              render: () => [
                <Button type='primary' key="select" size='small' icon={<PlusCircleOutlined />} />
              ]
            }
          }}
          actionRef={actionRef}
        />
      </ModalForm>
      <WfUpload open={open} onCancel={() => setOpen(false)} onFinish={onFinish} />
    </>
  );
};

export default Gallery;
