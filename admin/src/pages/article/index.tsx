import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import {
  Button,
  message,
  Image,
  Avatar,
  Dropdown,
  Modal,
  Input,
  Space,
  Typography,
} from "antd";
import { useRef, useState } from "react";
import { CloudUploadOutlined, CopyOutlined, DeleteOutlined, EyeOutlined, FacebookOutlined, LinkedinOutlined, MessageOutlined, MoreOutlined, PlusOutlined, SettingOutlined, ShareAltOutlined, TwitterOutlined } from "@ant-design/icons";
import {
  ArticleListItem,
  deleteArticle,
  getArticleById,
  listArticles,
  publishArticle,
} from "@/services/article";
import { createShortLink } from "@/services/short-link";
import ArticleForm from "@/components/ArticleForm";
import dayjs from "dayjs";
import { Link, history } from "@umijs/max";

const ArticlePage: React.FC = () => {

  const [modal, contextHolder] = Modal.useModal();
  const actionRef = useRef<ActionType>(null);
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | undefined>();
  const [publishingId, setPublishingId] = useState<string | undefined>();
  const [shareOpen, setShareOpen] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteArticle(id);
      message.success("Đã chuyển bài viết vào thùng rác");
      actionRef.current?.reload();
    } catch (error) {
      message.error("Delete article failed");
    } finally {
      setDeletingId(undefined);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      setPublishingId(id);
      await publishArticle(id);
      message.success("Xuất bản bài viết thành công");
      actionRef.current?.reload();
    } catch (error) {
      message.error("Xuất bản bài viết thất bại");
    } finally {
      setPublishingId(undefined);
    }
  };

  const handleShare = async (article: ArticleListItem) => {
    setShareOpen(true);
    setShareLoading(true);
    setShareUrl("");

    try {
      const response = await getArticleById(article.id);
      const detail = (response as any)?.data ?? response;
      if (!detail?.normalizedName) {
        throw new Error("Article URL is unavailable");
      }

      const siteUrl = (process.env.API_URL || window.location.origin)
        .replace(/^(https?:\/\/)api\./, "$1")
        .replace(/\/$/, "");
      const shortLink = await createShortLink(
        `${siteUrl}/article/${encodeURIComponent(detail.normalizedName)}`
      );
      setShareUrl(shortLink.shortUrl);
    } catch {
      message.error("Không thể tạo liên kết chia sẻ");
      setShareOpen(false);
    } finally {
      setShareLoading(false);
    }
  };

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      message.success("Đã sao chép liên kết");
    } catch {
      message.error("Không thể sao chép liên kết");
    }
  };

  const shareTo = (url: string) => window.open(url, "_blank", "noopener,noreferrer");

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
            ...(!record.publishedAt ? [{
              key: 'publish',
              label: 'Xuất bản',
              icon: <CloudUploadOutlined />,
              onClick: () => modal.confirm({
                title: 'Xác nhận xuất bản',
                content: 'Bạn có chắc chắn muốn xuất bản bài viết này không?',
                okText: 'Xuất bản',
                cancelText: 'Hủy',
                onOk: () => handlePublish(record.id)
              })
            }] : []),
            {
              key: 'view',
              label: 'Xem',
              icon: <EyeOutlined />,
              onClick: () => history.push(`/article/${record.id}`)
            },
            {
              key: 'share',
              label: 'Chia sẻ',
              icon: <ShareAltOutlined />,
              onClick: () => handleShare(record)
            },
            {
              key: 'delete',
              label: 'Xóa',
              icon: <DeleteOutlined />,
              onClick: () => modal.confirm({
                title: 'Xác nhận xóa',
                content: 'Bài viết sẽ được chuyển vào thùng rác và có thể khôi phục.',
                okText: 'Chuyển vào thùng rác',
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
            loading={deletingId === record.id || publishingId === record.id}
          />
        </Dropdown>
      ]
    },
  ];

  return (
    <PageContainer extra={<Space>
      <Button onClick={() => history.push('/article/trash')}>Thùng rác</Button>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      >
        Tạo mới
      </Button>
    </Space>}>
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

      <Modal
        title="Chia sẻ bài viết"
        open={shareOpen}
        onCancel={() => setShareOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Space direction="vertical" size="middle" className="w-full">
          <Typography.Text type="secondary">Liên kết rút gọn</Typography.Text>
          <Input
            value={shareUrl}
            readOnly
            placeholder="Đang tạo liên kết..."
            suffix={
              <Button
                type="text"
                aria-label="Sao chép liên kết"
                icon={<CopyOutlined />}
                disabled={!shareUrl || shareLoading}
                onClick={copyShareUrl}
              />
            }
          />
          <Space wrap>
            <Button icon={<FacebookOutlined />} disabled={!shareUrl || shareLoading} onClick={() => shareTo(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`)}>Facebook</Button>
            <Button icon={<TwitterOutlined />} disabled={!shareUrl || shareLoading} onClick={() => shareTo(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`)}>X</Button>
            <Button icon={<MessageOutlined />} disabled={!shareUrl || shareLoading} onClick={() => shareTo(`https://wa.me/?text=${encodeURIComponent(shareUrl)}`)}>WhatsApp</Button>
            <Button icon={<LinkedinOutlined />} disabled={!shareUrl || shareLoading} onClick={() => shareTo(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`)}>LinkedIn</Button>
          </Space>
        </Space>
      </Modal>
    </PageContainer>
  );
};

export default ArticlePage;
