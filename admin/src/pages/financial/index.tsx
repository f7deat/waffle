import { apiFinancialOverview, apiFinancialTransactions } from '@/services/financial';
import { Column, Pie } from '@ant-design/charts';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Col, DatePicker, message, Row, Space, Statistic, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { type Dayjs } from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const { RangePicker } = DatePicker;

const FinancialOverviewPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [overview, setOverview] = useState<API.FinancialOverview>();
    const [transactions, setTransactions] = useState<API.FinancialTransaction[]>([]);
    const [range, setRange] = useState<[Dayjs, Dayjs] | undefined>();

    const formatMoney = (value?: number) => {
        return Number(value || 0).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        });
    };

    const getDateParams = () => {
        if (!range?.[0] || !range?.[1]) {
            return undefined;
        }

        return {
            fromDate: range[0].format('YYYY-MM-DD'),
            toDate: range[1].format('YYYY-MM-DD'),
        };
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const params = getDateParams();
            const [overviewResponse, transactionResponse] = await Promise.all([
                apiFinancialOverview(params),
                apiFinancialTransactions({ ...params, current: 1, pageSize: 200 }),
            ]);

            setOverview((overviewResponse?.data ?? overviewResponse) as API.FinancialOverview);
            setTransactions(transactionResponse?.data || []);
        } catch {
            message.error('Không thể tải dữ liệu tổng quan tài chính.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const trendData = useMemo(() => {
        const grouped = new Map<string, { date: string; deposit: number; withdraw: number }>();

        for (const item of transactions) {
            const date = dayjs(item.createdAt).format('DD/MM');
            const current = grouped.get(date) || { date, deposit: 0, withdraw: 0 };
            if (item.transactionType === 'deposit') {
                current.deposit += Number(item.absoluteAmount || Math.abs(item.amount || 0));
            } else {
                current.withdraw += Number(item.absoluteAmount || Math.abs(item.amount || 0));
            }
            grouped.set(date, current);
        }

        return Array.from(grouped.values())
            .sort((a, b) => dayjs(a.date, 'DD/MM').valueOf() - dayjs(b.date, 'DD/MM').valueOf())
            .flatMap((x) => [
                { date: x.date, type: 'Nạp tiền', value: x.deposit },
                { date: x.date, type: 'Rút tiền', value: x.withdraw },
            ]);
    }, [transactions]);

    const flowData = useMemo(() => {
        return [
            { type: 'Nạp tiền', value: Number(overview?.totalDeposit || 0) },
            { type: 'Rút tiền', value: Number(overview?.totalWithdraw || 0) },
        ].filter((x) => x.value > 0);
    }, [overview]);

    const recentTransactions = useMemo(() => transactions.slice(0, 8), [transactions]);

    const columns: ColumnsType<API.FinancialTransaction> = useMemo(
        () => [
            {
                title: 'Mã giao dịch',
                dataIndex: 'invoiceNumber',
                width: 220,
            },
            {
                title: 'Người dùng',
                dataIndex: 'userName',
                render: (_, record) => (
                    <div>
                        <div className='font-semibold'>{record.userName || '-'}</div>
                        <div className='text-xs text-gray-500'>{record.userEmail || '-'}</div>
                    </div>
                ),
            },
            {
                title: 'Loại',
                dataIndex: 'transactionType',
                width: 120,
                render: (value: API.FinancialTransaction['transactionType']) => (
                    <Tag color={value === 'deposit' ? 'green' : 'red'}>{value === 'deposit' ? 'Nạp tiền' : 'Rút tiền'}</Tag>
                ),
            },
            {
                title: 'Số tiền',
                dataIndex: 'amount',
                align: 'right',
                width: 170,
                render: (value: number) => (
                    <span className={value >= 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{formatMoney(value)}</span>
                ),
            },
            {
                title: 'Thời gian',
                dataIndex: 'createdAt',
                width: 180,
                render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
            },
        ],
        [],
    );

    return (
        <PageContainer
            title='Financial Overview'
            extra={
                <Space>
                    <RangePicker value={range} onChange={(value) => setRange(value as [Dayjs, Dayjs] | undefined)} allowClear />
                    <Button type='primary' loading={loading} onClick={loadData}>
                        Lọc dữ liệu
                    </Button>
                </Space>
            }
        >
            <Row gutter={[16, 16]}>
                <Col xs={24} md={12} lg={6}>
                    <ProCard loading={loading}>
                        <Statistic title='Tổng nạp tiền' value={overview?.totalDeposit || 0} formatter={(value) => formatMoney(Number(value || 0))} />
                    </ProCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ProCard loading={loading}>
                        <Statistic title='Tổng rút tiền' value={overview?.totalWithdraw || 0} formatter={(value) => formatMoney(Number(value || 0))} />
                    </ProCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ProCard loading={loading}>
                        <Statistic title='Dòng tiền ròng' value={overview?.netFlow || 0} formatter={(value) => formatMoney(Number(value || 0))} />
                    </ProCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ProCard loading={loading}>
                        <Statistic title='Tổng số dư người dùng' value={overview?.currentBalanceTotal || 0} formatter={(value) => formatMoney(Number(value || 0))} />
                    </ProCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ProCard loading={loading}>
                        <Statistic title='Số giao dịch' value={overview?.transactionCount || 0} />
                    </ProCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ProCard loading={loading}>
                        <Statistic title='Số lần nạp' value={overview?.depositCount || 0} />
                    </ProCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ProCard loading={loading}>
                        <Statistic title='Số lần rút' value={overview?.withdrawCount || 0} />
                    </ProCard>
                </Col>
                <Col xs={24} md={12} lg={6}>
                    <ProCard loading={loading}>
                        <Statistic title='Người dùng hoạt động' value={overview?.activeUserCount || 0} />
                    </ProCard>
                </Col>
            </Row>

            <Row gutter={[16, 16]} className='mt-4'>
                <Col xs={24} xl={16}>
                    <ProCard title='Xu hướng nạp/rút theo ngày' loading={loading}>
                        <Column
                            data={trendData}
                            xField='date'
                            yField='value'
                            seriesField='type'
                            isGroup
                            legend={{ position: 'top' }}
                            height={320}
                            color={['#22c55e', '#ef4444']}
                            xAxis={{
                                label: {
                                    autoRotate: false,
                                },
                            }}
                            yAxis={{
                                label: {
                                    formatter: (value: string) => {
                                        const raw = Number(value || 0);
                                        if (raw >= 1000000000) return `${(raw / 1000000000).toFixed(1)}B`;
                                        if (raw >= 1000000) return `${(raw / 1000000).toFixed(1)}M`;
                                        return `${Math.round(raw / 1000)}K`;
                                    },
                                },
                            }}
                            tooltip={{
                                formatter: (datum: { type: string; value: number }) => ({
                                    name: datum.type,
                                    value: formatMoney(datum.value),
                                }),
                            }}
                        />
                    </ProCard>
                </Col>
                <Col xs={24} xl={8}>
                    <ProCard title='Tỷ trọng dòng tiền' loading={loading}>
                        <Pie
                            data={flowData}
                            angleField='value'
                            colorField='type'
                            radius={0.9}
                            innerRadius={0.58}
                            height={320}
                            color={['#22c55e', '#ef4444']}
                            label={{
                                type: 'outer',
                                content: '{name}: {percentage}',
                            }}
                            tooltip={{
                                formatter: (datum: { type: string; value: number }) => ({
                                    name: datum.type,
                                    value: formatMoney(datum.value),
                                }),
                            }}
                            interactions={[{ type: 'element-active' }]}
                        />
                    </ProCard>
                </Col>
            </Row>

            <ProCard title='Giao dịch gần đây' className='mt-4'>
                <Table<API.FinancialTransaction>
                    rowKey='id'
                    loading={loading}
                    columns={columns}
                    dataSource={recentTransactions}
                    size='small'
                    pagination={false}
                />
            </ProCard>
        </PageContainer>
    );
};

export default FinancialOverviewPage;