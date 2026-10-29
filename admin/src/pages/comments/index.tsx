import {
  moderateComment,
  moderateComments,
  queryCommentCatalogs,
  queryCommentRules,
  queryCommentStats,
  queryComments,
  deleteCommentRule,
  removeComment,
  replyToComment,
  saveCommentRule,
  setCommentPinned,
} from "@/services/comment";
import type { CommentModerationRule, CommentQuery } from "@/services/comment";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  FlagOutlined,
  MessageOutlined,
  PushpinOutlined,
  ReloadOutlined,
  SendOutlined,
  StopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { PageContainer } from "@ant-design/pro-components";
import {
  Alert,
  Avatar,
  Button,
  Card,
  Checkbox,
  Col,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";

const COMMENT_STATUS = {
  draft: 0,
  active: 1,
  deleted: 2,
  hidden: 3,
  spam: 4,
} as const;

interface CommentRow {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  userCommentCount: number;
  userViolationCount: number;
  catalogId: string;
  catalogName?: string;
  catalogUrl?: string;
  content: string;
  createdDate: string;
  status: number;
  parentId?: string;
  isPinned: boolean;
  isOfficialResponse: boolean;
  reportCount: number;
  replyCount: number;
}

interface CommentStats {
  totalToday: number;
  pending: number;
  reported: number;
  active: number;
  hidden: number;
  spam: number;
}

interface CatalogOption {
  id: string;
  name: string;
}

interface ApiResult {
  succeeded: boolean;
  errors?: { description?: string }[];
  message?: string;
}

interface CommentRuleValues {
  name: string;
  description?: string;
  pattern: string;
  action: number;
  isEnabled: boolean;
}

type StatusFilter = "all" | "reported" | number;

const statusInfo = (status: number) => {
  switch (status) {
    case COMMENT_STATUS.draft:
      return { label: "Chờ duyệt", color: "gold" };
    case COMMENT_STATUS.active:
      return { label: "Đã duyệt", color: "green" };
    case COMMENT_STATUS.hidden:
      return { label: "Đã ẩn", color: "default" };
    case COMMENT_STATUS.spam:
      return { label: "Spam", color: "red" };
    case COMMENT_STATUS.deleted:
      return { label: "Đã xóa", color: "default" };
    default:
      return { label: "Không xác định", color: "default" };
  }
};

const getErrorMessage = (result: ApiResult) =>
  result.errors?.[0]?.description || result.message || "Không thể thực hiện thao tác.";

const CommentPage: React.FC = () => {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [stats, setStats] = useState<CommentStats>({
    totalToday: 0,
    pending: 0,
    reported: 0,
    active: 0,
    hidden: 0,
    spam: 0,
  });
  const [catalogs, setCatalogs] = useState<CatalogOption[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [catalogId, setCatalogId] = useState<string>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [rules, setRules] = useState<CommentModerationRule[]>([]);
  const [rulesLoading, setRulesLoading] = useState(true);
  const [ruleModalOpen, setRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<CommentModerationRule>();
  const [savingRule, setSavingRule] = useState(false);
  const [ruleForm] = Form.useForm<CommentRuleValues>();

  const loadComments = useCallback(async () => {
    setLoading(true);
    try {
      const params: CommentQuery = { current, pageSize };
      if (searchTerm) params.searchTerm = searchTerm;
      if (catalogId) params.catalogId = catalogId;
      if (statusFilter === "reported") {
        params.reported = true;
      } else if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const result = await queryComments(params);
      setComments(result.data ?? []);
      setTotal(result.total ?? 0);
      setSelectedIds(new Set());
      setSelectedId((previous) =>
        result.data?.some((comment: CommentRow) => comment.id === previous)
          ? previous
          : result.data?.[0]?.id,
      );
    } catch {
      message.error("Không tải được danh sách bình luận.");
    } finally {
      setLoading(false);
    }
  }, [catalogId, current, pageSize, searchTerm, statusFilter]);

  const loadStats = useCallback(async () => {
    try {
      const result = await queryCommentStats();
      setStats(result);
    } catch {
      message.error("Không tải được thống kê bình luận.");
    }
  }, []);

  const loadCatalogs = useCallback(async () => {
    try {
      setCatalogs(await queryCommentCatalogs());
    } catch {
      message.error("Không tải được danh sách chuyên mục.");
    }
  }, []);

  const loadRules = useCallback(async () => {
    setRulesLoading(true);
    try {
      setRules(await queryCommentRules());
    } catch {
      message.error("Không tải được các quy tắc kiểm duyệt.");
    } finally {
      setRulesLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  useEffect(() => {
    void loadStats();
    void loadCatalogs();
    void loadRules();
  }, [loadCatalogs, loadRules, loadStats]);

  const selectedComment = useMemo(
    () => comments.find((comment) => comment.id === selectedId),
    [comments, selectedId],
  );

  const refresh = async () => {
    await Promise.all([loadComments(), loadStats()]);
  };

  const runAction = async (action: () => Promise<ApiResult>, successText: string) => {
    try {
      const result = await action();
      if (!result.succeeded) {
        message.error(getErrorMessage(result));
        return false;
      }
      message.success(successText);
      await refresh();
      return true;
    } catch {
      message.error("Đã xảy ra lỗi khi cập nhật bình luận.");
      return false;
    }
  };

  const setStatus = (id: string, status: number) =>
    runAction(() => moderateComment(id, status), "Đã cập nhật trạng thái bình luận.");

  const bulkModerate = (status: number) => {
    if (selectedIds.size === 0) {
      message.warning("Hãy chọn ít nhất một bình luận.");
      return;
    }
    void runAction(
      () => moderateComments(Array.from(selectedIds), status),
      "Đã cập nhật các bình luận được chọn.",
    );
  };

  const submitReply = async () => {
    if (!selectedComment || !reply.trim()) return;
    setSubmittingReply(true);
    try {
      const succeeded = await runAction(
        () => replyToComment(selectedComment.id, reply.trim()),
        "Đã gửi phản hồi chính thức.",
      );
      if (succeeded) setReply("");
    } finally {
      setSubmittingReply(false);
    }
  };

  const openNewRule = () => {
    setEditingRule(undefined);
    ruleForm.resetFields();
    ruleForm.setFieldsValue({ action: 0, isEnabled: true });
    setRuleModalOpen(true);
  };

  const openEditRule = (rule: CommentModerationRule) => {
    setEditingRule(rule);
    ruleForm.setFieldsValue(rule);
    setRuleModalOpen(true);
  };

  const submitRule = async (values: CommentRuleValues) => {
    setSavingRule(true);
    try {
      const result = await saveCommentRule({ ...values, id: editingRule?.id });
      if (!result.succeeded) {
        message.error(getErrorMessage(result));
        return;
      }
      message.success("Đã lưu quy tắc kiểm duyệt.");
      setRuleModalOpen(false);
      await loadRules();
    } catch {
      message.error("Không thể lưu quy tắc kiểm duyệt.");
    } finally {
      setSavingRule(false);
    }
  };

  const updateRule = async (rule: CommentModerationRule, patch: Partial<CommentModerationRule>) => {
    try {
      const result = await saveCommentRule({ ...rule, ...patch });
      if (!result.succeeded) {
        message.error(getErrorMessage(result));
        return;
      }
      message.success("Đã cập nhật quy tắc.");
      await loadRules();
    } catch {
      message.error("Không thể cập nhật quy tắc.");
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const result = await deleteCommentRule(ruleId);
      if (!result.succeeded) {
        message.error(getErrorMessage(result));
        return;
      }
      message.success("Đã xóa quy tắc.");
      await loadRules();
    } catch {
      message.error("Không thể xóa quy tắc.");
    }
  };

  const toggleSelection = (id: string, checked: boolean) => {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const selectAll = (checked: boolean) =>
    setSelectedIds(checked ? new Set(comments.map((comment) => comment.id)) : new Set());

  const exportVisibleComments = () => {
    const escapeCsv = (value: string) => {
      const safeValue = /^[\t\r ]*[=+\-@]/.test(value) ? `'${value}` : value;
      return `"${safeValue.replaceAll('"', '""')}"`;
    };
    const rows = [
      ["Người bình luận", "Email", "Chuyên mục", "Trạng thái", "Ngày tạo", "Nội dung"],
      ...comments.map((comment) => [
        comment.userName ?? "",
        comment.userEmail ?? "",
        comment.catalogName ?? "",
        statusInfo(comment.status).label,
        comment.createdDate,
        comment.content,
      ]),
    ];
    const csv = `\uFEFF${rows.map((row) => row.map(escapeCsv).join(",")).join("\r\n")}`;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "comments.csv";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const tabs: { key: StatusFilter; label: string; count: number }[] = [
    { key: "all", label: "Tất cả", count: total },
    { key: COMMENT_STATUS.draft, label: "Chờ kiểm duyệt", count: stats.pending },
    { key: "reported", label: "Bị báo cáo", count: stats.reported },
    { key: COMMENT_STATUS.active, label: "Đã phê duyệt", count: stats.active },
    { key: COMMENT_STATUS.hidden, label: "Đã ẩn", count: stats.hidden },
    { key: COMMENT_STATUS.spam, label: "Spam", count: stats.spam },
  ];

  return (
    <PageContainer>
      <Space direction="vertical" size="large" style={{ display: "flex" }}>
        <Card>
          <Row align="middle" justify="space-between" gutter={[16, 16]}>
            <Col flex="auto">
              <Typography.Title level={3} style={{ margin: 0 }}>
                Quản lý &amp; Kiểm duyệt Bình luận
              </Typography.Title>
              <Typography.Paragraph type="secondary" style={{ margin: "8px 0 0" }}>
                Tìm kiếm, xử lý báo cáo và quản lý tương tác độc giả.
              </Typography.Paragraph>
            </Col>
            <Col>
              <Space wrap>
                <Button icon={<ReloadOutlined />} onClick={() => void refresh()}>
                  Làm mới
                </Button>
                <Button icon={<DownloadOutlined />} onClick={exportVisibleComments}>
                  Xuất trang hiện tại
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} xl={6}>
            <Card><Statistic title="Bình luận hôm nay" value={stats.totalToday} prefix={<MessageOutlined />} /></Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card><Statistic title="Chờ kiểm duyệt" value={stats.pending} prefix={<ClockCircleOutlined />} /></Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card><Statistic title="Bị độc giả báo cáo" value={stats.reported} prefix={<FlagOutlined />} valueStyle={{ color: stats.reported ? "#cf1322" : undefined }} /></Card>
          </Col>
          <Col xs={24} sm={12} xl={6}>
            <Card><Statistic title="Đã đưa vào Spam" value={stats.spam} prefix={<StopOutlined />} /></Card>
          </Col>
        </Row>

        <Card>
          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Space wrap>
              {tabs.map((tab) => (
                <Button
                  key={String(tab.key)}
                  type={statusFilter === tab.key ? "primary" : "default"}
                  onClick={() => {
                    setStatusFilter(tab.key);
                    setCurrent(1);
                  }}
                >
                  {tab.label} ({tab.count})
                </Button>
              ))}
            </Space>
            <Row gutter={[12, 12]}>
              <Col xs={24} md={10}>
                <Input.Search
                  allowClear
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  onSearch={(value) => {
                    setSearchTerm(value.trim());
                    setCurrent(1);
                  }}
                  placeholder="Tìm nội dung, tên, email hoặc bài viết"
                />
              </Col>
              <Col xs={24} md={8}>
                <Select
                  allowClear
                  showSearch
                  optionFilterProp="label"
                  placeholder="Tất cả chuyên mục"
                  value={catalogId}
                  onChange={(value) => {
                    setCatalogId(value);
                    setCurrent(1);
                  }}
                  options={catalogs.map((catalog) => ({ value: catalog.id, label: catalog.name }))}
                  style={{ width: "100%" }}
                />
              </Col>
              <Col xs={24} md={6}>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    setSearchInput("");
                    setSearchTerm("");
                    setCatalogId(undefined);
                    setStatusFilter("all");
                    setCurrent(1);
                  }}
                >
                  Đặt lại bộ lọc
                </Button>
              </Col>
            </Row>
            <Alert
              type="info"
              showIcon
              message="Chưa cấu hình dịch vụ chấm điểm AI. Trạng thái kiểm duyệt và số báo cáo bên dưới được lấy trực tiếp từ dữ liệu thực."
            />
          </Space>
        </Card>

        <Row gutter={[16, 16]} align="top">
          <Col xs={24} xl={15}>
            <Space direction="vertical" size="middle" style={{ display: "flex" }}>
              <Card size="small">
                <Row justify="space-between" align="middle" gutter={[12, 12]}>
                  <Col>
                    <Space>
                      <Checkbox
                        checked={comments.length > 0 && selectedIds.size === comments.length}
                        indeterminate={selectedIds.size > 0 && selectedIds.size < comments.length}
                        onChange={(event) => selectAll(event.target.checked)}
                      />
                      <Typography.Text>
                        {selectedIds.size > 0 ? `Đã chọn ${selectedIds.size} bình luận` : `${total} bình luận`}
                      </Typography.Text>
                    </Space>
                  </Col>
                  <Col>
                    <Space wrap>
                      <Button
                        size="small"
                        icon={<CheckCircleOutlined />}
                        disabled={!selectedIds.size}
                        onClick={() => bulkModerate(COMMENT_STATUS.active)}
                      >
                        Phê duyệt
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={!selectedIds.size}
                        onClick={() => bulkModerate(COMMENT_STATUS.deleted)}
                      >
                        Xóa
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Card>

              <Spin spinning={loading}>
                {comments.length === 0 && !loading ? (
                  <Card><Empty description="Không có bình luận phù hợp." /></Card>
                ) : (
                  <Space direction="vertical" size="middle" style={{ display: "flex" }}>
                    {comments.map((comment) => {
                      const status = statusInfo(comment.status);
                      const focused = comment.id === selectedId;
                      return (
                        <Card
                          key={comment.id}
                          size="small"
                          onClick={() => setSelectedId(comment.id)}
                          style={{
                            cursor: "pointer",
                            borderInlineStart: `4px solid ${comment.reportCount ? "#cf1322" : focused ? "#1677ff" : "transparent"}`,
                          }}
                        >
                          <Space direction="vertical" size="middle" style={{ display: "flex" }}>
                            <Row justify="space-between" align="top" gutter={[12, 8]}>
                              <Col flex="auto">
                                <Space align="start">
                                  <Checkbox
                                    checked={selectedIds.has(comment.id)}
                                    onClick={(event) => event.stopPropagation()}
                                    onChange={(event) => toggleSelection(comment.id, event.target.checked)}
                                  />
                                  <Avatar src={comment.userAvatar} icon={<UserOutlined />}>
                                    {comment.userName?.slice(0, 2).toUpperCase()}
                                  </Avatar>
                                  <div>
                                    <Typography.Text strong>{comment.userName || "Người dùng"}</Typography.Text>
                                    <br />
                                    <Typography.Text type="secondary">
                                      {comment.userEmail || "Không có email"}
                                    </Typography.Text>
                                  </div>
                                </Space>
                              </Col>
                              <Col>
                                <Space wrap>
                                  <Typography.Text type="secondary">
                                    {dayjs(comment.createdDate).format("DD/MM/YYYY HH:mm")}
                                  </Typography.Text>
                                  <Tag color={status.color}>{status.label}</Tag>
                                  {comment.isPinned && <Tag color="blue" icon={<PushpinOutlined />}>Đã ghim</Tag>}
                                </Space>
                              </Col>
                            </Row>

                            <div>
                              <Typography.Text type="secondary">Bài viết: </Typography.Text>
                              {comment.catalogUrl ? (
                                <a
                                  href={comment.catalogUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  {comment.catalogName || "Xem bài viết"}
                                </a>
                              ) : (
                                <Typography.Text>{comment.catalogName || "Không xác định"}</Typography.Text>
                              )}
                            </div>
                            <Typography.Paragraph style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                              {comment.content}
                            </Typography.Paragraph>
                            {comment.reportCount > 0 && (
                              <Tag color="red" icon={<FlagOutlined />}>
                                Bị báo cáo {comment.reportCount} lần
                              </Tag>
                            )}
                            {comment.replyCount > 0 && (
                              <Tag icon={<MessageOutlined />}>{comment.replyCount} phản hồi</Tag>
                            )}
                            <Row justify="space-between" align="middle" gutter={[8, 8]}>
                              <Col>
                                <Space wrap>
                                  {comment.status !== COMMENT_STATUS.active && (
                                    <Button
                                      size="small"
                                      icon={<CheckCircleOutlined />}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        void setStatus(comment.id, COMMENT_STATUS.active);
                                      }}
                                    >
                                      Phê duyệt
                                    </Button>
                                  )}
                                  {comment.status !== COMMENT_STATUS.hidden && (
                                    <Button
                                      size="small"
                                      icon={<ExclamationCircleOutlined />}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        void setStatus(comment.id, COMMENT_STATUS.hidden);
                                      }}
                                    >
                                      Ẩn
                                    </Button>
                                  )}
                                  {comment.status !== COMMENT_STATUS.spam && (
                                    <Button
                                      size="small"
                                      danger
                                      icon={<StopOutlined />}
                                      onClick={(event) => {
                                        event.stopPropagation();
                                        void setStatus(comment.id, COMMENT_STATUS.spam);
                                      }}
                                    >
                                      Đánh dấu Spam
                                    </Button>
                                  )}
                                  <Button
                                    size="small"
                                    icon={<PushpinOutlined />}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      void runAction(
                                        () => setCommentPinned(comment.id, !comment.isPinned),
                                        comment.isPinned ? "Đã bỏ ghim bình luận." : "Đã ghim bình luận.",
                                      );
                                    }}
                                  >
                                    {comment.isPinned ? "Bỏ ghim" : "Ghim"}
                                  </Button>
                                </Space>
                              </Col>
                              <Col>
                                <Popconfirm
                                  title="Xóa bình luận này?"
                                  onConfirm={() =>
                                    runAction(() => removeComment(comment.id), "Đã xóa bình luận.")
                                  }
                                >
                                  <Button
                                    size="small"
                                    danger
                                    type="text"
                                    icon={<DeleteOutlined />}
                                    onClick={(event) => event.stopPropagation()}
                                  />
                                </Popconfirm>
                              </Col>
                            </Row>

                          </Space>
                        </Card>
                      );
                    })}
                  </Space>
                )}
              </Spin>
              <Pagination
                current={current}
                pageSize={pageSize}
                total={total}
                showSizeChanger
                showTotal={(count, range) => `Hiển thị ${range[0]}-${range[1]} trên ${count} bình luận`}
                onChange={(page, size) => {
                  setCurrent(page);
                  setPageSize(size);
                }}
              />
            </Space>
          </Col>

          <Col xs={24} xl={9}>
            <Card
              title="Thẩm định chi tiết"
              extra={selectedComment ? `#${selectedComment.id.slice(0, 8)}` : undefined}
              style={{ position: "sticky", top: 24 }}
            >
              {selectedComment ? (
                <Space direction="vertical" size="middle" style={{ display: "flex" }}>
                  <Space align="start">
                    <Avatar size={48} src={selectedComment.userAvatar} icon={<UserOutlined />} />
                    <div>
                      <Typography.Text strong>{selectedComment.userName || "Người dùng"}</Typography.Text>
                      <br />
                      <Typography.Text type="secondary">
                        {selectedComment.userEmail || "Không có email"}
                      </Typography.Text>
                    </div>
                  </Space>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Statistic title="Tổng bình luận" value={selectedComment.userCommentCount} />
                    </Col>
                    <Col span={12}>
                      <Statistic title="Vi phạm" value={selectedComment.userViolationCount} valueStyle={{ color: selectedComment.userViolationCount ? "#cf1322" : undefined }} />
                    </Col>
                  </Row>
                  <div>
                    <Typography.Text type="secondary">Bài viết nguồn</Typography.Text>
                    <br />
                    <Typography.Text strong>{selectedComment.catalogName || "Không xác định"}</Typography.Text>
                  </div>
                  <div>
                    <Typography.Text type="secondary">Nội dung bình luận</Typography.Text>
                    <Typography.Paragraph style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>
                      {selectedComment.content}
                    </Typography.Paragraph>
                  </div>
                  <div>
                    <Typography.Text type="secondary">Báo cáo của độc giả</Typography.Text>
                    <br />
                    <Tag color={selectedComment.reportCount ? "red" : "default"}>
                      {selectedComment.reportCount} báo cáo
                    </Tag>
                  </div>
                  <div>
                    <Typography.Text strong>Phản hồi chính thức</Typography.Text>
                    <Input.TextArea
                      value={reply}
                      maxLength={5000}
                      showCount
                      rows={4}
                      onChange={(event) => setReply(event.target.value)}
                      placeholder="Nhập nội dung phản hồi của tòa soạn..."
                      style={{ marginTop: 8 }}
                    />
                    <Button
                      type="primary"
                      icon={<SendOutlined />}
                      loading={submittingReply}
                      disabled={!reply.trim()}
                      onClick={() => void submitReply()}
                      style={{ marginTop: 8 }}
                    >
                      Gửi phản hồi
                    </Button>
                  </div>
                </Space>
              ) : (
                <Empty description="Chọn một bình luận để xem chi tiết." />
              )}
            </Card>
          </Col>
        </Row>

        <Card
          title="Bộ quy tắc lọc từ ngữ & Tự động hóa"
          extra={<Button type="primary" onClick={openNewRule}>Thêm quy tắc</Button>}
        >
          <Typography.Paragraph type="secondary">
            Quy tắc regex được kiểm tra với timeout an toàn. Bình luận khớp sẽ chuyển vào hàng chờ hoặc Spam; hệ thống không tự động cấm IP.
          </Typography.Paragraph>
          <Table<CommentModerationRule>
            rowKey="id"
            loading={rulesLoading}
            dataSource={rules}
            pagination={false}
            scroll={{ x: 760 }}
            columns={[
              {
                title: "Tên quy tắc",
                dataIndex: "name",
                render: (name: string, rule) => (
                  <Space direction="vertical" size={0}>
                    <Typography.Text strong>{name}</Typography.Text>
                    {rule.description && <Typography.Text type="secondary">{rule.description}</Typography.Text>}
                  </Space>
                ),
              },
              {
                title: "Pattern Regex",
                dataIndex: "pattern",
                render: (pattern: string) => <Typography.Text code>{pattern}</Typography.Text>,
              },
              {
                title: "Hành động",
                dataIndex: "action",
                render: (action: number) => (
                  <Tag color={action === 1 ? "red" : "gold"}>
                    {action === 1 ? "Chuyển vào Spam" : "Chờ kiểm duyệt"}
                  </Tag>
                ),
              },
              { title: "Số lần khớp", dataIndex: "matchCount" },
              {
                title: "Trạng thái",
                dataIndex: "isEnabled",
                render: (enabled: boolean, rule) => (
                  <Switch
                    checked={enabled}
                    onChange={(checked) => void updateRule(rule, { isEnabled: checked })}
                  />
                ),
              },
              {
                title: "Tác vụ",
                render: (_: unknown, rule) => (
                  <Space>
                    <Button
                      type="text"
                      icon={<EditOutlined />}
                      aria-label="Sửa quy tắc"
                      onClick={() => openEditRule(rule)}
                    />
                    <Popconfirm title="Xóa quy tắc này?" onConfirm={() => deleteRule(rule.id)}>
                      <Button type="text" danger icon={<DeleteOutlined />} aria-label="Xóa quy tắc" />
                    </Popconfirm>
                  </Space>
                ),
              },
            ]}
          />
        </Card>

        <Modal
          title={editingRule ? "Chỉnh sửa quy tắc" : "Thêm quy tắc"}
          open={ruleModalOpen}
          onCancel={() => setRuleModalOpen(false)}
          onOk={() => ruleForm.submit()}
          confirmLoading={savingRule}
          destroyOnHidden
        >
          <Form form={ruleForm} layout="vertical" onFinish={submitRule}>
            <Form.Item
              name="name"
              label="Tên quy tắc"
              rules={[{ required: true, whitespace: true, message: "Vui lòng nhập tên quy tắc." }]}
            >
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea maxLength={500} rows={2} />
            </Form.Item>
            <Form.Item
              name="pattern"
              label="Pattern Regex"
              rules={[{ required: true, whitespace: true, message: "Vui lòng nhập regex." }]}
              extra="Regex không phân biệt chữ hoa/thường; tối đa 500 ký tự."
            >
              <Input maxLength={500} />
            </Form.Item>
            <Form.Item name="action" label="Hành động" rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 0, label: "Chuyển vào hàng chờ kiểm duyệt" },
                  { value: 1, label: "Đánh dấu Spam" },
                ]}
              />
            </Form.Item>
            <Form.Item name="isEnabled" label="Đang bật" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      </Space>
    </PageContainer>
  );
};

export default CommentPage;
