import { ActionType, PageContainer, ProColumns, ProTable } from '@ant-design/pro-components';
import { DeleteOutlined, UndoOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Avatar, Button, Image, message, Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState } from 'react';
import {
  ArticleListItem,
  deleteArticlePermanently,
  listDeletedArticles,
  restoreArticle,
} from '@/services/article';

const ArticleTrashPage: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();
  const actionRef = useRef<ActionType>(null);
  const [processingId, setProcessingId] = useState<string>();

  const handleRestore = async (id: string) => {
    try {
      setProcessingId(id);
      await restoreArticle(id);
      message.success('Đã khôi phục bài viết');
      actionRef.current?.reload();
    } catch {
      message.error('Không thể khôi phục bài viết');
    } finally {
      setProcessingId(undefined);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      setProcessingId(id);
      await deleteArticlePermanently(id);
      message.success('Đã xóa vĩnh viễn bài viết');
      actionRef.current?.reload();
    } catch {
      message.error('Không thể xóa bài viết');
    } finally {
      setProcessingId(undefined);
    }
  };

  const columns: ProColumns<ArticleListItem>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 50,
      align: 'center',
    },
    {
      title: 'Ảnh',
      dataIndex: 'thumbnail',
      width: 100,
      search: false,
      render: (_, record) => (
        <Image src={record.thumbnail} alt={record.name} width={80} height={80} className="rounded object-cover" />
      ),
    },
    {
      title: 'Tên bài viết',
      dataIndex: 'name',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-xs text-slate-500">
            <div className="line-clamp-2 mb-1">{record.description}</div>
            <Avatar size="small" src={record.creatorAvatar} /> {record.creatorName}
          </div>
        </div>
      ),
    },
    {
      title: 'Ngày xóa',
      dataIndex: 'deletedAt',
      width: 180,
      search: false,
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
            aria-label="Khôi phục bài viết"
            icon={<UndoOutlined />}
            loading={processingId === record.id}
            onClick={() => modal.confirm({
              title: 'Khôi phục bài viết?',
              content: `Bài viết “${record.name}” sẽ xuất hiện lại trong danh sách.`,
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
            aria-label="Xóa vĩnh viễn bài viết"
            icon={<DeleteOutlined />}
            loading={processingId === record.id}
            onClick={() => modal.confirm({
              title: 'Xóa vĩnh viễn bài viết?',
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
      title="Thùng rác bài viết"
      extra={<Button onClick={() => history.push('/article/list')}>Danh sách bài viết</Button>}
    >
      {contextHolder}
      <ProTable
        columns={columns}
        request={listDeletedArticles}
        rowKey="id"
        actionRef={actionRef}
        search={{ layout: 'vertical' }}
        size="small"
        options={{ reload: true }}
      />
    </PageContainer>
  );
};

export default ArticleTrashPage;