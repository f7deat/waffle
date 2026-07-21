import {
  apiChangeAvatar,
  apiConfirmEmail,
  apiGetUser,
  apiTopupHistory,
  apiTopupInvoice,
  apiTopupStats,
  apiTopupUser,
} from '@/services/user';
import {
  DollarOutlined,
  EditOutlined,
  FilePdfOutlined,
  LoadingOutlined,
  MessageOutlined,
  UploadOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Link, useParams, useRequest } from '@umijs/max';
import {
  Alert,
  Image,
  Button,
  Col,
  Descriptions,
  Divider,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  message,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useRef, useState } from 'react';
import ProfileRoles from './role';
import ResetPassword from './components/reset-password';

const Profile: React.FC = () => {
  const { id } = useParams();
  const [activeKey, setActiveKey] = useState<string>('activity');
  const [topupModalOpen, setTopupModalOpen] = useState(false);
  const [topupSubmitting, setTopupSubmitting] = useState(false);
  const [topupHistoryLoading, setTopupHistoryLoading] = useState(false);
  const [topupStatsLoading, setTopupStatsLoading] = useState(false);
  const [topupHistory, setTopupHistory] = useState<API.UserTopupTransaction[]>([]);
  const [topupStats, setTopupStats] = useState<API.UserTopupStats>();
  const [historyPagination, setHistoryPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>();
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [topupForm] = Form.useForm<{ amount: number; note?: string }>();

  const { data, refresh } = useRequest(() => apiGetUser(id), {
    refreshDeps: [id],
  });

  const formatMoney = (value?: number) => {
    return Number(value || 0).toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    });
  };

  const normalizePayload = <T,>(response: any): T => {
    return (response?.data ?? response) as T;
  };

  const loadTopupStats = async () => {
    if (!id) {
      return;
    }

    setTopupStatsLoading(true);
    try {
      const response = await apiTopupStats(id);
      setTopupStats(normalizePayload<API.UserTopupStats>(response));
    } catch {
      message.error('Không thể tải thống kê nạp tiền.');
    } finally {
      setTopupStatsLoading(false);
    }
  };

  const loadTopupHistory = async (current = historyPagination.current, pageSize = historyPagination.pageSize) => {
    if (!id) {
      return;
    }

    setTopupHistoryLoading(true);
    try {
      const response = await apiTopupHistory(id, { current, pageSize });
      setTopupHistory(response?.data || []);
      setHistoryPagination({
        current,
        pageSize,
        total: response?.total || 0,
      });
    } catch {
      message.error('Không thể tải lịch sử nạp tiền.');
    } finally {
      setTopupHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    loadTopupStats();
    loadTopupHistory(1, historyPagination.pageSize);
  }, [id]);

  const onConfirmEmail = async () => {
    const response = await apiConfirmEmail(id);
    if (response.succeeded) {
      message.success('Saved!');
    }
  };

  const onAvatarButtonClick = () => {
    if (isAvatarUploading) {
      return;
    }

    fileInputRef.current?.click();
  };

  const closeAvatarModal = () => {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setAvatarModalOpen(false);
    setAvatarPreviewUrl(undefined);
    setSelectedAvatarFile(undefined);
  };

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !id) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file hình ảnh hợp lệ.');
      return;
    }

    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setSelectedAvatarFile(file);
    setAvatarPreviewUrl(URL.createObjectURL(file));
    setAvatarModalOpen(true);
  };

  const onConfirmAvatarUpload = async () => {
    if (!selectedAvatarFile || !id) {
      return;
    }

    const formData = new FormData();
    formData.append('userId', id);
    formData.append('file', selectedAvatarFile);

    setIsAvatarUploading(true);

    try {
      const response = await apiChangeAvatar(formData);
      if (!response?.succeeded) {
        message.error(response?.message || 'Đổi avatar thất bại.');
        return;
      }

      message.success('Đổi avatar thành công.');
      await refresh();
      closeAvatarModal();
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || 'Đổi avatar thất bại.');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const onOpenTopupModal = () => {
    topupForm.resetFields();
    setTopupModalOpen(true);
  };

  const onTopup = async (values: { amount: number; note?: string }) => {
    if (!id) {
      return;
    }

    setTopupSubmitting(true);
    try {
      const response = await apiTopupUser({
        userId: id,
        amount: Number(values.amount),
        note: values.note,
      });

      if (!response?.succeeded) {
        message.error(response?.message || 'Nạp tiền thất bại.');
        return;
      }

      message.success('Nạp tiền thành công.');
      setTopupModalOpen(false);
      topupForm.resetFields();

      await Promise.all([
        refresh(),
        loadTopupStats(),
        loadTopupHistory(1, historyPagination.pageSize),
      ]);
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || 'Nạp tiền thất bại.');
    } finally {
      setTopupSubmitting(false);
    }
  };

  const onExportInvoice = async (transactionId?: string) => {
    if (!transactionId) {
      return;
    }

    try {
      const response = await apiTopupInvoice(transactionId);
      const invoice = normalizePayload<API.UserTopupInvoice>(response);

      const printWindow = window.open('', '_blank', 'width=900,height=700');
      if (!printWindow) {
        message.error('Trình duyệt chặn popup. Vui lòng cho phép popup để xuất hóa đơn.');
        return;
      }

      const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Hoa don nap tien ${invoice.invoiceNumber}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 24px; color: #111827; }
      .header { margin-bottom: 20px; }
      .title { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
      .sub { color: #6b7280; margin-bottom: 4px; }
      .card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin-top: 16px; }
      .row { display: flex; justify-content: space-between; margin: 6px 0; gap: 16px; }
      .label { color: #6b7280; }
      .value { font-weight: 600; }
      .total { margin-top: 12px; padding-top: 12px; border-top: 1px dashed #d1d5db; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="title">Hoa don nap tien</div>
      <div class="sub">So hoa don: ${invoice.invoiceNumber}</div>
      <div class="sub">Thoi gian: ${new Date(invoice.createdAt).toLocaleString('vi-VN')}</div>
    </div>

    <div class="card">
      <div class="row"><span class="label">Nguoi dung</span><span class="value">${invoice.userName || '-'}</span></div>
      <div class="row"><span class="label">Email</span><span class="value">${invoice.userEmail || '-'}</span></div>
      <div class="row"><span class="label">Nguoi thao tac</span><span class="value">${invoice.createdByName || '-'}</span></div>
      <div class="row"><span class="label">So du truoc nap</span><span class="value">${formatMoney(invoice.balanceBefore)}</span></div>
      <div class="row"><span class="label">So tien nap</span><span class="value">${formatMoney(invoice.amount)}</span></div>
      <div class="row total"><span class="label">So du sau nap</span><span class="value">${formatMoney(invoice.balanceAfter)}</span></div>
      <div class="row"><span class="label">Ghi chu</span><span class="value">${invoice.note || '-'}</span></div>
    </div>
    <script>
      window.onload = function () {
        window.print();
      };
    </script>
  </body>
</html>`;

      printWindow.document.open();
      printWindow.document.write(html);
      printWindow.document.close();
    } catch {
      message.error('Không thể xuất hóa đơn.');
    }
  };

  const topupColumns: ColumnsType<API.UserTopupTransaction> = useMemo(
    () => [
      {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (value: string) => new Date(value).toLocaleString('vi-VN'),
      },
      {
        title: 'Số tiền nạp',
        dataIndex: 'amount',
        key: 'amount',
        align: 'right',
        render: (value: number) => <span className='font-semibold text-green-600'>{formatMoney(value)}</span>,
      },
      {
        title: 'Trước nạp',
        dataIndex: 'balanceBefore',
        key: 'balanceBefore',
        align: 'right',
        render: (value: number) => formatMoney(value),
      },
      {
        title: 'Sau nạp',
        dataIndex: 'balanceAfter',
        key: 'balanceAfter',
        align: 'right',
        render: (value: number) => formatMoney(value),
      },
      {
        title: 'Hóa đơn',
        dataIndex: 'invoiceNumber',
        key: 'invoiceNumber',
        render: (value: string) => <Tag color='blue'>{value}</Tag>,
      },
      {
        title: 'Người thao tác',
        dataIndex: 'createdByName',
        key: 'createdByName',
      },
      {
        title: 'Ghi chú',
        dataIndex: 'note',
        key: 'note',
        ellipsis: true,
        render: (value?: string) => value || '-',
      },
      {
        title: 'Tác vụ',
        key: 'action',
        width: 140,
        render: (_, record) => (
          <Button icon={<FilePdfOutlined />} onClick={() => onExportInvoice(record.id)}>
            Xuất hóa đơn
          </Button>
        ),
      },
    ],
    [],
  );

  const topupPanel = (
    <div className='space-y-4'>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <ProCard loading={topupStatsLoading}>
            <Statistic title='Số dư hiện tại' value={topupStats?.currentBalance || 0} formatter={(value) => formatMoney(Number(value || 0))} />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <ProCard loading={topupStatsLoading}>
            <Statistic title='Tổng nạp' value={topupStats?.totalTopup || 0} formatter={(value) => formatMoney(Number(value || 0))} />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <ProCard loading={topupStatsLoading}>
            <Statistic title='Nạp tháng này' value={topupStats?.thisMonthTopup || 0} formatter={(value) => formatMoney(Number(value || 0))} />
          </ProCard>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <ProCard loading={topupStatsLoading}>
            <Statistic title='Số lần nạp' value={topupStats?.topupCount || 0} />
          </ProCard>
        </Col>
      </Row>

      <ProCard
        title='Lịch sử nạp tiền'
        extra={
          <Space>
            <Button onClick={() => loadTopupHistory(historyPagination.current, historyPagination.pageSize)}>
              Làm mới
            </Button>
            <Button type='primary' icon={<DollarOutlined />} onClick={onOpenTopupModal}>
              Nạp tiền
            </Button>
          </Space>
        }
      >
        <Table<API.UserTopupTransaction>
          rowKey='id'
          columns={topupColumns}
          dataSource={topupHistory}
          loading={topupHistoryLoading}
          pagination={{
            current: historyPagination.current,
            pageSize: historyPagination.pageSize,
            total: historyPagination.total,
            showSizeChanger: true,
            onChange: (current, pageSize) => {
              loadTopupHistory(current, pageSize);
            },
          }}
          scroll={{ x: 1100 }}
        />
      </ProCard>
    </div>
  );

  return (
    <PageContainer onBack={() => history.back()}>
      <Row gutter={16}>
        <Col span={6}>
          <ProCard
            title="Profile"
            headerBordered
            actions={[
              <Button key='topup' type='primary' icon={<DollarOutlined />} onClick={onOpenTopupModal}>
                Nạp tiền
              </Button>,
              <Link to={`/user/center/${id}`}>
                <EditOutlined /> Chỉnh sửa
              </Link>
            ]}
          >
            <div className="flex items-center justify-center flex-col">
              <div className='mb-4 relative'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={onAvatarChange}
                />
                <Button
                  icon={isAvatarUploading ? <LoadingOutlined /> : <UploadOutlined />}
                  size='small'
                  type='text'
                  className='absolute right-0 z-10'
                  loading={isAvatarUploading}
                  onClick={onAvatarButtonClick}
                />
                <Image src={data?.avatar} width={200} height={200} alt='Avatar' className='rounded-full' />
              </div>
              <div className='mb-4 text-center'>
                <div className='text-lg font-semibold'>{data?.name}</div>
                <div className='text-sm text-gray-500'>{data?.userName}</div>
              </div>
              <div className='flex gap-2 justify-center'>
                <Button type='primary' icon={<UserAddOutlined />}>Follow</Button>
                <Button icon={<MessageOutlined />}>Message</Button>
              </div>
            </div>
            <Divider />
            <Descriptions title="Info" column={1}>
              <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">
                {data?.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label='Số dư'>
                <span className='font-semibold text-green-600'>{formatMoney(data?.amount)}</span>
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            {
              data && <ProfileRoles roles={data?.roles} />
            }
          </ProCard>
        </Col>
        <Col span={18}>
          {!data?.emailConfirmed && (
            <Alert message={(
              <div>Bạn chưa xác thực email, vui lòng kiểm tra email để xác thực tài khoản của bạn. <span className='font-semibold cursor-pointer' onClick={onConfirmEmail}>Gửi lại email xác thực?</span></div>
            )} type="warning" showIcon className='mb-4' />
          )}
          <ProCard tabs={{
            tabPosition: 'top',
            activeKey: activeKey,
            items: [
              {
                label: 'Tổng quan',
                key: 'activity',
                children: <Empty />,
              },
              {
                label: 'Tài chính',
                key: 'finance',
                children: topupPanel,
              },
              {
                label: 'Reset Password',
                key: 'reset-password',
                children: <ResetPassword />,
              }
            ],
            onChange: (key) => {
              setActiveKey(key);
            },
          }}>
            <Empty />
          </ProCard>
        </Col>
      </Row>
      <Modal
        title='Xác nhận avatar mới'
        open={avatarModalOpen}
        okText='Cập nhật avatar'
        cancelText='Hủy'
        confirmLoading={isAvatarUploading}
        onCancel={closeAvatarModal}
        onOk={onConfirmAvatarUpload}
      >
        <div className='flex flex-col items-center gap-4'>
          <Image
            preview={false}
            src={avatarPreviewUrl}
            width={220}
            height={220}
            alt='Avatar preview'
            className='rounded-full object-cover'
          />
          <div className='text-center text-sm text-gray-500'>
            {selectedAvatarFile?.name}
          </div>
        </div>
      </Modal>

      <Modal
        title='Nạp tiền tài khoản'
        open={topupModalOpen}
        okText='Xác nhận nạp'
        cancelText='Hủy'
        confirmLoading={topupSubmitting}
        onCancel={() => setTopupModalOpen(false)}
        onOk={() => topupForm.submit()}
      >
        <Form form={topupForm} layout='vertical' onFinish={onTopup}>
          <Form.Item
            name='amount'
            label='Số tiền nạp (VND)'
            rules={[
              { required: true, message: 'Vui lòng nhập số tiền nạp.' },
              {
                validator: (_, value) => {
                  if (Number(value) > 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Số tiền nạp phải lớn hơn 0.'));
                },
              },
            ]}
          >
            <InputNumber<number>
              className='w-full'
              min={1}
              step={1000}
              controls={false}
              placeholder='Ví dụ: 100000'
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => Number(value?.replace(/,/g, '') || 0)}
            />
          </Form.Item>
          <Form.Item name='note' label='Ghi chú'>
            <Input.TextArea rows={3} placeholder='Nội dung nạp tiền' maxLength={500} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Profile;
