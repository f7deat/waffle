import { apiFinancialUserOptions, apiFinancialWithdraw, apiFinancialWithdraws } from '@/services/financial';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Alert, Button, Col, Form, Input, InputNumber, message, Row, Select, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useMemo, useState } from 'react';

const WithdrawPage: React.FC = () => {
    const [form] = Form.useForm<{ userId: string; amount: number; note?: string }>();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [history, setHistory] = useState<API.FinancialTransaction[]>([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
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

    useEffect(() => {
        loadUsers();
        loadHistory(1, pagination.pageSize);
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