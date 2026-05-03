import { PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import {
  Button,
  Popconfirm,
  Space,
} from "antd";
import { useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  listArticles,
} from "@/services/article";
import ArticleForm from "@/components/ArticleForm";
import dayjs from "dayjs";

const ArticlePage: React.FC = () => {

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  const columns: ProColumns<any>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 250,
      ellipsis: true,
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
      width: 120,
      fixed: "right" as const,
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
      />

      <ArticleForm
        open={open}
        articleId={editingId}
        onOpenChange={setOpen}
      />
    </PageContainer>
  );
};

export default ArticlePage;
