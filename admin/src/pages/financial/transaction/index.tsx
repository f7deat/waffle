import { apiFinancialTransactions, apiFinancialUserOptions } from '@/services/financial';
import { FilePdfOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Col, DatePicker, Form, Input, message, Row, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const { RangePicker } = DatePicker;

const formatMoney = (value?: number) =>
        Number(value || 0).toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
                maximumFractionDigits: 0,
        });

const escapeHtml = (value: string) =>
        value.replace(/[&<>"']/g, (character) => {
                const entities: Record<string, string> = {
                        '&': '&amp;',
                        '<': '&lt;',
                        '>': '&gt;',
                        '"': '&quot;',
                        "'": '&#39;',
                };
                return entities[character];
        });

const printInvoice = (transaction: API.FinancialTransaction) => {
        const printWindow = window.open('', '_blank', 'width=900,height=700');
        if (!printWindow) {
                message.error('Trình duyệt chặn popup. Vui lòng cho phép popup để xuất hóa đơn.');
                return;
        }

        const invoiceNumber = escapeHtml(transaction.invoiceNumber || '-');
        const transactionType = transaction.transactionType === 'deposit' ? 'Nạp tiền' : 'Rút tiền';
        const html = `
<!doctype html>
<html lang="vi">
    <head>
        <meta charset="utf-8" />
        <title>Hóa đơn ${invoiceNumber}</title>
        <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #111827; }
            .header { margin-bottom: 24px; }
            .title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
            .sub { color: #6b7280; margin-bottom: 4px; }
            .card { border: 1px solid #d1d5db; padding: 20px; }
            .row { display: flex; justify-content: space-between; margin: 10px 0; gap: 16px; }
            .label { color: #6b7280; }
            .value { font-weight: 600; text-align: right; }
            .total { margin-top: 16px; padding-top: 16px; border-top: 1px dashed #9ca3af; }
            @media print { body { padding: 0; } }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="title">Hóa đơn giao dịch tài chính</div>
            <div class="sub">Số hóa đơn: ${invoiceNumber}</div>
            <div class="sub">Thời gian: ${escapeHtml(dayjs(transaction.createdAt).format('DD/MM/YYYY HH:mm'))}</div>
        </div>
        <div class="card">
            <div class="row"><span class="label">Người dùng</span><span class="value">${escapeHtml(transaction.userName || '-')}</span></div>
            <div class="row"><span class="label">Email</span><span class="value">${escapeHtml(transaction.userEmail || '-')}</span></div>
            <div class="row"><span class="label">Loại giao dịch</span><span class="value">${transactionType}</span></div>
            <div class="row"><span class="label">Người thao tác</span><span class="value">${escapeHtml(transaction.createdByName || '-')}</span></div>
            <div class="row"><span class="label">Số dư trước giao dịch</span><span class="value">${escapeHtml(formatMoney(transaction.balanceBefore))}</span></div>
            <div class="row total"><span class="label">Số tiền giao dịch</span><span class="value">${escapeHtml(formatMoney(transaction.absoluteAmount))}</span></div>
            <div class="row"><span class="label">Số dư sau giao dịch</span><span class="value">${escapeHtml(formatMoney(transaction.balanceAfter))}</span></div>
            <div class="row"><span class="label">Ghi chú</span><span class="value">${escapeHtml(transaction.note || '-')}</span></div>
        </div>
        <script>window.onload = function () { window.print(); };</script>
    </body>
</html>`;

        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
};

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
            {
                title: 'Hóa đơn',
                key: 'invoice',
                width: 120,
                fixed: 'right',
                render: (_, record) => (
                    <Button size='small' icon={<FilePdfOutlined />} onClick={() => printInvoice(record)}>
                        Xuất
                    </Button>
                ),
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