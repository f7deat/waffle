import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import {
  Button,
  Popconfirm,
  Space,
} from "antd";
import { useRef, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  listArticles,
} from "@/services/article";
import ArticleForm from "@/components/ArticleForm";
import dayjs from "dayjs";
import { Link } from "@umijs/max";

const ArticlePage: React.FC = () => {

  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  const columns: ProColumns<any>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 30,
      align: 'center'
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      minWidth: 200,
      render: (dom, record) => (
        <Link to={`/article/${record.id}`}>
          <div className="font-medium text-blue-600 hover:underline">
            {record.name}
          </div>
        </Link>
      )
    },
    {
      title: "View Count",
      dataIndex: "viewCount",
      key: "viewCount",
      width: 100,
      search: false
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
      title: "Creator",
      dataIndex: "creatorName",
      key: "creatorName",
      width: 120,
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
      title: "Actions",
      key: "actions",
      width: 60,
      valueType: "option",
      render: (_: any, record: any) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingId(record.id);
              setOpen(true);
            }}
          />
          <Popconfirm
            title="Delete Article"
            description="Are you sure you want to delete this article?"
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleOpenForm = () => {
    setEditingId(undefined);
    setOpen(true);
  };

  return (
    <PageContainer extra={
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleOpenForm}
      >
        Create Article
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
      />

      <ArticleForm
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default ArticlePage;
