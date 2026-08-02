import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import {
  Button,
  message,
  Popconfirm,
  Image,
  Avatar,
} from "antd";
import { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, SettingOutlined } from "@ant-design/icons";
import {
  deleteArticle,
  listArticles,
} from "@/services/article";
import ArticleForm from "@/components/ArticleForm";
import dayjs from "dayjs";
import { Link } from "@umijs/max";
import { ArticleListItem } from "@/typings/article";

const ArticlePage: React.FC = () => {

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
      render: (dom, record) => (
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
      title: <EyeOutlined />,
      dataIndex: "viewCount",
      key: "viewCount",
      width: 80,
      search: false,
      valueType: "digit"
    },
    {
      title: "Published",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 180,
      render: (_, record: any) =>
        record.publishedAt ? dayjs(record.publishedAt).format("YYYY-MM-DD HH:mm") : "-",
      search: false
    },
    {
      title: "Modified",
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
        <Popconfirm
          title="Delete Article"
          description="Are you sure you want to delete this article?"
          okText="Yes"
          key={"remove"}
          cancelText="No"
          onConfirm={() => handleDelete(record.id)}
        >
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            loading={deletingId === record.id}
          />
        </Popconfirm>
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
