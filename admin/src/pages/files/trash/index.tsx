import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, message, Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import {
  deleteFilePermanently,
  FileTrashItem,
  listDeletedFiles,
  restoreFile,
} from '@/services/file-service';
import { formatFileSize } from '../utils';

const FileTrashPage: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const actionRef = useRef<ActionType>(null);
  const [processingId, setProcessingId] = useState<string>();

  const handleRestore = async (id: string) => {
    try {
      setProcessingId(id);
      await restoreFile(id);
      message.success('Đã khôi phục tệp tin');
      actionRef.current?.reload();
    } catch {
      message.error('Không thể khôi phục tệp tin');
    } finally {
      setProcessingId(undefined);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      setProcessingId(id);
      await deleteFilePermanently(id);
      message.success('Đã xóa vĩnh viễn tệp tin');
      actionRef.current?.reload();
    } catch {
      message.error('Không thể xóa vĩnh viễn tệp tin');
    } finally {
      setProcessingId(undefined);
    }
  };

  const columns: ProColumns<FileTrashItem>[] = [
    {
      title: 'Tên tệp',
      dataIndex: 'name',
      render: (_, record) => <span className="font-medium">{record.name}</span>,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      search: false,
      width: 160,
    },
    {
      title: 'Dung lượng',
      dataIndex: 'size',
      search: false,
      width: 120,
      render: (_, record) => formatFileSize(record.size),
    },
    {
      title: 'Ngày xóa',
      dataIndex: 'deletedAt',
      search: false,
      width: 180,
      render: (_, record) => record.deletedAt ? dayjs(record.deletedAt).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      width: 100,
      align: 'center',
      render: (_, record) => [
        <Tooltip key="restore" title="Khôi phục">
          <Button
            type="text"
            aria-label="Khôi phục tệp tin"
            icon={<UndoOutlined />}
            loading={processingId === record.id}
            onClick={() => modal.confirm({
              title: 'Khôi phục tệp tin?',
              content: `“${record.name}” sẽ xuất hiện lại trong danh sách tệp.`,
              okText: 'Khôi phục',
              cancelText: 'Hủy',
              onOk: () => handleRestore(record.id),
            })}
          />
        </Tooltip>,
        <Tooltip key="delete" title="Xóa vĩnh viễn">
          <Button
            type="text"
            danger
            aria-label="Xóa vĩnh viễn tệp tin"
            icon={<DeleteOutlined />}
            loading={processingId === record.id}
            onClick={() => modal.confirm({
              title: 'Xóa vĩnh viễn tệp tin?',
              content: `Không thể khôi phục “${record.name}” sau khi xóa.`,
              okText: 'Xóa vĩnh viễn',
              cancelText: 'Hủy',
              okButtonProps: { danger: true },
              onOk: () => handlePermanentDelete(record.id),
            })}
          />
        </Tooltip>,
      ],
    },
  ];

  return (
    <PageContainer
      title="Thùng rác tệp tin"
      extra={<Button onClick={() => history.push('/files/list')}>Danh sách tệp</Button>}
    >
      {contextHolder}
      <ProTable<FileTrashItem>
        columns={columns}
        request={listDeletedFiles}
        rowKey="id"
        actionRef={actionRef}
        search={{ layout: 'vertical' }}
        size="small"
        options={{ reload: true }}
      />
    </PageContainer>
  );
};

export default FileTrashPage;