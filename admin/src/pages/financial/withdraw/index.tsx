import {
    apiFinancialUserOptions,
    apiFinancialWithdraw,
    apiFinancialWithdrawalRequests,
    apiFinancialWithdraws,
    apiReviewFinancialWithdrawal,
} from '@/services/financial';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Button, Col, Form, Input, InputNumber, message, Modal, Row, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const WithdrawPage: React.FC = () => {
    const [form] = Form.useForm<{ userId: string; amount: number; note?: string }>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [history, setHistory] = useState<API.FinancialTransaction[]>([]);
    const [withdrawalRequests, setWithdrawalRequests] = useState<API.WalletWithdrawalRequest[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [requestPagination, setRequestPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [userOptions, setUserOptions] = useState<API.FinancialUserOption[]>([]);

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

    const loadHistory = async (current = pagination.current, pageSize = pagination.pageSize) => {
        setLoading(true);
        try {
            const response = await apiFinancialWithdraws({ current, pageSize });
            setHistory(response?.data || []);
            setPagination({
                current,
                pageSize,
                total: response?.total || 0,
            });
        } catch {
            message.error('Không thể tải danh sách rút tiền.');
        } finally {
            setLoading(false);
        }
    };

    const loadWithdrawalRequests = async (
        current = requestPagination.current,
        pageSize = requestPagination.pageSize,
    ) => {
        setLoading(true);
        try {
            const response = await apiFinancialWithdrawalRequests({ current, pageSize });
            setWithdrawalRequests(response?.data || []);
            setRequestPagination({ current, pageSize, total: response?.total || 0 });
        } catch {
            message.error('Không thể tải các yêu cầu rút tiền.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
        loadHistory(1, pagination.pageSize);
        loadWithdrawalRequests(1, requestPagination.pageSize);
    }, []);

    const onFinish = async (values: { userId: string; amount: number; note?: string }) => {
        setSubmitting(true);
        try {
            const response = await apiFinancialWithdraw({
                userId: values.userId,
                amount: Number(values.amount),
                note: values.note,
            });

            if (!response?.succeeded) {
                message.error(response?.message || 'Rút tiền thất bại.');
                return;
            }

            message.success('Rút tiền thành công.');
            form.resetFields();
            await loadHistory(1, pagination.pageSize);
        } catch {
            message.error('Rút tiền thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

    const reviewRequest = (record: API.WalletWithdrawalRequest, action: 'approve' | 'paid' | 'reject') => {
        const actionLabels = {
            approve: 'Duyệt yêu cầu',
            paid: 'Xác nhận đã chuyển khoản',
            reject: 'Từ chối yêu cầu',
        };
        Modal.confirm({
            title: actionLabels[action],
            content: `${record.invoiceNumber} · ${record.accountHolder} · ${formatMoney(record.amount)}. ${
                action === 'paid'
                    ? 'Chỉ xác nhận sau khi đã chuyển khoản thành công.'
                    : action === 'reject'
                        ? 'Số tiền đã giữ chỗ sẽ được hoàn lại vào ví.'
                        : 'Yêu cầu sẽ chuyển sang trạng thái đã duyệt, chưa xác nhận chuyển khoản.'
            }`,
            okText: actionLabels[action],
            cancelText: 'Hủy',
            okButtonProps: action === 'reject' ? { danger: true } : undefined,
            onOk: async () => {
                try {
                    const response = await apiReviewFinancialWithdrawal(record.id, action);
                    if (!response?.succeeded) {
                        message.error(response?.message || 'Không thể cập nhật yêu cầu.');
                        return;
                    }
                    message.success('Đã cập nhật yêu cầu rút tiền.');
                    await loadWithdrawalRequests(requestPagination.current, requestPagination.pageSize);
                    await loadHistory(1, pagination.pageSize);
                } catch {
                    message.error('Không thể cập nhật yêu cầu rút tiền.');
                }
            },
        });
    };

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
                title: 'Số tiền rút',
                dataIndex: 'amount',
                align: 'right',
                width: 170,
                render: (value: number) => <span className='text-red-600 font-semibold'>{formatMoney(value)}</span>,
            },
            {
                title: 'Số dư sau giao dịch',
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
        [],
    );

    const requestColumns: ColumnsType<API.WalletWithdrawalRequest> = [
        {
            title: 'Mã yêu cầu',
            dataIndex: 'invoiceNumber',
            width: 190,
        },
        {
            title: 'Người dùng',
            render: (_, record) => (
                <div>
                    <div className='font-semibold'>{record.userName || '-'}</div>
                    <div className='text-xs text-gray-500'>{record.userEmail || '-'}</div>
                </div>
            ),
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            align: 'right',
            width: 150,
            render: (value: number) => <span className='font-semibold'>{formatMoney(value)}</span>,
        },
        {
            title: 'Tài khoản nhận',
            width: 260,
            render: (_, record) => (
                <div>
                    <div className='font-medium'>{record.bankName} · {record.accountNumber}</div>
                    <div className='text-xs text-gray-500'>{record.accountHolder}</div>
                </div>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            width: 140,
            render: (status: API.WalletWithdrawalRequest['status']) => {
                const color = status === 'Paid' ? 'green' : status === 'Rejected' ? 'red' : status === 'Approved' ? 'blue' : 'gold';
                const label = status === 'Paid' ? 'Đã chuyển' : status === 'Rejected' ? 'Đã từ chối' : status === 'Approved' ? 'Đã duyệt' : 'Chờ duyệt';
                return <Tag color={color}>{label}</Tag>;
            },
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
            width: 160,
            render: (value: string) => dayjs(value).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 240,
            render: (_, record) => (
                <Space wrap>
                    {record.status === 'Pending' && (
                        <>
                            <Button size='small' type='primary' onClick={() => reviewRequest(record, 'approve')}>Duyệt</Button>
                            <Button size='small' danger onClick={() => reviewRequest(record, 'reject')}>Từ chối</Button>
                        </>
                    )}
                    {record.status === 'Approved' && (
                        <>
                            <Button size='small' type='primary' onClick={() => reviewRequest(record, 'paid')}>Đã chuyển khoản</Button>
                            <Button size='small' danger onClick={() => reviewRequest(record, 'reject')}>Từ chối</Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <PageContainer title='Financial Withdraw'>
            <ProCard title='Tạo giao dịch rút tiền' className='mb-4'>
                <Alert
                    className='mb-4'
                    showIcon
                    type='warning'
                    message='Hệ thống sẽ tự kiểm tra số dư. Nếu số dư không đủ, giao dịch sẽ bị từ chối.'
                />
                <Form form={form} layout='vertical' onFinish={onFinish}>
                    <Row gutter={16}>
                        <Col xs={24} md={10}>
                            <Form.Item
                                label='Người dùng'
                                name='userId'
                                rules={[{ required: true, message: 'Vui lòng chọn người dùng.' }]}
                            >
                                <Select
                                    allowClear
                                    showSearch
                                    placeholder='Tìm kiếm người dùng'
                                    filterOption={false}
                                    onSearch={(value) => loadUsers(value)}
                                    options={userOptions.map((x) => ({ label: `${x.label}${x.email ? ` (${x.email})` : ''}`, value: x.value }))}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={6}>
                            <Form.Item
                                label='Số tiền'
                                name='amount'
                                rules={[{ required: true, message: 'Vui lòng nhập số tiền.' }]}
                            >
                                <InputNumber min={1000} className='w-full' formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={8}>
                            <Form.Item label='Ghi chú' name='note'>
                                <Input allowClear placeholder='Ví dụ: hoàn tiền chiến dịch tháng 7' />
                            </Form.Item>
                        </Col>
                        <Col xs={24}>
                            <Button htmlType='submit' type='primary' danger loading={submitting}>
                                Rút tiền
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </ProCard>

            <ProCard title='Yêu cầu rút tiền từ người dùng' className='mb-4'>
                <Alert
                    className='mb-4'
                    showIcon
                    type='info'
                    message='Số dư được giữ chỗ khi người dùng gửi yêu cầu. Chỉ chọn “Đã chuyển khoản” sau khi giao dịch ngân hàng thành công; từ chối sẽ hoàn lại số dư.'
                />
                <Table<API.WalletWithdrawalRequest>
                    rowKey='id'
                    loading={loading}
                    columns={requestColumns}
                    dataSource={withdrawalRequests}
                    size='small'
                    scroll={{ x: 1300 }}
                    pagination={{
                        current: requestPagination.current,
                        pageSize: requestPagination.pageSize,
                        total: requestPagination.total,
                        showSizeChanger: true,
                        onChange: (current, pageSize) => loadWithdrawalRequests(current, pageSize),
                    }}
                />
            </ProCard>

            <ProCard title='Lịch sử rút tiền'>
                <Table<API.FinancialTransaction>
                    rowKey='id'
                    loading={loading}
                    columns={columns}
                    dataSource={history}
                    size='small'
                    scroll={{ x: 1300 }}
                    pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: pagination.total,
                        showSizeChanger: true,
                        onChange: (current, pageSize) => loadHistory(current, pageSize),
                    }}
                />
            </ProCard>
        </PageContainer>
    );
};

export default WithdrawPage;