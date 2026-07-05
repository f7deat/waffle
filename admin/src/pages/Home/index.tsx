import { CatalogType } from '@/constants';
import { apiTopView, dataPieChart } from '@/services/catalog';
import { apiArticleStatistics } from '@/services/catalogs/article';
import { countFile, totalFileSize } from '@/services/file-service';
import { apiTotalOrder } from '@/services/order';
import { apiProductCount } from '@/services/products/product';
import { apiGetReportActivity } from '@/services/report';
import { Column, Pie } from '@ant-design/charts';
import { PageContainer, ProCard, ProList } from '@ant-design/pro-components';
import { ArrowDownOutlined, ArrowUpOutlined, FileOutlined, FileTextOutlined, OrderedListOutlined, ShoppingOutlined, TagsOutlined } from '@ant-design/icons';
import { Col, DatePicker, Row, Segmented, Skeleton, Space, Statistic, Tag, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import TopView from './components/top-view';

type PieChartItem = {
  label: string;
  value: number;
};

type ActivityItem = {
  month: string;
  value: number;
};

type ContributionItem = {
  id: string;
  name: string;
  count: number;
  type: string;
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
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [dataPie, setDataPie] = useState<PieChartItem[]>([]);
  const [dataActivities, setDataActivities] = useState<ActivityItem[]>([]);
  const [activityPreset, setActivityPreset] = useState<ActivityPreset>('month');
  const [dateRange, setDateRange] = useState<DateRangeValue>(getDateRangeByPreset('month'));
  const [summary, setSummary] = useState<DashboardSummary>({
    article: defaultArticleStats,
    orderCount: 0,
    productCount: 0,
    fileCount: 0,
    totalFileSize: 0,
  });
  const [contributionData, setContributionData] = useState<ContributionItem[]>([]);

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
        ] = await Promise.all([
          dataPieChart(),
          apiArticleStatistics(),
          apiTotalOrder(),
          apiProductCount(),
          countFile(),
          totalFileSize(),
          apiTopView(CatalogType.Product.toString()),
          apiTopView(CatalogType.Tag.toString()),
        ]);

        setDataPie(Array.isArray(pieResponse) ? pieResponse : []);

        setSummary({
          article: parseArticleStatistics(articleResponse),
          orderCount: toNumber(orderCountResponse),
          productCount: toNumber(productCountResponse),
          fileCount: toNumber(fileCountResponse),
          totalFileSize: toNumber(totalFileSizeResponse),
        });

        const topProduct = Array.isArray(topProductResponse) ? topProductResponse : [];
        const topTag = Array.isArray(topTagResponse) ? topTagResponse : [];

        const topContributors = [...topProduct, ...topTag]
          .map((item: API.Catalog) => ({
            id: item.id || item.normalizedName,
            name: item.name,
            count: Number(item.viewCount || 0),
            type: item.type?.toString() || 'Catalog',
          }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 8);

        setContributionData(topContributors);
      } finally {
        setStaticLoading(false);
      }
    };

    fetchStaticDashboardData();
  }, []);

  useEffect(() => {
    const fetchActivityData = async () => {
      setActivityLoading(true);
      try {
        const [fromDate, toDate] = dateRange;
        const activityResponse = await apiGetReportActivity({
          fromDate: fromDate.format('YYYY-MM-DD'),
          toDate: toDate.format('YYYY-MM-DD'),
        });

        setDataActivities(Array.isArray(activityResponse) ? activityResponse : []);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchActivityData();
  }, [dateRange]);

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
            <Typography.Text type="secondary">Tháng này: {summary.article.currentMonth.toLocaleString()}</Typography.Text>
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
              <div style={{ height: ACTIVITY_CHART_HEIGHT }}>
                {activityLoading ? (
                  <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                  <Column
                    xField="month"
                    yField='value'
                    data={dataActivities}
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
                  />
                )}
              </div>
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
                    dataSource={contributionData}
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
                      description: {
                        render: (_, row) => <Tag>{row.type}</Tag>
                      },
                      actions: {
                        render: (_, row) => [<Typography.Text key="view" strong>{row.count.toLocaleString()}</Typography.Text>],
                      }
                    }}
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
            <div className='h-full'>
              <TopView />
            </div>
          </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
