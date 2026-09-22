import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import {
  Button,
  message,
  Image,
  Avatar,
  Dropdown,
  Modal,
} from "antd";
import { useRef, useState } from "react";
import { DeleteOutlined, EyeOutlined, MoreOutlined, PlusOutlined, SettingOutlined, ShareAltOutlined } from "@ant-design/icons";
import {
  ArticleListItem,
  deleteArticle,
  listArticles,
} from "@/services/article";
import ArticleForm from "@/components/ArticleForm";
import dayjs from "dayjs";
import { Link, history } from "@umijs/max";

const ArticlePage: React.FC = () => {

  const [modal, contextHolder] = Modal.useModal();
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | undefined>();

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteArticle(id);
      message.success("Delete article successfully");
      actionRef.current?.reload();
    } catch (error) {
      message.error("Delete article failed");
    } finally {
      setDeletingId(undefined);
    }
  };

  const columns: ProColumns<ArticleListItem>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 30,
      align: 'center'
    },
    {
      title: "Ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      width: 100,
      search: false,
      render: (_, record) => (
        <Image src={record.thumbnail} alt={record.name} width={80} height={80} className="rounded object-cover" />
      )
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      minWidth: 200,
      render: (_, record) => (
        <div>
          <Link to={`/article/${record.id}`}>
            <div className="font-medium">
              {record.name}
            </div>
          </Link>
          <div className="text-xs text-slate-500">
            <div className="line-clamp-2 mb-1">{record.description}</div>
            <Avatar size="small" src={record.creatorAvatar} /> {record.creatorName} | {dayjs(record.createdDate).format("YYYY-MM-DD HH:mm")}
          </div>
        </div>
      )
    },
    {
      title: 'Lượt xem',
      dataIndex: "viewCount",
      key: "viewCount",
      width: 80,
      search: false,
      valueType: "digit"
    },
    {
      title: "Ngày xuất bản",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 180,
      render: (_, record: any) =>
        record.publishedAt ? dayjs(record.publishedAt).format("YYYY-MM-DD HH:mm") : "-",
      search: false
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: 180,
      render: (_, record: any) =>
        record.modifiedDate ? dayjs(record.modifiedDate).format("YYYY-MM-DD HH:mm") : "-",
      search: false
    },
    {
      title: <SettingOutlined />,
      key: "actions",
      width: 30,
      align: "center",
      valueType: "option",
      render: (_: any, record: any) => [
        <Dropdown key="more" menu={{
          items: [
            {
              key: 'view',
              label: 'Xem',
              icon: <EyeOutlined />,
              onClick: () => history.push(`/article/${record.id}`)
            },
            {
              key: 'share',
              label: 'Chia sẻ',
              icon: <ShareAltOutlined />
            },
            {
              key: 'delete',
              label: 'Xóa',
              icon: <DeleteOutlined />,
              onClick: () => modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bạn có chắc chắn muốn xóa bài viết này không?',
                okText: 'Xóa',
                cancelText: 'Hủy',
                onOk: () => handleDelete(record.id)
              }),
              danger: true
            }
          ]
        }}>
          <Button
            type="dashed"
            size="small"
            icon={<MoreOutlined />}
            loading={deletingId === record.id}
          />
        </Dropdown>
      ]
    },
  ];

  return (
    <PageContainer extra={
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      >
        Tạo mới
      </Button>
    }>
      {contextHolder}
      <ProTable
        columns={columns}
        request={listArticles}
        rowKey="id"
        search={{
          layout: "vertical"
        }}
        actionRef={actionRef}
        size="small"
      />

      <ArticleForm open={open} onOpenChange={setOpen} />
    </PageContainer>
  );
};

export default ArticlePage;
