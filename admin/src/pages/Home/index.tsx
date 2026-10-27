import {
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudOutlined,
  EditOutlined,
  EyeOutlined,
  FileTextOutlined,
  FilterOutlined,
  FireOutlined,
  HistoryOutlined,
  LineChartOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  TeamOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useRequest, history } from '@umijs/max';
import { Alert, Avatar, Button, Empty, Input, Spin, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { apiArticleStatistics } from '@/services/catalogs/article';
import { ArticleListItem, listArticles } from '@/services/article';

type ArticleStatistics = {
  totalArticles: number;
  previousMonth: number;
  currentMonth: number;
  viewCount: number;
};

type ArticleStatus = 'published' | 'draft' | 'scheduled';
type WorkflowFilter = 'all' | ArticleStatus;
type TrafficPeriod = '7d' | '30d' | '90d';

type DashboardArticle = ArticleListItem & {
  category: string;
  score: number;
  status: ArticleStatus;
};

const mockStatistics: ArticleStatistics = {
  totalArticles: 1428,
  previousMonth: 42,
  currentMonth: 47,
  viewCount: 3842500,
};

const mockArticles: DashboardArticle[] = [
  {
    id: 'mock-rtx-5080',
    name: 'Đánh giá chi tiết NVIDIA RTX 5080: Bước nhảy vọt hiệu năng 4K gaming',
    description: 'Đánh giá card đồ họa thế hệ mới và hiệu năng chơi game 4K.',
    viewCount: 125800,
    creatorName: 'Nam Khánh',
    createdDate: dayjs().subtract(14, 'minute').toISOString(),
    modifiedDate: dayjs().subtract(14, 'minute').toISOString(),
    publishedAt: dayjs().subtract(35, 'minute').toISOString(),
    category: 'Phần cứng PC',
    score: 94,
    status: 'published',
  },
  {
    id: 'mock-t1-lck',
    name: 'T1 vô địch LCK Mùa Xuân 2025: Faker và kỷ lục vô tiền khoáng hậu',
    description: 'Nhìn lại trận chung kết LCK với nhiều dấu mốc đáng nhớ.',
    viewCount: 88140,
    creatorName: 'Quốc Bảo',
    createdDate: dayjs().subtract(35, 'minute').toISOString(),
    modifiedDate: dayjs().subtract(35, 'minute').toISOString(),
    publishedAt: dayjs().subtract(35, 'minute').toISOString(),
    category: 'Gaming & Esports',
    score: 98,
    status: 'published',
  },
  {
    id: 'mock-snapdragon',
    name: 'Trên tay Snapdragon 8 Elite: Smartphone gaming chuyển mình ra sao?',
    description: 'Thử nghiệm nền tảng di động mới trên các thiết bị chơi game.',
    viewCount: 0,
    creatorName: 'Minh Trí',
    createdDate: dayjs().subtract(1, 'hour').toISOString(),
    modifiedDate: dayjs().subtract(1, 'hour').toISOString(),
    category: 'Công nghệ & AI',
    score: 78,
    status: 'draft',
  },
  {
    id: 'mock-pc-build',
    name: 'Cẩm nang build PC chơi Black Myth: Wukong tối ưu từng mức ngân sách',
    description: 'Gợi ý cấu hình PC phù hợp cho nhiều mức đầu tư.',
    viewCount: 0,
    creatorName: 'Hoàng Long',
    createdDate: dayjs().subtract(2, 'hour').toISOString(),
    modifiedDate: dayjs().subtract(2, 'hour').toISOString(),
    publishedAt: dayjs().add(1, 'day').toISOString(),
    category: 'Phần cứng PC',
    score: 88,
    status: 'scheduled',
  },
];

const mockTrafficSeries: Record<TrafficPeriod, { pageviews: number[]; visitors: number[]; labels: string[]; totalViews: string; totalVisitors: string; peak: string }> = {
  '7d': {
    pageviews: [48, 57, 53, 78, 70, 88, 82, 96],
    visitors: [28, 38, 34, 52, 48, 63, 58, 72],
    labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
    totalViews: '892.4K',
    totalVisitors: '341.8K',
    peak: '168.4K lượt/ngày',
  },
  '30d': {
    pageviews: [22, 38, 31, 57, 70, 63, 78, 71, 84, 55, 39, 68, 87, 97],
    visitors: [14, 21, 20, 33, 39, 35, 46, 42, 49, 32, 25, 39, 51, 58],
    labels: ['01/03', '07/03', '14/03', '21/03', '28/03', 'Hôm nay'],
    totalViews: '3.84M',
    totalVisitors: '1.49M',
    peak: '168.4K lượt/ngày',
  },
  '90d': {
    pageviews: [30, 42, 36, 54, 48, 64, 59, 76, 68, 84, 73, 96],
    visitors: [18, 27, 24, 35, 32, 43, 40, 50, 46, 58, 52, 68],
    labels: ['Tháng 1', '15/01', 'Tháng 2', '15/02', 'Tháng 3', 'Hôm nay'],
    totalViews: '10.82M',
    totalVisitors: '4.21M',
    peak: '172.1K lượt/ngày',
  },
};

const categories = [
  { name: 'Gaming & Esports', percent: 42, views: '1.61M', color: '#0879b8' },
  { name: 'Công nghệ & AI', percent: 28, views: '1.07M', color: '#51a9e4' },
  { name: 'Phần cứng PC', percent: 18, views: '691K', color: '#91b8d7' },
  { name: 'Giải trí số', percent: 12, views: '461K', color: '#c4d2df' },
];

const weeklyPublishing = [
  { day: 'T2', percent: 60 },
  { day: 'T3', percent: 75 },
  { day: 'T4', percent: 90 },
  { day: 'T5', percent: 70 },
  { day: 'T6', percent: 85 },
  { day: 'T7', percent: 45 },
  { day: 'CN', percent: 35 },
];

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' ? value as Record<string, unknown> : undefined;

const unwrapData = (value: unknown): unknown => {
  const record = asRecord(value);
  return record?.succeeded !== undefined && record.data !== undefined ? record.data : value;
};

const parseStatistics = (value: unknown): ArticleStatistics | undefined => {
  const payload = asRecord(unwrapData(value));
  if (!payload) return undefined;
  const numberOrUndefined = (primary: unknown, fallback: unknown) => {
    const number = Number(primary ?? fallback);
    return Number.isFinite(number) ? number : undefined;
  };
  const totalArticles = numberOrUndefined(payload.totalArticles, payload.TotalArticles);
  const previousMonth = numberOrUndefined(payload.previousMonth, payload.PreviousMonth);
  const currentMonth = numberOrUndefined(payload.currentMonth, payload.CurrentMonth);
  const viewCount = numberOrUndefined(payload.viewCount, payload.ViewCount);
  if ([totalArticles, previousMonth, currentMonth, viewCount].some((item) => item === undefined)) return undefined;
  return {
    totalArticles: totalArticles!,
    previousMonth: previousMonth!,
    currentMonth: currentMonth!,
    viewCount: viewCount!,
  };
};

const unwrapArticleList = (value: unknown): ArticleListItem[] => {
  const payload = asRecord(unwrapData(value));
  return Array.isArray(payload?.data) ? payload.data as ArticleListItem[] : [];
};

const formatNumber = (value: number) => value.toLocaleString('vi-VN');

const formatRelativeDate = (value?: string) => {
  if (!value || !dayjs(value).isValid()) return 'Chưa cập nhật';
  const minutes = dayjs().diff(dayjs(value), 'minute');
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày trước`;
  return dayjs(value).format('DD/MM/YYYY');
};

const getArticlePath = (article: ArticleListItem) =>
  article.id.startsWith('mock-') ? '/article/list' : `/article/${article.id}`;

const articleStatus = (article: ArticleListItem): ArticleStatus => {
  if (!article.publishedAt) return 'draft';
  return dayjs(article.publishedAt).isAfter(dayjs()) ? 'scheduled' : 'published';
};

const statusText: Record<ArticleStatus, string> = {
  published: 'Đã xuất bản',
  draft: 'Bản nháp',
  scheduled: 'Đã lên lịch',
};

const statusClass: Record<ArticleStatus, string> = {
  published: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-amber-50 text-amber-700',
  scheduled: 'bg-sky-50 text-sky-700',
};

const buildLinePath = (values: number[]) =>
  values.map((value, index) => {
    const x = (index / (values.length - 1)) * 760;
    const y = 185 - (value / 100) * 160;
    return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');

const buildAreaPath = (values: number[]) =>
  `${buildLinePath(values)} L 760 185 L 0 185 Z`;

const HomePage: React.FC = () => {
  const [period, setPeriod] = useState<TrafficPeriod>('30d');
  const [workflowFilter, setWorkflowFilter] = useState<WorkflowFilter>('all');
  const [search, setSearch] = useState('');
  const statisticsRequest = useRequest(apiArticleStatistics);
  const articlesRequest = useRequest(() =>
    listArticles({ current: 1, pageSize: 8 }, { modifiedDate: 'descend' }),
  );

  const statistics = parseStatistics(statisticsRequest.data);
  const apiArticles = unwrapArticleList(articlesRequest.data);
  const usingMockArticles = apiArticles.length === 0;
  const articles: DashboardArticle[] = usingMockArticles
    ? mockArticles
    : apiArticles.map((article) => ({
      ...article,
      category: 'Chưa phân loại',
      score: 0,
      status: articleStatus(article),
    }));
  const visibleArticles = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('vi-VN');
    return articles.filter((article) => {
      const matchesStatus = workflowFilter === 'all' || article.status === workflowFilter;
      const matchesSearch = !normalizedSearch
        || article.name.toLocaleLowerCase('vi-VN').includes(normalizedSearch)
        || article.creatorName?.toLocaleLowerCase('vi-VN').includes(normalizedSearch);
      return matchesStatus && matchesSearch;
    });
  }, [articles, search, workflowFilter]);
  const displayedStatistics = statistics ?? mockStatistics;
  const isUsingMockStatistics = !statistics;
  const articleTrend = displayedStatistics.previousMonth > 0
    ? ((displayedStatistics.currentMonth - displayedStatistics.previousMonth) / displayedStatistics.previousMonth) * 100
    : 0;
  const selectedTraffic = mockTrafficSeries[period];
  const isLoading = statisticsRequest.loading || articlesRequest.loading;
  const hasRequestError = statisticsRequest.error || articlesRequest.error;

  const refreshDashboard = () => {
    statisticsRequest.refresh();
    articlesRequest.refresh();
  };

  return (
    <PageContainer title={false} breadcrumbRender={false}>
      <main className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 pb-8">
        <section className="flex flex-col justify-between gap-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:p-6">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-[11px] font-bold tracking-wider text-sky-800">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sky-600" />
                LIVE DESK
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarOutlined />
                {new Intl.DateTimeFormat('vi-VN', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  timeZone: 'Asia/Ho_Chi_Minh',
                }).format(new Date())}
                <span>•</span>
                Giờ Hà Nội (GMT+7)
              </span>
            </div>
            <h1 className="m-0 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Bảng điều khiển Tòa soạn DefZone
            </h1>
            <p className="mb-0 mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Trung tâm giám sát hiệu năng xuất bản, hàng đợi biên tập và lưu lượng độc giả DefZone.Net
            </p>
            {(isUsingMockStatistics || usingMockArticles) && (
              <p className="mb-0 mt-2 text-xs text-amber-700">
                Một số mục đang hiển thị dữ liệu minh họa vì chưa có dữ liệu từ API.
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <strong className="text-slate-800">14ms Latency</strong>
              <span>Node SGN-01</span>
            </div>
            <Button icon={<ReloadOutlined />} onClick={refreshDashboard} loading={isLoading}>
              Làm mới
            </Button>
            <Button type="primary" icon={<ThunderboltOutlined />} onClick={() => history.push('/article/list')}>
              Tạo bài viết
            </Button>
          </div>
        </section>

        {hasRequestError && (
          <Alert
            showIcon
            type="warning"
            message="Không thể tải đầy đủ dữ liệu dashboard"
            description="Đang hiển thị dữ liệu mẫu cho phần chưa tải được. Hãy thử làm mới hoặc kiểm tra kết nối API."
          />
        )}

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
          <MetricCard
            title="Tổng số bài"
            value={formatNumber(displayedStatistics.totalArticles)}
            detail={`${articleTrend >= 0 ? '+' : ''}${articleTrend.toFixed(1)}%`}
            detailText="so với tháng trước"
            icon={<FileTextOutlined />}
            tone="blue"
          />
          <MetricCard
            title="Đã xuất bản tháng này"
            value={formatNumber(displayedStatistics.currentMonth)}
            detail={`${formatNumber(displayedStatistics.previousMonth)} bài`}
            detailText="tháng trước"
            icon={<CheckCircleOutlined />}
            tone="green"
          />
          <MetricCard
            title="Chờ biên tập"
            value={usingMockArticles ? '18' : formatNumber(articles.filter((item) => item.status === 'draft').length)}
            detail="Gấp: 5 bài"
            detailText="cần xem xét"
            icon={<ClockCircleOutlined />}
            tone="amber"
            mock={usingMockArticles}
          />
          <MetricCard
            title="Đã lên lịch"
            value={usingMockArticles ? '12' : formatNumber(articles.filter((item) => item.status === 'scheduled').length)}
            detail="4 bài"
            detailText="sẽ đăng hôm nay"
            icon={<CalendarOutlined />}
            tone="violet"
            mock={usingMockArticles}
          />
          <MetricCard
            title="Tổng lượt xem"
            value={formatCompact(displayedStatistics.viewCount)}
            detail="+24.8%"
            detailText="so với cùng kỳ"
            icon={<EyeOutlined />}
            tone="blue"
          />
          <MetricCard
            title="Nhân sự tòa soạn"
            value="46"
            detail="14 online"
            detailText="biên tập viên"
            icon={<TeamOutlined />}
            tone="green"
            mock
          />
        </section>

        <section className="grid grid-cols-1 gap-5 2xl:grid-cols-12">
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm 2xl:col-span-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="m-0 text-base font-semibold text-slate-900">Lưu lượng độc giả & tương tác</h2>
                  <Tag bordered={false} color="blue">Realtime Traffic</Tag>
                </div>
                <p className="mb-0 mt-1 text-xs text-slate-500">
                  So sánh lượt xem trang và độc giả riêng biệt
                </p>
              </div>
              <div className="flex w-fit rounded-lg bg-slate-100 p-1">
                {([
                  ['30d', '30 ngày'],
                  ['7d', '7 ngày'],
                  ['90d', '90 ngày'],
                ] as [TrafficPeriod, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPeriod(key)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
                      period === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3">
              <TrafficLegend color="#0879b8" value={selectedTraffic.totalViews} label="Lượt xem trang" />
              <TrafficLegend color="#51a9e4" value={selectedTraffic.totalVisitors} label="Unique Visitors" />
              <span className="ml-auto hidden items-center gap-1.5 text-xs font-medium text-sky-700 md:flex">
                <LineChartOutlined />
                Cao điểm: {selectedTraffic.peak}
              </span>
            </div>
            <div className="mt-4 h-56 w-full">
              <svg
                className="h-full w-full overflow-visible"
                viewBox="0 0 760 220"
                preserveAspectRatio="none"
                role="img"
                aria-label={`Biểu đồ lưu lượng độc giả ${period === '7d' ? '7 ngày' : period === '30d' ? '30 ngày' : '90 ngày'}`}
              >
                <defs>
                  <linearGradient id="pageviews-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0879b8" stopOpacity=".24" />
                    <stop offset="100%" stopColor="#0879b8" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[20, 75, 130, 185].map((y) => (
                  <line key={y} x1="0" x2="760" y1={y} y2={y} stroke="#e8eef5" strokeDasharray={y === 185 ? undefined : '3 4'} />
                ))}
                {[['180K', 18], ['120K', 73], ['60K', 128], ['0', 182]].map(([label, y]) => (
                  <text key={label} x="755" y={y} textAnchor="end" fill="#94a3b8" fontSize="10">{label}</text>
                ))}
                <path d={buildAreaPath(selectedTraffic.pageviews)} fill="url(#pageviews-gradient)" />
                <path d={buildLinePath(selectedTraffic.pageviews)} fill="none" stroke="#0879b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d={buildLinePath(selectedTraffic.visitors)} fill="none" stroke="#51a9e4" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" strokeLinejoin="round" />
                {selectedTraffic.pageviews.map((value, index) => {
                  if (index !== Math.floor(selectedTraffic.pageviews.length * 0.78)) return null;
                  return (
                    <circle
                      key={index}
                      cx={(index / (selectedTraffic.pageviews.length - 1)) * 760}
                      cy={185 - (value / 100) * 160}
                      r="4.5"
                      fill="#0879b8"
                      stroke="white"
                      strokeWidth="2"
                    />
                  );
                })}
                {selectedTraffic.labels.map((label, index) => (
                  <text
                    key={label}
                    x={index * (760 / Math.max(selectedTraffic.labels.length - 1, 1)) + 4}
                    y="207"
                    fill="#94a3b8"
                    fontSize="10"
                  >
                    {label}
                  </text>
                ))}
              </svg>
            </div>
            <div className="mt-3 flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <span>Tỷ lệ thoát trang trung bình: <strong className="text-slate-800">38.2%</strong></span>
              <span>Thời gian đọc trung bình: <strong className="text-slate-800">3 phút 42 giây</strong></span>
              <span className="text-amber-700">Lưu lượng đang dùng dữ liệu minh họa</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 2xl:col-span-4">
            <div className="flex-1 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="m-0 text-base font-semibold text-slate-900">Hiệu quả theo chuyên mục</h2>
                <span className="text-slate-400"><LineChartOutlined /></span>
              </div>
              <p className="mb-5 mt-1 text-xs text-slate-500">Tỷ trọng lượt đọc theo danh mục</p>
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-2 text-xs">
                      <span className="flex items-center gap-2 font-medium text-slate-700">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.color }} />
                        {category.name}
                      </span>
                      <span className="shrink-0 font-semibold text-slate-800">{category.percent}% ({category.views})</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full" style={{ width: `${category.percent}%`, backgroundColor: category.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mb-0 mt-4 text-right text-[11px] text-amber-700">Dữ liệu minh họa</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="m-0 text-base font-semibold text-slate-900">Bài xuất bản trong tuần</h2>
                  <p className="mb-0 mt-1 text-xs text-slate-500">Mục tiêu: 8 bài/ngày</p>
                </div>
                <Tag bordered={false}>47 bài/tuần</Tag>
              </div>
              <div className="mt-4 grid h-24 grid-cols-7 items-end gap-2">
                {weeklyPublishing.map((item, index) => (
                  <div key={item.day} className="flex h-full flex-col items-center justify-end gap-1.5">
                    <div
                      className={`w-full rounded-t-sm ${index === 2 ? 'bg-sky-700' : index < 5 ? 'bg-sky-200' : 'bg-slate-200'}`}
                      style={{ height: `${item.percent}%` }}
                    />
                    <span className={`text-[10px] ${index === 2 ? 'font-bold text-slate-800' : 'text-slate-400'}`}>{item.day}</span>
                  </div>
                ))}
              </div>
              <p className="mb-0 mt-2 text-right text-[11px] text-amber-700">Dữ liệu minh họa</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sky-700"><HistoryOutlined /></span>
              <h2 className="m-0 text-lg font-semibold text-slate-900">Quy trình biên tập & duyệt tin</h2>
            </div>
            <span className="flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Tự động cập nhật khi tải lại dashboard
            </span>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {([
              ['all', 'Tất cả bài viết', <FileTextOutlined key="all" />],
              ['draft', 'Bản nháp', <EditOutlined key="draft" />],
              ['scheduled', 'Sắp xuất bản', <CalendarOutlined key="scheduled" />],
              ['published', 'Đã xuất bản', <CheckCircleOutlined key="published" />],
            ] as [WorkflowFilter, string, React.ReactNode][]).map(([key, label, icon]) => (
              <button
                key={key}
                type="button"
                onClick={() => setWorkflowFilter(key)}
                className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  workflowFilter === key ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {icon}
                {label}
                <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  workflowFilter === key ? 'bg-white/15 text-white' : 'bg-white text-slate-500'
                }`}>
                  {key === 'all' ? articles.length : articles.filter((article) => article.status === key).length}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-3">
            {articles.slice(0, 3).map((article, index) => (
              <article key={article.id} className="flex min-h-36 flex-col justify-between rounded-xl bg-slate-50 p-4 transition hover:bg-slate-100">
                <div className="flex items-center justify-between gap-2">
                  <Tag bordered={false} color={article.status === 'draft' ? 'gold' : article.status === 'scheduled' ? 'blue' : 'green'}>
                    {article.status === 'draft' && index === 0 ? <FireOutlined /> : null}
                    {' '}{statusText[article.status]}
                  </Tag>
                  <span className="shrink-0 text-[11px] text-slate-400">{formatRelativeDate(article.modifiedDate || article.createdDate)}</span>
                </div>
                <a
                  href={getArticlePath(article)}
                  onClick={(event) => {
                    event.preventDefault();
                    history.push(getArticlePath(article));
                  }}
                  className="my-3 line-clamp-2 text-sm font-semibold leading-5 text-slate-800 hover:text-sky-700"
                >
                  {article.name}
                </a>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                    <Avatar size={22} src={article.creatorAvatar}>{article.creatorName?.slice(0, 1) || 'B'}</Avatar>
                    <span className="truncate">{article.creatorName || 'Biên tập viên'}</span>
                  </span>
                  <Button size="small" type="text" onClick={() => history.push(getArticlePath(article))}>
                    Mở bài
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="m-0 text-lg font-semibold text-slate-900">Bài viết vừa cập nhật</h2>
                <Tag bordered={false}>{formatNumber(displayedStatistics.totalArticles)} bài viết</Tag>
                {usingMockArticles && <Tag color="gold">Dữ liệu mẫu</Tag>}
              </div>
              <p className="mb-0 mt-1 text-xs text-slate-500">Theo dõi nội dung, trạng thái xuất bản và lượt xem</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                allowClear
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                prefix={<SearchOutlined className="text-slate-400" />}
                placeholder="Tìm tiêu đề, tác giả..."
                className="w-full sm:w-64"
              />
              <Button icon={<FilterOutlined />} onClick={() => setWorkflowFilter('all')}>Bộ lọc</Button>
              <Button type="primary" ghost icon={<PlusOutlined />} onClick={() => history.push('/article/list')}>
                Tất cả bài viết
              </Button>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full min-w-[980px] text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tiêu đề bài viết</th>
                  <th className="px-4 py-3 font-semibold">Chuyên mục</th>
                  <th className="px-4 py-3 font-semibold">Tác giả</th>
                  <th className="px-4 py-3 font-semibold">SEO / Điểm</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold">Lượt xem</th>
                  <th className="px-4 py-3 font-semibold">Cập nhật</th>
                  <th className="px-4 py-3 text-right font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {isLoading && articles.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center"><Spin /></td></tr>
                ) : visibleArticles.slice(0, 4).map((article) => (
                  <tr key={article.id} className="group transition hover:bg-slate-50">
                    <td className="max-w-[360px] px-4 py-3">
                      <div className="flex items-center gap-3">
                        {article.thumbnail ? (
                          <img src={article.thumbnail} alt="" className="h-10 w-14 shrink-0 rounded-md object-cover" />
                        ) : (
                          <div className="flex h-10 w-14 shrink-0 items-center justify-center rounded-md bg-sky-50 text-sky-700">
                            <FileTextOutlined />
                          </div>
                        )}
                        <div className="min-w-0">
                          <a
                            href={getArticlePath(article)}
                            onClick={(event) => {
                              event.preventDefault();
                              history.push(getArticlePath(article));
                            }}
                            className="line-clamp-1 font-semibold text-slate-800 hover:text-sky-700"
                          >
                            {article.name}
                          </a>
                          <span className="block truncate text-[11px] text-slate-400">
                            Mã bài viết: {article.id.slice(0, 8)}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Tag bordered={false}>{article.category}</Tag></td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="flex items-center gap-2 text-xs text-slate-600">
                        <Avatar size={24} src={article.creatorAvatar}>{article.creatorName?.slice(0, 1) || 'B'}</Avatar>
                        {article.creatorName || 'Biên tập viên'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {article.score ? <Score score={article.score} /> : <span className="text-xs text-slate-400">—</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClass[article.status]}`}>
                        <span className="mr-1">•</span>{statusText[article.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-slate-700">
                      {article.viewCount ? formatNumber(article.viewCount) : '—'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                      {formatRelativeDate(article.modifiedDate || article.createdDate)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Tooltip title="Xem bài viết">
                          <Button type="text" size="small" icon={<EyeOutlined />} aria-label="Xem bài viết" onClick={() => history.push(getArticlePath(article))} />
                        </Tooltip>
                        <Tooltip title="Chỉnh sửa">
                          <Button type="text" size="small" icon={<EditOutlined />} aria-label="Chỉnh sửa bài viết" onClick={() => history.push(getArticlePath(article))} />
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                ))}
                {!isLoading && visibleArticles.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-10"><Empty description="Không tìm thấy bài viết phù hợp" /></td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-col justify-between gap-2 text-xs text-slate-500 sm:flex-row sm:items-center">
            <span>
              Hiển thị <strong className="text-slate-800">{Math.min(visibleArticles.length, 4)}</strong> bài gần đây
              {' '}trong tổng số <strong className="text-slate-800">{formatNumber(displayedStatistics.totalArticles)}</strong>
            </span>
            <Button type="link" onClick={() => history.push('/article/list')}>Mở danh sách bài viết <span aria-hidden="true">→</span></Button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-3 pb-2 md:grid-cols-3">
          <OperationalCard
            icon={<CloudOutlined />}
            title="Cloudflare CDN & bộ nhớ đệm"
            value="HIT 98.4%"
            description="Phân phối nội dung ảnh và bài viết tĩnh tới độc giả"
            footer="Băng thông hôm nay: 2.4 TB"
          />
          <OperationalCard
            icon={<TeamOutlined />}
            title="Biên tập viên trực tuyến"
            value="14 người"
            description="Trạng thái phòng biên tập hiện tại"
            footer="Thông tin nhân sự minh họa"
          />
          <OperationalCard
            icon={<ThunderboltOutlined />}
            title="Trạng thái hệ thống"
            value="Hoạt động ổn định"
            description="Các dịch vụ dashboard và nội dung"
            footer="Kiểm tra lần cuối: vừa xong"
          />
        </section>
      </main>
    </PageContainer>
  );
};

function MetricCard({
  title,
  value,
  detail,
  detailText,
  icon,
  tone,
  mock = false,
}: {
  title: string;
  value: string;
  detail: string;
  detailText: string;
  icon: React.ReactNode;
  tone: 'blue' | 'green' | 'amber' | 'violet';
  mock?: boolean;
}) {
  const toneClass = {
    blue: 'bg-sky-50 text-sky-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
  }[tone];

  return (
    <article className="flex min-h-36 flex-col justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${toneClass}`}>{icon}</span>
      </div>
      <div className="mt-4">
        <strong className="block text-2xl font-bold leading-none tracking-tight text-slate-900">{value}</strong>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className={`font-semibold ${toneClass.split(' ')[1]}`}>{detail}</span>
          <span className="text-slate-400">{detailText}</span>
          {mock && <span className="text-amber-600">• mẫu</span>}
        </div>
      </div>
    </article>
  );
}

function TrafficLegend({ color, value, label }: { color: string; value: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span>
        <strong className="block font-mono text-xs text-slate-800">{value}</strong>
        <span className="text-[11px] text-slate-500">{label}</span>
      </span>
    </div>
  );
}

function Score({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
        <span className="block h-full rounded-full bg-emerald-500" style={{ width: `${score}%` }} />
      </span>
      <strong className="font-mono text-[11px] text-emerald-700">{score}</strong>
    </span>
  );
}

function OperationalCard({
  icon,
  title,
  value,
  description,
  footer,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  footer: string;
}) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h2 className="m-0 flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className="text-sky-700">{icon}</span>{title}
        </h2>
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
      </div>
      <p className="mb-2 mt-2 text-xs leading-5 text-slate-500">{description}</p>
      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-2">
        <span className="text-[11px] text-slate-400">{footer}</span>
        <strong className="shrink-0 text-xs text-emerald-700">{value}</strong>
      </div>
    </article>
  );
}

function formatCompact(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return formatNumber(value);
}

export default HomePage;
