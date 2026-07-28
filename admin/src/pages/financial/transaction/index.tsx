import { apiFinancialTransactions, apiFinancialUserOptions } from '@/services/financial';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const { RangePicker } = DatePicker;

type FilterState = {
    userId?: string;
    keyWords?: string;
    type?: 'deposit' | 'withdraw';
    fromDate?: string;
    toDate?: string;
};

const TransactionPage: React.FC = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [transactions, setTransactions] = useState<API.FinancialTransaction[]>([]);
    const [userOptions, setUserOptions] = useState<API.FinancialUserOption[]>([]);
    const [filters, setFilters] = useState<FilterState>({});
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const formatMoney = (value?: number) => {
        return Number(value || 0).toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        });
    };

    const loadUsers = async (keyWords?: string) => {
        const response = await apiFinancialUserOptions({ keyWords });
        setUserOptions((response || []) as API.FinancialUserOption[]);
    };

    const loadData = async (current = pagination.current, pageSize = pagination.pageSize, customFilters?: FilterState) => {
        setLoading(true);
        try {
            const nextFilters = customFilters || filters;
            const response = await apiFinancialTransactions({
                current,
                pageSize,
                ...nextFilters,
            });

            setTransactions(response?.data || []);
            setPagination({
                current,
                pageSize,
                total: response?.total || 0,
            });
        } catch {
            message.error('Không thể tải danh sách giao dịch tài chính.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        loadData(1, pagination.pageSize, {});
    }, []);

    const onFilter = async (values: any) => {
        const nextFilters: FilterState = {
            userId: values.userId,
            keyWords: values.keyWords,
            type: values.type,
            fromDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
            toDate: values.dateRange?.[1]?.format('YYYY-MM-DD'),
        };

        setFilters(nextFilters);
        await loadData(1, pagination.pageSize, nextFilters);
    };

    const onReset = async () => {
        form.resetFields();
        setFilters({});
        await loadData(1, pagination.pageSize, {});
    };

    const columns: ColumnsType<API.FinancialTransaction> = useMemo(
        () => [
            {
                title: '#',
                width: 50,
                align: 'center',
                render: (_, __, index) => (pagination.current - 1) * pagination.pageSize + index + 1,
            },
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
                title: 'Số dư trước',
                dataIndex: 'balanceBefore',
                align: 'right',
                width: 170,
                render: (value: number) => formatMoney(value),
            },
            {
                title: 'Số dư sau',
                dataIndex: 'balanceAfter',
                align: 'right',
                width: 170,
                render: (value: number) => formatMoney(value),
            },
            {
                title: 'Người thao tác',
                dataIndex: 'createdByName',
                width: 180,
                render: (value: string) => value || '-',
            },
            {
                title: 'Thời gian',
                dataIndex: 'createdAt',
                width: 180,
                render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
            },
            {
                title: 'Ghi chú',
                dataIndex: 'note',
                width: 240,
                render: (value: string) => value || '-',
            },
        ],
        [pagination.current, pagination.pageSize],
    );

    return (
        <PageContainer title='Financial Transaction'>
            <ProCard className='mb-4'>
                <Form form={form} layout='vertical' onFinish={onFilter}>
                    <Row gutter={16}>
                        <Col xs={24} md={8}>
                            <Form.Item label='Người dùng' name='userId'>
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder='Chọn người dùng'
                                    filterOption={false}
                                    onSearch={(value) => loadUsers(value)}
                                    options={userOptions.map((x) => ({ label: `${x.label}${x.email ? ` (${x.email})` : ''}`, value: x.value }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item label='Loại giao dịch' name='type'>
                                <Select
                                    allowClear
                                    placeholder='Tất cả'
                                    options={[
                                        { label: 'Nạp tiền', value: 'deposit' },
                                        { label: 'Rút tiền', value: 'withdraw' },
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={10}>
                            <Form.Item label='Khoảng thời gian' name='dateRange'>
                                <RangePicker className='w-full' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={14}>
                            <Form.Item label='Từ khóa' name='keyWords'>
                                <Input allowClear placeholder='Tên user, email, mã giao dịch, ghi chú...' />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={10}>
                            <Form.Item label=' '>
                                <Space>
                                    <Button icon={<ReloadOutlined />} onClick={onReset}>
                                        Reset
                                    </Button>
                                    <Button type='primary' htmlType='submit' icon={<SearchOutlined />} loading={loading}>
                                        Tìm kiếm
                                    </Button>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </ProCard>

            <ProCard>
                <Table<API.FinancialTransaction>
                    rowKey='id'
                    loading={loading}
                    columns={columns}
                    dataSource={transactions}
                    size='small'
                    scroll={{ x: 1500 }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        onChange: (current, pageSize) => loadData(current, pageSize),
                    }}
                />
            </ProCard>
        </PageContainer>
    );
};

export default TransactionPage;