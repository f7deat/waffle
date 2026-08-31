import { CatalogType } from '@/constants';
import { apiTopView, dataPieChart } from '@/services/catalog';
import { apiArticleStatistics } from '@/services/catalogs/article';
import { countFile, totalFileSize } from '@/services/file-service';
import { apiTotalOrder } from '@/services/order';
import { apiProductCount } from '@/services/products/product';
import { Column, Pie } from '@ant-design/charts';
import { PageContainer, ProCard, ProList } from '@ant-design/pro-components';
import { ArrowDownOutlined, ArrowUpOutlined, FileOutlined, FileTextOutlined, OrderedListOutlined, ShoppingOutlined, TagsOutlined } from '@ant-design/icons';
import { Col, DatePicker, Row, Segmented, Skeleton, Space, Statistic, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import TopView from './components/top-view';
import { useRequest } from '@umijs/max';
import { apiGetArticleChartData, apiGetMostViewedArticles } from '@/services/article';
import { apiFinancialOverview, apiFinancialTransactions } from '@/services/financial';
import { apiJobApplicationList } from '@/services/careers/application';
import { apiJobOpportunityList } from '@/services/careers/job';
import { apiPlaceList } from '@/services/locations/place';
import { listUser } from '@/services/user';

type PieChartItem = {
  label: string;
  value: number;
};

type ArticleStatistics = {
  totalArticles: number;
  previousMonth: number;
  currentMonth: number;
  viewCount: number;
};

type DashboardSummary = {
  article: ArticleStatistics;
  orderCount: number;
  productCount: number;
  fileCount: number;
  totalFileSize: number;
  userCount: number;
  placeCount: number;
  jobCount: number;
  applicationCount: number;
  pendingApplicationCount: number;
  totalDeposit: number;
  totalWithdraw: number;
  netFlow: number;
};

type FinancialTrendItem = {
  date: string;
  type: string;
  value: number;
};

type ApplicationStatusItem = {
  label: string;
  value: number;
};

type ActivityPreset = '30d' | 'month' | 'quarter' | 'year' | 'custom';

type DateRangeValue = [Dayjs, Dayjs];

const ACTIVITY_CHART_HEIGHT = 360;
const CONTRIBUTION_LIST_HEIGHT = 360;
const PIE_CHART_HEIGHT = 360;

const defaultArticleStats: ArticleStatistics = {
  totalArticles: 0,
  previousMonth: 0,
  currentMonth: 0,
  viewCount: 0,
};

const unwrapPayload = (value: any) => {
  if (!value || typeof value !== 'object') return value;
  if (value.data !== undefined) return value.data;
  if (value.Data !== undefined) return value.Data;
  return value;
};

const toNumber = (value: any) => {
  const unwrapped = unwrapPayload(value);
  if (typeof unwrapped === 'number') return unwrapped;
  const parsed = Number(unwrapped);
  return Number.isFinite(parsed) ? parsed : 0;
};

const parseArticleStatistics = (value: any): ArticleStatistics => {
  const payload = unwrapPayload(value) || {};
  return {
    totalArticles: toNumber(payload.totalArticles ?? payload.TotalArticles),
    previousMonth: toNumber(payload.previousMonth ?? payload.PreviousMonth),
    currentMonth: toNumber(payload.currentMonth ?? payload.CurrentMonth),
    viewCount: toNumber(payload.viewCount ?? payload.ViewCount),
  };
};

const getListItems = (value: any): any[] => {
  const payload = unwrapPayload(value);
  if (Array.isArray(payload)) return payload;
  return Array.isArray(payload?.data) ? payload.data : [];
};

const getTotal = (value: any) => {
  if (typeof value?.total === 'number') return value.total;
  if (typeof value?.Total === 'number') return value.Total;
  const payload = unwrapPayload(value);
  if (typeof payload?.total === 'number') return payload.total;
  if (typeof payload?.Total === 'number') return payload.Total;
  return getListItems(value).length;
};

const formatMoney = (value: number) => Number(value || 0).toLocaleString('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const formatFileSize = (bytes: number) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let value = bytes;
  let index = 0;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index += 1;
  }

  return `${value.toFixed(index > 1 ? 1 : 0)} ${units[index]}`;
};

const calcTrend = (current: number, previous: number) => {
  if (previous <= 0) {
    if (current <= 0) return 0;
    return 100;
  }
  return ((current - previous) / previous) * 100;
};

const getDateRangeByPreset = (preset: ActivityPreset): DateRangeValue => {
  const now = dayjs();

  if (preset === '30d') {
    return [now.subtract(29, 'day').startOf('day'), now.endOf('day')];
  }

  if (preset === 'month') {
    return [now.startOf('month'), now.endOf('day')];
  }

  if (preset === 'quarter') {
    const quarterStartMonth = Math.floor(now.month() / 3) * 3;
    const quarterStart = dayjs(new Date(now.year(), quarterStartMonth, 1));
    return [quarterStart.startOf('day'), now.endOf('day')];
  }

  return [now.startOf('year'), now.endOf('day')];
};

const HomePage: React.FC = () => {
  const [staticLoading, setStaticLoading] = useState<boolean>(false);
  const [dataPie, setDataPie] = useState<PieChartItem[]>([]);
  const { data: articleChartData } = useRequest(apiGetArticleChartData);
  const [activityPreset, setActivityPreset] = useState<ActivityPreset>('month');
  const [dateRange, setDateRange] = useState<DateRangeValue>(getDateRangeByPreset('month'));
  const { data: mostViewedArticles } = useRequest(apiGetMostViewedArticles);
  const [financialTrend, setFinancialTrend] = useState<FinancialTrendItem[]>([]);
  const [applicationStatuses, setApplicationStatuses] = useState<ApplicationStatusItem[]>([]);
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [placeDistribution, setPlaceDistribution] = useState<PieChartItem[]>([]);
  const [summary, setSummary] = useState<DashboardSummary>({
    article: defaultArticleStats,
    orderCount: 0,
    productCount: 0,
    fileCount: 0,
    totalFileSize: 0,
    userCount: 0,
    placeCount: 0,
    jobCount: 0,
    applicationCount: 0,
    pendingApplicationCount: 0,
    totalDeposit: 0,
    totalWithdraw: 0,
    netFlow: 0,
  });

  useEffect(() => {
    const fetchStaticDashboardData = async () => {
      setStaticLoading(true);
      try {
        const [
          pieResponse,
          articleResponse,
          orderCountResponse,
          productCountResponse,
          fileCountResponse,
          totalFileSizeResponse,
          topProductResponse,
          topTagResponse,
          userResponse,
          placeResponse,
          jobResponse,
          applicationResponse,
          financialOverviewResponse,
          transactionResponse,
        ] = await Promise.all([
          dataPieChart(),
          apiArticleStatistics(),
          apiTotalOrder(),
          apiProductCount(),
          countFile(),
          totalFileSize(),
          apiTopView(CatalogType.Product.toString()),
          apiTopView(CatalogType.Tag.toString()),
          listUser({ current: 1, pageSize: 1 }),
          apiPlaceList({ current: 1, pageSize: 200 }),
          apiJobOpportunityList({ current: 1, pageSize: 1 }),
          apiJobApplicationList({ current: 1, pageSize: 200 }),
          apiFinancialOverview(),
          apiFinancialTransactions({ current: 1, pageSize: 200 }),
        ]);

        setDataPie(Array.isArray(pieResponse) ? pieResponse : []);

        setSummary({
          article: parseArticleStatistics(articleResponse),
          orderCount: toNumber(orderCountResponse),
          productCount: toNumber(productCountResponse),
          fileCount: toNumber(fileCountResponse),
          totalFileSize: toNumber(totalFileSizeResponse),
          userCount: getTotal(userResponse),
          placeCount: getTotal(placeResponse),
          jobCount: getTotal(jobResponse),
          applicationCount: getTotal(applicationResponse),
          pendingApplicationCount: getListItems(applicationResponse).filter((item) => Number(item.status) === 0).length,
          totalDeposit: toNumber(unwrapPayload(financialOverviewResponse)?.totalDeposit),
          totalWithdraw: toNumber(unwrapPayload(financialOverviewResponse)?.totalWithdraw),
          netFlow: toNumber(unwrapPayload(financialOverviewResponse)?.netFlow),
        });

        const places = getListItems(placeResponse);
        const applications = getListItems(applicationResponse);
        const transactions = getListItems(transactionResponse);
        const applicationLabels: Record<number, string> = { 0: 'Chờ duyệt', 1: 'Đã duyệt', 2: 'Từ chối' };
        const statuses = applications.reduce((result: Record<number, number>, item) => {
          const status = Number(item.status);
          result[status] = (result[status] || 0) + 1;
          return result;
        }, {});
        const trend = new Map<string, { deposit: number; withdraw: number }>();

        transactions.forEach((item) => {
          const date = dayjs(item.createdAt).format('DD/MM');
          const current = trend.get(date) || { deposit: 0, withdraw: 0 };
          const amount = Number(item.absoluteAmount || Math.abs(item.amount || 0));
          if (item.transactionType === 'deposit') current.deposit += amount;
          else current.withdraw += amount;
          trend.set(date, current);
        });

        setApplicationStatuses(Object.entries(statuses).map(([status, value]) => ({
          label: applicationLabels[Number(status)] || 'Khác',
          value,
        })));
        setRecentApplications(applications.slice(0, 6));
        setPlaceDistribution(Array.from(new Set(places.map((item) => item.provinceName || 'Chưa phân loại'))).map((label) => ({
          label,
          value: places.filter((item) => (item.provinceName || 'Chưa phân loại') === label).length,
        })));
        setFinancialTrend(Array.from(trend.entries()).flatMap(([date, amounts]) => [
          { date, type: 'Nạp tiền', value: amounts.deposit },
          { date, type: 'Rút tiền', value: amounts.withdraw },
        ]));

      } finally {
        setStaticLoading(false);
      }
    };

    fetchStaticDashboardData();
  }, []);

  const articleTrend = calcTrend(summary.article.currentMonth, summary.article.previousMonth);
  const isTrendUp = articleTrend >= 0;

  const handlePresetChange = (value: string | number) => {
    const nextPreset = value as ActivityPreset;
    setActivityPreset(nextPreset);
    if (nextPreset !== 'custom') {
      setDateRange(getDateRangeByPreset(nextPreset));
    }
  };

  const handleDateRangeChange = (value: null | (Dayjs | null)[]) => {
    if (!value || !value[0] || !value[1]) return;
    setActivityPreset('custom');
    setDateRange([value[0], value[1]]);
  };

  return (
    <PageContainer>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-4'>
        <ProCard bordered title="Tổng bài viết" extra={<FileTextOutlined />} loading={staticLoading}>
          <Statistic value={summary.article.totalArticles} suffix="bài" />
          <Typography.Text type="secondary">Lượt xem: {summary.article.viewCount.toLocaleString()}</Typography.Text>
        </ProCard>

        <ProCard bordered title="Lượt xem bài viết" extra={<ArrowUpOutlined />} loading={staticLoading}>
          <Statistic value={summary.article.viewCount} />
          <Space size={8}>
            <Tag color={isTrendUp ? 'success' : 'error'}>
              {isTrendUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {Math.abs(articleTrend).toFixed(1)}%
            </Tag>
            <Typography.Text type="secondary">So với tháng trước</Typography.Text>
          </Space>
        </ProCard>

        <ProCard bordered title="Đơn hàng" extra={<OrderedListOutlined />} loading={staticLoading}>
          <Statistic value={summary.orderCount} suffix="đơn" />
          <Typography.Text type="secondary">Tổng đơn hiện có trong hệ thống</Typography.Text>
        </ProCard>

        <ProCard bordered title="Sản phẩm" extra={<ShoppingOutlined />} loading={staticLoading}>
          <Statistic value={summary.productCount} suffix="sản phẩm" />
          <Typography.Text type="secondary">Tổng sản phẩm đang quản lý</Typography.Text>
        </ProCard>

        <ProCard title="Kho tệp" extra={<FileOutlined />} loading={staticLoading}>
          <Statistic value={summary.fileCount} suffix="tệp" />
          <Typography.Text type="secondary">Dung lượng: {formatFileSize(summary.totalFileSize)}</Typography.Text>
        </ProCard>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-4'>
        <ProCard bordered title="Người dùng" extra={<TagsOutlined />} loading={staticLoading}>
          <Statistic value={summary.userCount} />
          <Typography.Text type="secondary">Tài khoản trong hệ thống</Typography.Text>
        </ProCard>
        <ProCard bordered title="Địa điểm" extra={<TagsOutlined />} loading={staticLoading}>
          <Statistic value={summary.placeCount} suffix="địa điểm" />
          <Typography.Text type="secondary">Đang được quản lý</Typography.Text>
        </ProCard>
        <ProCard bordered title="Công việc tuyển dụng" extra={<FileTextOutlined />} loading={staticLoading}>
          <Statistic value={summary.jobCount} suffix="vị trí" />
          <Typography.Text type="secondary">Cơ hội đang đăng tuyển</Typography.Text>
        </ProCard>
        <ProCard bordered title="Đơn ứng tuyển" extra={<OrderedListOutlined />} loading={staticLoading}>
          <Statistic value={summary.applicationCount} suffix="đơn" />
          <Typography.Text type="secondary">Chờ duyệt: {summary.pendingApplicationCount}</Typography.Text>
        </ProCard>
        <ProCard bordered title="Dòng tiền ròng" extra={<ShoppingOutlined />} loading={staticLoading}>
          <Statistic value={summary.netFlow} formatter={(value) => formatMoney(Number(value))} />
          <Typography.Text type="secondary">Nạp: {formatMoney(summary.totalDeposit)}</Typography.Text>
        </ProCard>
      </div>

      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} xl={16}>
          <ProCard
            title="Hoạt động tạo mới theo tháng"
            headerBordered
            extra={(
              <Space wrap>
                <Segmented
                  size="small"
                  value={activityPreset}
                  options={[
                    { label: '30 ngày', value: '30d' },
                    { label: 'Tháng này', value: 'month' },
                    { label: 'Quý này', value: 'quarter' },
                    { label: 'Năm nay', value: 'year' },
                    { label: 'Tùy chỉnh', value: 'custom' },
                  ]}
                  onChange={handlePresetChange}
                />
                <DatePicker.RangePicker
                  value={dateRange}
                  allowClear={false}
                  format="DD/MM/YYYY"
                  onChange={handleDateRangeChange}
                />
              </Space>
            )}
          >
            <Column
              xField="key"
              yField='count'
              data={articleChartData || []}
              autoFit
              height={ACTIVITY_CHART_HEIGHT}
              label={{
                position: 'middle',
                style: {
                  fill: '#FFFFFF',
                  opacity: 0.8,
                }
              }}
              color="#1677ff"
              sizeField={60}
            />
          </ProCard>
        </Col>
        <Col xs={24} xl={8}>
          <ProCard title="Top đóng góp theo lượt xem" headerBordered>
            <div style={{ minHeight: CONTRIBUTION_LIST_HEIGHT }}>
              {staticLoading ? (
                <Skeleton active paragraph={{ rows: 9 }} />
              ) : (
                <ProList
                  ghost
                  rowKey="id"
                  dataSource={mostViewedArticles || []}
                  locale={{
                    emptyText: 'Không có dữ liệu'
                  }}
                  metas={{
                    avatar: {
                      valueType: 'indexBorder',
                    },
                    title: {
                      dataIndex: 'name',
                    },
                  }}
                />
              )}
            </div>
          </ProCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className='mb-4'>
        <Col xs={24} xl={16}>
          <ProCard
            title="Báo cáo dòng tiền"
            headerBordered
            extra={<Typography.Text type="secondary">Nạp {formatMoney(summary.totalDeposit)} | Rút {formatMoney(summary.totalWithdraw)}</Typography.Text>}
          >
            <div style={{ minHeight: ACTIVITY_CHART_HEIGHT }}>
              {staticLoading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
              ) : (
                <Column
                  data={financialTrend}
                  xField="date"
                  yField="value"
                  colorField="type"
                  group
                  height={ACTIVITY_CHART_HEIGHT}
                  autoFit
                  legend={{ position: 'top' }}
                  tooltip={{ valueFormatter: (value) => formatMoney(Number(value)) }}
                  scale={{ color: { range: ['#16a34a', '#dc2626'] } }}
                />
              )}
            </div>
          </ProCard>
        </Col>
        <Col xs={24} xl={8}>
          <ProCard title="Tình trạng đơn ứng tuyển" headerBordered>
            <div style={{ height: ACTIVITY_CHART_HEIGHT }}>
              {staticLoading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
              ) : (
                <Pie
                  data={applicationStatuses}
                  angleField="value"
                  colorField="label"
                  innerRadius={0.62}
                  radius={0.9}
                  height={ACTIVITY_CHART_HEIGHT}
                  legend={{ position: 'bottom' }}
                  label={{ text: 'value', position: 'outside' }}
                />
              )}
            </div>
          </ProCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={12}>
          <ProCard title="Phân bổ Catalog" headerBordered className='h-full'>
            <div style={{ height: PIE_CHART_HEIGHT }}>
              {staticLoading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
              ) : (
                <Pie
                  angleField='value'
                  colorField='label'
                  radius={0.95}
                  innerRadius={0.6}
                  height={PIE_CHART_HEIGHT}
                  data={dataPie}
                  legend={{
                    position: 'right'
                  }}
                />
              )}
            </div>
          </ProCard>
        </Col>
        <Col xs={24} xl={12}>
          <ProCard title="Phân bổ địa điểm theo tỉnh/thành" headerBordered className='h-full'>
            <div style={{ height: PIE_CHART_HEIGHT }}>
              {staticLoading ? (
                <Skeleton active paragraph={{ rows: 10 }} />
              ) : (
                <Pie
                  angleField="value"
                  colorField="label"
                  radius={0.92}
                  innerRadius={0.55}
                  height={PIE_CHART_HEIGHT}
                  data={placeDistribution}
                  legend={{ position: 'right' }}
                />
              )}
            </div>
          </ProCard>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className='mt-4'>
        <Col xs={24} xl={12}>
          <ProCard title="Đơn ứng tuyển mới nhất" headerBordered>
            <ProList
              ghost
              rowKey="id"
              dataSource={recentApplications}
              locale={{ emptyText: staticLoading ? <Skeleton active paragraph={{ rows: 4 }} /> : 'Chưa có đơn ứng tuyển' }}
              metas={{
                avatar: { valueType: 'indexBorder' },
                title: { dataIndex: 'candidateName' },
                description: {
                  render: (_, item) => (
                    <Typography.Text type="secondary">
                      {item.jobTitle || 'Chưa xác định vị trí'} | {item.email || item.phoneNumber || 'Chưa có thông tin liên hệ'}
                    </Typography.Text>
                  ),
                },
                actions: {
                  render: (_, item) => [
                    <Tag key="status" color={Number(item.status) === 1 ? 'success' : Number(item.status) === 2 ? 'error' : 'warning'}>
                      {Number(item.status) === 1 ? 'Đã duyệt' : Number(item.status) === 2 ? 'Từ chối' : 'Chờ duyệt'}
                    </Tag>,
                  ],
                },
              }}
            />
          </ProCard>
        </Col>
        <Col xs={24} xl={12}>
          <TopView />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
