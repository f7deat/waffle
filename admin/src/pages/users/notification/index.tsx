import {
  CheckCircleOutlined,
  CheckOutlined,
  InfoCircleOutlined,
  MailOutlined,
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import {
  ModalForm,
  PageContainer,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {
  createNotification,
  markAllNotificationAsRead,
  markNotificationAsRead,
  queryNotificationList,
} from '@/services/notification';
import { NOTIFICATION_UPDATED_EVENT } from '@/constants';
import { Badge, Button, Card, Empty, Input, List, Space, Tag, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { apiUserOptions } from '@/services/user';
import { history } from '@umijs/max';

type NotificationListResponse = {
  data?: API.NotificationListItem[];
  total?: number;
};

const NotificationPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [openCreateForm, setOpenCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<API.NotificationListItem[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const unreadCount = useMemo(
    () => notifications.filter((x) => !x.isRead).length,
    [notifications],
  );

  const loadNotifications = async (params?: {
    current?: number;
    pageSize?: number;
    searchTerm?: string;
  }) => {
    setLoading(true);
    try {
      const current = params?.current ?? pagination.current;
      const pageSize = params?.pageSize ?? pagination.pageSize;
      const keyword = params?.searchTerm ?? searchTerm;

      const response = (await queryNotificationList({
        current,
        pageSize,
        searchTerm: keyword || undefined,
      })) as NotificationListResponse;

      setNotifications(response?.data ?? []);
      setPagination({
        current,
        pageSize,
        total: response?.total ?? 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications({ current: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMarkAsRead = async (id?: string) => {
    if (!id) return;
    const response = await markNotificationAsRead(id);
    if (response?.succeeded) {
      message.success('Đã đánh dấu đã đọc');
      await loadNotifications();
      window.dispatchEvent(new Event(NOTIFICATION_UPDATED_EVENT));
    }
  };

  const onMarkAllAsRead = async () => {
    const response = await markAllNotificationAsRead();
    if (response?.succeeded) {
      message.success('Đã đánh dấu tất cả là đã đọc');
      await loadNotifications({ current: 1 });
      window.dispatchEvent(new Event(NOTIFICATION_UPDATED_EVENT));
    }
  };

  const onCreateNotification = async (values: {
    title: string;
    content?: string;
    actionUrl?: string;
    type: number;
    recipientType: 'all' | 'role' | 'users';
    roleName?: string;
    userIds?: string[];
  }) => {
    const payload = {
      title: values.title,
      content: values.content,
      actionUrl: values.actionUrl,
      type: values.type,
      allUsers: values.recipientType === 'all',
      roleName: values.recipientType === 'role' ? values.roleName : undefined,
      userIds: values.recipientType === 'users' ? values.userIds : undefined,
    };

    const response = await createNotification(payload);
    if (response?.succeeded) {
      message.success('Tạo thông báo thành công');
      setOpenCreateForm(false);
      await loadNotifications({ current: 1 });
      window.dispatchEvent(new Event(NOTIFICATION_UPDATED_EVENT));
      return true;
    }

    return false;
  };

  const getActionUrl = (item: API.NotificationListItem) => {
    if (item.actionUrl) return item.actionUrl;
    if (item.type === 1) return '/users/member';
    return '/home';
  };

  const onOpenNotification = async (item: API.NotificationListItem) => {
    if (!item.isRead && item.id) {
      const response = await markNotificationAsRead(item.id);
      if (response?.succeeded) {
        await loadNotifications();
        window.dispatchEvent(new Event(NOTIFICATION_UPDATED_EVENT));
      }
    }

    history.push(getActionUrl(item));
  };

  return (
    <PageContainer
      title="Thông báo"
      extra={[
        <Button key="create" type="primary" icon={<PlusOutlined />} onClick={() => setOpenCreateForm(true)}>
          Tạo thông báo
        </Button>,
        <Button key="reload" icon={<ReloadOutlined />} onClick={() => loadNotifications()}>
          Làm mới
        </Button>,
        <Button
          key="mark-all"
          type="primary"
          icon={<CheckCircleOutlined />}
          onClick={onMarkAllAsRead}
          disabled={unreadCount === 0}
        >
          Đánh dấu tất cả đã đọc
        </Button>,
      ]}
    >
      <Card>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space>
            <Badge count={unreadCount} overflowCount={99} showZero>
              <Tag color={unreadCount > 0 ? 'processing' : 'default'}>
                <MailOutlined /> Chưa đọc
              </Tag>
            </Badge>
            <Typography.Text type="secondary">
              Tổng: {pagination.total} thông báo
            </Typography.Text>
          </Space>

          <Input.Search
            allowClear
            placeholder="Tìm theo tiêu đề hoặc nội dung"
            onSearch={(value) => {
              const keyword = value.trim();
              setSearchTerm(keyword);
              loadNotifications({ current: 1, searchTerm: keyword });
            }}
          />

          <List
            loading={loading}
            dataSource={notifications}
            locale={{
              emptyText: <Empty description="Chưa có thông báo" />,
            }}
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              showSizeChanger: true,
              onChange: (current, pageSize) => {
                loadNotifications({ current, pageSize });
              },
            }}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="mark-read"
                    type="link"
                    icon={<CheckOutlined />}
                    disabled={item.isRead}
                    onClick={() => onMarkAsRead(item.id)}
                  >
                    Đánh dấu đã đọc
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<InfoCircleOutlined className={item.isRead ? 'text-gray-400' : 'text-blue-500'} />}
                  title={
                    <Space>
                      <Typography.Text strong={!item.isRead} className="cursor-pointer" onClick={() => onOpenNotification(item)}>
                        {item.title}
                      </Typography.Text>
                      {!item.isRead && <Tag color="blue">Mới</Tag>}
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size={4}>
                      {item.content && <Typography.Text className="cursor-pointer" onClick={() => onOpenNotification(item)}>{item.content}</Typography.Text>}
                      <Typography.Text type="secondary">
                        {new Date(item.createdDate).toLocaleString('vi-VN')}
                      </Typography.Text>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />

          <ModalForm
            title="Tạo thông báo"
            open={openCreateForm}
            onOpenChange={setOpenCreateForm}
            onFinish={onCreateNotification}
            initialValues={{
              type: 0,
              recipientType: 'all',
            }}
          >
            <ProFormText
              name="title"
              label="Tiêu đề"
              rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
            />
            <ProFormTextArea name="content" label="Nội dung" />
            <ProFormText
              name="actionUrl"
              label="Đường dẫn điều hướng"
              placeholder="Ví dụ: /users/member hoặc /shop/order"
            />
            <ProFormSelect
              name="type"
              label="Loại"
              options={[
                { label: 'System', value: 0 },
                { label: 'User', value: 1 },
              ]}
            />
            <ProFormSelect
              name="recipientType"
              label="Đối tượng nhận"
              options={[
                { label: 'Tất cả người dùng', value: 'all' },
                { label: 'Theo vai trò', value: 'role' },
                { label: 'Chọn người dùng', value: 'users' },
              ]}
              rules={[{ required: true, message: 'Vui lòng chọn đối tượng nhận' }]}
            />
            <ProFormDependency name={['recipientType']}>
              {({ recipientType }) => {
                if (recipientType === 'role') {
                  return (
                    <ProFormSelect
                      name="roleName"
                      label="Vai trò"
                      options={[
                        { label: 'Admin', value: 'admin' },
                        { label: 'Member', value: 'member' },
                        { label: 'Influencer', value: 'influencer' },
                      ]}
                      rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
                    />
                  );
                }

                if (recipientType === 'users') {
                  return (
                    <ProFormSelect
                      name="userIds"
                      label="Người dùng"
                      mode="multiple"
                      showSearch
                      request={apiUserOptions}
                      rules={[{ required: true, message: 'Vui lòng chọn ít nhất một người dùng' }]}
                    />
                  );
                }

                return null;
              }}
            </ProFormDependency>
          </ModalForm>
        </Space>
      </Card>
    </PageContainer>
  );
};

export default NotificationPage;