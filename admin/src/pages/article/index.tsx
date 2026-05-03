import { PageContainer } from "@ant-design/pro-components";
import {
  Button,
  Popconfirm,
  Space,
  Table,
  Input,
  Select,
  message,
} from "antd";
import { useRequest, useSearchParams } from "@umijs/max";
import { useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import {
  listArticles,
  deleteArticle,
} from "@/services/article";
import ArticleForm from "@/components/ArticleForm";
import dayjs from "dayjs";

const ArticlePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  const current = parseInt(searchParams.get("current") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const name = searchParams.get("name") || "";
  const locale = searchParams.get("locale") || "vi-VN";

  const { data, loading, run: fetchArticles } = useRequest(
    (params, sort) =>
      listArticles(
        {
          current,
          pageSize,
          name,
          locale,
          ...params,
        },
        sort
      ),
    {
      manual: false,
      onError: (error) => {
        message.error("Failed to load articles");
      },
    }
  );

  const { loading: deleting, run: handleDelete } = useRequest(
    (id: string) => deleteArticle(id),
    {
      manual: true,
      onSuccess: (res) => {
        if (res.succeeded) {
          message.success("Article deleted successfully");
          fetchArticles({}, {});
        } else {
          message.error("Failed to delete article");
        }
      },
      onError: () => {
        message.error("Failed to delete article");
      },
    }
  );

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    const newParams = new URLSearchParams({
      current: pagination.current?.toString() || "1",
      pageSize: pagination.pageSize?.toString() || "10",
      name,
      locale,
    });
    setSearchParams(newParams);
  };

  const handleSearch = (searchName: string) => {
    const newParams = new URLSearchParams({
      current: "1",
      pageSize: pageSize?.toString() || "10",
      name: searchName,
      locale,
    });
    setSearchParams(newParams);
  };

  const handleLocaleChange = (newLocale: string) => {
    const newParams = new URLSearchParams({
      current: "1",
      pageSize: pageSize?.toString() || "10",
      name,
      locale: newLocale,
    });
    setSearchParams(newParams);
  };

  const columns = [
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
      align: "center" as const,
    },
    {
      title: "Published",
      dataIndex: "publishedAt",
      key: "publishedAt",
      width: 180,
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-",
    },
    {
      title: "Creator",
      dataIndex: "creatorName",
      key: "creatorName",
      width: 120,
    },
    {
      title: "Modified",
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: 180,
      render: (date: string) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-",
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
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              size="small"
              icon={<DeleteOutlined />}
              loading={deleting}
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

  const handleCloseForm = () => {
    setOpen(false);
    setEditingId(undefined);
  };

  return (
    <PageContainer
      header={{
        title: "Articles",
        breadcrumb: { routes: [] },
      }}
    >
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <Input.Search
          placeholder="Search by name..."
          allowClear
          style={{ width: 200 }}
          onSearch={handleSearch}
          defaultValue={name}
        />
        <Select
          style={{ width: 120 }}
          value={locale}
          onChange={handleLocaleChange}
          options={[
            { label: "Vietnamese", value: "vi-VN" },
            { label: "English", value: "en-US" },
          ]}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleOpenForm}
        >
          Create Article
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        loading={loading}
        rowKey="id"
        pagination={{
          current,
          pageSize,
          total: data?.total || 0,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} articles`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1200 }}
      />

      <ArticleForm
        open={open}
        articleId={editingId}
        onClose={handleCloseForm}
        onSuccess={() => fetchArticles({}, {})}
      />
    </PageContainer>
  );
};

export default ArticlePage;
