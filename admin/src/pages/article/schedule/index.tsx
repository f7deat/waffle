import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EditOutlined,
  FileTextOutlined,
  LeftOutlined,
  LineChartOutlined,
  PlusOutlined,
  RightOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { history } from '@umijs/max';
import {
  Button,
  DatePicker,
  Empty,
  message,
  Modal,
  Select,
  Spin,
  Tag,
  Tooltip,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DragEvent } from 'react';
import {
  getArticleSchedule,
  updateArticleSchedule,
} from '@/services/article-schedule';
import type { ArticleScheduleItem, ArticleScheduleParams } from '@/services/article-schedule';

type CalendarView = 'month' | 'week' | 'list';
type ScheduleStatus = ArticleScheduleParams['status'];

const weekStartsOnMonday = (date: Dayjs) =>
  date.startOf('week').add(date.day() === 0 ? -6 : 1, 'day');

const itemDate = (article: ArticleScheduleItem) =>
  dayjs(article.scheduledAt || article.publishedAt);

const articleStatus = (article: ArticleScheduleItem) => {
  if (article.publishedAt) return 'Đã xuất bản';
  if (!article.isReadyToPublish) return 'Cần bổ sung nội dung';
  return 'Đã lên lịch';
};

const SchedulePage: React.FC = () => {
  const [view, setView] = useState<CalendarView>('month');
  const [viewDate, setViewDate] = useState(() => dayjs());
  const [selectedDate, setSelectedDate] = useState(() => dayjs());
  const [categoryId, setCategoryId] = useState<number>();
  const [creatorId, setCreatorId] = useState<string>();
  const [status, setStatus] = useState<ScheduleStatus>();
  const [scheduleData, setScheduleData] = useState<{
    articles: ArticleScheduleItem[];
    drafts: ArticleScheduleItem[];
    categories: { id: number; name: string }[];
    authors: { id: string; name: string }[];
  }>({ articles: [], drafts: [], categories: [], authors: [] });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleScheduleItem>();
  const [draftId, setDraftId] = useState<string>();
  const [scheduleDate, setScheduleDate] = useState<Dayjs | null>(null);

  const visibleDates = useMemo(() => {
    if (view === 'month') {
      const start = weekStartsOnMonday(viewDate.startOf('month'));
      return Array.from({ length: 42 }, (_, index) => start.add(index, 'day'));
    }
    if (view === 'week') {
      const start = weekStartsOnMonday(viewDate);
      return Array.from({ length: 7 }, (_, index) => start.add(index, 'day'));
    }
    return Array.from({ length: 7 }, (_, index) => viewDate.startOf('day').add(index, 'day'));
  }, [view, viewDate]);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const locale = window.localStorage.getItem('umi_locale') || 'vi-VN';
      const response = await getArticleSchedule({
        from: visibleDates[0].startOf('day').toISOString(),
        to: visibleDates[visibleDates.length - 1].add(1, 'day').startOf('day').toISOString(),
        locale,
        categoryId,
        creatorId,
        status,
      });
      setScheduleData(response);
    } catch {
      message.error('Không thể tải lịch xuất bản. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [categoryId, creatorId, status, visibleDates]);

  useEffect(() => {
    void loadSchedule();
  }, [loadSchedule]);

  const articlesByDay = useMemo(() => {
    const grouped = new Map<string, ArticleScheduleItem[]>();
    scheduleData.articles.forEach((article) => {
      const key = itemDate(article).format('YYYY-MM-DD');
      grouped.set(key, [...(grouped.get(key) || []), article]);
    });
    grouped.forEach((articles) =>
      articles.sort((left, right) => itemDate(left).valueOf() - itemDate(right).valueOf()),
    );
    return grouped;
  }, [scheduleData.articles]);

  const selectedArticles = articlesByDay.get(selectedDate.format('YYYY-MM-DD')) || [];
  const scheduledCount = scheduleData.articles.filter((article) => article.scheduledAt).length;
  const publishedCount = scheduleData.articles.filter((article) => article.publishedAt).length;
  const readinessPercent = scheduleData.articles.length
    ? Math.round(
        (scheduleData.articles.filter((article) => article.isReadyToPublish).length /
          scheduleData.articles.length) *
          100,
      )
    : 0;
  const collision = useMemo(() => {
    const scheduled = selectedArticles.filter((article) => article.scheduledAt && article.categoryId);
    for (let index = 0; index < scheduled.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < scheduled.length; otherIndex += 1) {
        const first = scheduled[index];
        const second = scheduled[otherIndex];
        if (
          first.categoryId === second.categoryId &&
          Math.abs(itemDate(first).diff(itemDate(second), 'minute')) < 30
        ) {
          return `${first.categoryName || 'Cùng chuyên mục'} có hai bài cách nhau dưới 30 phút.`;
        }
      }
    }
    return undefined;
  }, [selectedArticles]);

  const openNewSchedule = (date = dayjs()) => {
    setEditingArticle(undefined);
    setDraftId(undefined);
    const proposedDate = date.hour(10).minute(0).second(0);
    setScheduleDate(
      proposedDate.isAfter(dayjs()) ? proposedDate : dayjs().add(1, 'hour').startOf('hour'),
    );
    setModalOpen(true);
  };

  const openEditSchedule = (article: ArticleScheduleItem) => {
    setEditingArticle(article);
    setDraftId(article.id);
    setScheduleDate(itemDate(article));
    setModalOpen(true);
  };

  const saveSchedule = async () => {
    const articleId = editingArticle?.id || draftId;
    if (!articleId || !scheduleDate) {
      message.warning('Vui lòng chọn bài viết và thời gian xuất bản.');
      return;
    }
    if (!scheduleDate.isAfter(dayjs())) {
      message.warning('Thời gian xuất bản phải nằm trong tương lai.');
      return;
    }

    setSaving(true);
    try {
      await updateArticleSchedule(articleId, scheduleDate.toISOString());
      message.success(editingArticle ? 'Đã cập nhật lịch xuất bản.' : 'Đã lên lịch bài viết.');
      setModalOpen(false);
      setViewDate(scheduleDate);
      setSelectedDate(scheduleDate);
      await loadSchedule();
    } catch {
      message.error('Không thể lưu lịch xuất bản. Vui lòng kiểm tra trạng thái bài viết.');
    } finally {
      setSaving(false);
    }
  };

  const cancelSchedule = async (article: ArticleScheduleItem) => {
    try {
      await updateArticleSchedule(article.id);
      message.success('Đã hủy lịch xuất bản.');
      await loadSchedule();
      return true;
    } catch {
      message.error('Không thể hủy lịch xuất bản.');
      return false;
    }
  };

  const dropArticleOnDate = async (event: DragEvent, date: Dayjs) => {
    event.preventDefault();
    const articleId = event.dataTransfer.getData('text/article-id');
    const article = scheduleData.articles.find((item) => item.id === articleId);
    if (!article?.scheduledAt) return;

    const oldTime = itemDate(article);
    const newTime = date.hour(oldTime.hour()).minute(oldTime.minute()).second(0);
    if (!newTime.isAfter(dayjs())) {
      message.warning('Không thể chuyển lịch về thời điểm đã qua.');
      return;
    }

    try {
      await updateArticleSchedule(article.id, newTime.toISOString());
      message.success('Đã chuyển bài viết sang ngày mới.');
      setSelectedDate(date);
      await loadSchedule();
    } catch {
      message.error('Không thể thay đổi thời gian xuất bản.');
    }
  };

  const exportSchedule = () => {
    const quote = (value: string) => `"${value.replace(/"/g, '""')}"`;
    const lines = [
      ['Thời gian', 'Tiêu đề', 'Chuyên mục', 'Tác giả', 'Trạng thái'].map(quote).join(','),
      ...scheduleData.articles.map((article) =>
        [
          itemDate(article).format('YYYY-MM-DD HH:mm'),
          article.name,
          article.categoryName || '',
          article.creatorName || '',
          articleStatus(article),
        ]
          .map(quote)
          .join(','),
      ),
    ];
    const downloadUrl = URL.createObjectURL(
      new Blob([`\uFEFF${lines.join('\r\n')}`], { type: 'text/csv;charset=utf-8' }),
    );
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `lich-xuat-ban-${viewDate.format('YYYY-MM')}.csv`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  const moveViewDate = (offset: number) => {
    const nextDate =
      view === 'month' ? viewDate.add(offset, 'month') : viewDate.add(offset * 7, 'day');
    setViewDate(nextDate);
    setSelectedDate(nextDate);
  };

  const renderArticleCard = (article: ArticleScheduleItem, compact = false) => {
    const time = itemDate(article).format('HH:mm');
    const isScheduled = Boolean(article.scheduledAt);
    const card = (
      <div
        key={article.id}
        draggable={isScheduled}
        onDragStart={(event) => event.dataTransfer.setData('text/article-id', article.id)}
        onClick={() => {
          setSelectedDate(itemDate(article));
          if (isScheduled) openEditSchedule(article);
          else history.push(`/article/${article.id}`);
        }}
        className={`cursor-pointer rounded border-l-2 bg-white p-2 text-left shadow-sm transition hover:shadow ${
          article.publishedAt ? 'border-green-600' : article.isReadyToPublish ? 'border-blue-600' : 'border-orange-500'
        }`}
      >
        <div className="flex items-center justify-between gap-1">
          <span className="text-xs font-semibold text-slate-600">{time}</span>
          {article.publishedAt ? (
            <CheckCircleOutlined className="text-green-600" />
          ) : article.isReadyToPublish ? (
            <ClockCircleOutlined className="text-blue-600" />
          ) : (
            <Tooltip title="Thiếu mô tả, ảnh đại diện hoặc nội dung">
              <WarningOutlined className="text-orange-500" />
            </Tooltip>
          )}
        </div>
        <div className={`mt-1 font-medium text-slate-800 ${compact ? 'line-clamp-1 text-xs' : 'line-clamp-2 text-sm'}`}>
          {article.name}
        </div>
        {!compact && (
          <div className="mt-1 flex justify-between gap-2 text-xs text-slate-500">
            <span className="truncate">{article.categoryName || 'Chưa phân loại'}</span>
            <span className="truncate">{article.creatorName || 'Không rõ tác giả'}</span>
          </div>
        )}
      </div>
    );

    return card;
  };

  const renderDayCell = (date: Dayjs) => {
    const dayArticles = articlesByDay.get(date.format('YYYY-MM-DD')) || [];
    const isToday = date.isSame(dayjs(), 'day');
    const isCurrentMonth = date.isSame(viewDate, 'month');

    return (
      <div
        key={date.format('YYYY-MM-DD')}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => void dropArticleOnDate(event, date)}
        onDoubleClick={() => {
          setSelectedDate(date);
          openNewSchedule(date);
        }}
        className={`min-h-36 rounded-lg p-2 ${
          isToday ? 'bg-blue-50 ring-1 ring-blue-200' : 'bg-slate-50'
        } ${isCurrentMonth || view !== 'month' ? '' : 'opacity-45'}`}
      >
        <button
          type="button"
          onClick={() => setSelectedDate(date)}
          className={`mb-2 flex w-full items-center justify-between text-left text-sm ${
            isToday ? 'font-bold text-blue-700' : 'text-slate-600'
          }`}
        >
          <span>{date.format('D')}</span>
          {dayArticles.length > 0 && (
            <span className="text-xs text-slate-500">{dayArticles.length} bài</span>
          )}
        </button>
        <div className="flex flex-col gap-1.5">
          {(view === 'month' ? dayArticles.slice(0, 3) : dayArticles).map((article) =>
            renderArticleCard(article, view === 'month'),
          )}
          {view === 'month' && dayArticles.length > 3 && (
            <button
              type="button"
              onClick={() => setSelectedDate(date)}
              className="text-left text-xs font-medium text-blue-700 hover:underline"
            >
              +{dayArticles.length - 3} bài khác
            </button>
          )}
        </div>
      </div>
    );
  };

  const viewLabel =
    view === 'month' ? viewDate.format('[Tháng] M, YYYY') : `${visibleDates[0].format('DD/MM')} – ${visibleDates[6].format('DD/MM/YYYY')}`;

  return (
    <PageContainer
      title="Lịch xuất bản tòa soạn"
      subTitle="Lập kế hoạch và theo dõi thời điểm xuất bản bài viết."
      extra={[
        <Button key="export" icon={<DownloadOutlined />} onClick={exportSchedule}>
          Xuất lịch
        </Button>,
        <Button key="new" type="primary" icon={<PlusOutlined />} onClick={() => openNewSchedule()}>
          Lên lịch bài viết
        </Button>,
      ]}
    >
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bài trong khung thời gian</div>
          <div className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-800">
            <FileTextOutlined className="text-blue-600" /> {scheduleData.articles.length}
          </div>
          <div className="mt-1 text-xs text-slate-500">{scheduledCount} chờ xuất bản · {publishedCount} đã xuất bản</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hôm nay</div>
          <div className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-800">
            <CalendarOutlined className="text-green-600" /> {(articlesByDay.get(dayjs().format('YYYY-MM-DD')) || []).length}
          </div>
          <div className="mt-1 text-xs text-slate-500">bài viết trong lịch</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Khung giờ gợi ý</div>
          <div className="mt-1 text-lg font-bold text-slate-800">11:30–12:30 · 19:30–21:00</div>
          <div className="mt-1 text-xs text-slate-500">Khung tham khảo cho Hardware và Esports</div>
        </div>
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sẵn sàng xuất bản</div>
          <div className="mt-1 text-2xl font-bold text-slate-800">{readinessPercent}%</div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-green-600" style={{ width: `${readinessPercent}%` }} />
          </div>
          <div className="mt-1 text-xs text-slate-500">Đủ mô tả, ảnh đại diện và nội dung</div>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12">
        <section className="rounded-xl bg-white p-4 shadow-sm xl:col-span-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg bg-slate-100 p-1">
                {([
                  ['month', 'Tháng'],
                  ['week', 'Tuần'],
                  ['list', 'Danh sách'],
                ] as const).map(([key, label]) => (
                  <Button
                    key={key}
                    type={view === key ? 'primary' : 'text'}
                    size="small"
                    onClick={() => setView(key)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              <Button aria-label="Khoảng thời gian trước" icon={<LeftOutlined />} onClick={() => moveViewDate(-1)} />
              <Button
                onClick={() => {
                  setViewDate(dayjs());
                  setSelectedDate(dayjs());
                }}
              >
                Hôm nay
              </Button>
              <Button aria-label="Khoảng thời gian sau" icon={<RightOutlined />} onClick={() => moveViewDate(1)} />
              <strong className="ml-1 text-slate-800">{viewLabel}</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                allowClear
                placeholder="Tất cả chuyên mục"
                value={categoryId}
                onChange={setCategoryId}
                options={scheduleData.categories.map((category) => ({
                  value: category.id,
                  label: category.name,
                }))}
                className="min-w-44"
              />
              <Select
                allowClear
                placeholder="Tất cả tác giả"
                value={creatorId}
                onChange={setCreatorId}
                options={scheduleData.authors.map((author) => ({
                  value: author.id,
                  label: author.name,
                }))}
                className="min-w-40"
              />
              <Select
                allowClear
                placeholder="Mọi trạng thái"
                value={status}
                onChange={setStatus}
                options={[
                  { value: 'published', label: 'Đã xuất bản' },
                  { value: 'scheduled', label: 'Đã lên lịch' },
                  { value: 'needs-review', label: 'Cần bổ sung nội dung' },
                ]}
                className="min-w-44"
              />
            </div>
          </div>
          <div className="mb-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
            <span>Kéo thẻ bài viết đã lên lịch sang ngày khác để đổi thời gian xuất bản. Nhấp đúp ô ngày để lên lịch nhanh.</span>
            <span className="hidden shrink-0 sm:block">Múi giờ theo thiết bị</span>
          </div>

          <Spin spinning={loading}>
            {view !== 'list' && (
              <>
                <div className="mb-1 grid grid-cols-7 gap-1 rounded-lg bg-slate-100 py-2 text-center text-xs font-semibold text-slate-600">
                  {['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'].map((day) => (
                    <span key={day}>{day}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">{visibleDates.map(renderDayCell)}</div>
              </>
            )}
            {view === 'list' && (
              <div className="flex flex-col gap-2">
                {scheduleData.articles.length ? (
                  scheduleData.articles
                    .slice()
                    .sort((left, right) => itemDate(left).valueOf() - itemDate(right).valueOf())
                    .map((article) => (
                      <div key={article.id} className="flex flex-wrap items-center gap-3 rounded-lg bg-slate-50 p-3">
                        <span className="w-32 shrink-0 text-sm font-semibold text-slate-600">
                          {itemDate(article).format('DD/MM/YYYY HH:mm')}
                        </span>
                        <div className="min-w-0 flex-1">{renderArticleCard(article)}</div>
                        <Tag color={article.publishedAt ? 'green' : article.isReadyToPublish ? 'blue' : 'orange'}>
                          {articleStatus(article)}
                        </Tag>
                      </div>
                    ))
                ) : (
                  <Empty description="Không có bài viết trong khoảng thời gian này" />
                )}
              </div>
            )}
          </Spin>
          <div className="mt-4 flex flex-wrap items-center gap-4 border-t pt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-green-600" /> Đã xuất bản</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-blue-600" /> Đã lên lịch</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-sm bg-orange-500" /> Cần bổ sung nội dung</span>
          </div>
        </section>

        <aside className="flex flex-col gap-4 xl:col-span-4">
          <section className="rounded-xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="m-0 text-base font-semibold text-slate-800">
                Lịch trình {selectedDate.isSame(dayjs(), 'day') ? 'hôm nay' : selectedDate.format('DD/MM')}
              </h2>
              <Tag>{selectedArticles.length} bài</Tag>
            </div>
            {selectedArticles.length ? (
              <div className="flex flex-col gap-2">
                {selectedArticles.map((article) => (
                  <div key={article.id} className="rounded-lg bg-slate-50 p-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-700">{itemDate(article).format('HH:mm')}</span>
                      <Tag
                        color={article.publishedAt ? 'green' : article.isReadyToPublish ? 'blue' : 'orange'}
                        className="mr-0"
                      >
                        {articleStatus(article)}
                      </Tag>
                    </div>
                    {renderArticleCard(article)}
                    {article.scheduledAt && (
                      <Button
                        type="link"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => openEditSchedule(article)}
                      >
                        Chỉnh lịch
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Chưa có bài viết trong ngày này" />
            )}
          </section>

          <section className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="mb-2 flex items-center gap-2 text-base font-semibold text-slate-800">
              <LineChartOutlined className="text-blue-600" /> Khung giờ phân phối
            </h2>
            <p className="text-sm text-slate-500">Khung giờ gợi ý để đội ngũ cân nhắc khi lên lịch nội dung.</p>
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="flex justify-between text-xs text-slate-500">
                <span>06:00</span><strong>11:30</strong><span>15:00</span><strong>20:30</strong><span>23:00</span>
              </div>
              <svg className="mt-2 h-16 w-full text-blue-600" viewBox="0 0 300 70" preserveAspectRatio="none" aria-label="Đường cong khung giờ gợi ý">
                <path d="M0 55 Q30 50 60 45 T120 15 T160 40 T210 10 T260 25 T300 50" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
                <circle cx="120" cy="15" r="3.5" fill="white" stroke="currentColor" strokeWidth="2" />
                <circle cx="210" cy="10" r="3.5" fill="white" stroke="currentColor" strokeWidth="2" />
              </svg>
              <div className="mt-2 border-t pt-2 text-xs font-medium text-blue-700">Hardware · Esports · Bài đánh giá</div>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm">
              {collision ? <WarningOutlined className="mt-0.5 text-orange-500" /> : <CheckCircleOutlined className="mt-0.5 text-green-600" />}
              <span>{collision || 'Không phát hiện hai bài cùng chuyên mục xuất bản cách nhau dưới 30 phút.'}</span>
            </div>
          </section>
        </aside>
      </div>

      <Modal
        title={editingArticle ? 'Điều chỉnh lịch xuất bản' : 'Lên lịch bài viết'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => void saveSchedule()}
        okText="Lưu lịch"
        cancelText="Đóng"
        confirmLoading={saving}
        destroyOnClose
      >
        <div className="flex flex-col gap-4 py-2">
          {editingArticle ? (
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="text-xs text-slate-500">Bài viết</div>
              <div className="font-medium">{editingArticle.name}</div>
            </div>
          ) : (
            <>
              <Select
                showSearch
                placeholder="Chọn bản nháp cần lên lịch"
                value={draftId}
                onChange={setDraftId}
                options={scheduleData.drafts.map((draft) => ({
                  value: draft.id,
                  label: `${draft.name}${draft.creatorName ? ` — ${draft.creatorName}` : ''}`,
                }))}
                filterOption={(input, option) =>
                  String(option?.label || '').toLowerCase().includes(input.toLowerCase())
                }
              />
              {scheduleData.drafts.length === 0 && (
                <Button
                  type="link"
                  className="self-start p-0"
                  onClick={() => {
                    setModalOpen(false);
                    history.push('/article/list');
                  }}
                >
                  Chưa có bản nháp? Tạo bài viết mới
                </Button>
              )}
            </>
          )}
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="DD/MM/YYYY HH:mm"
            value={scheduleDate}
            onChange={setScheduleDate}
            disabledDate={(date) => date.isBefore(dayjs(), 'day')}
            className="w-full"
          />
          {editingArticle?.scheduledAt && (
            <Button
              danger
              onClick={() => {
                void cancelSchedule(editingArticle).then((cancelled) => {
                  if (cancelled) setModalOpen(false);
                });
              }}
            >
              Hủy lịch và chuyển về bản nháp
            </Button>
          )}
        </div>
      </Modal>
    </PageContainer>
  );
};

export default SchedulePage;
