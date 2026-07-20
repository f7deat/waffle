import { BellOutlined } from "@ant-design/icons";
import { history, Link } from "@umijs/max";
import { Badge, Empty, List, Popover, Typography } from "antd";
import { useEffect, useState } from "react";
import { markNotificationAsRead, queryNotificationList, queryUnreadNotificationCount } from "@/services/notification";
import { NOTIFICATION_UPDATED_EVENT } from "@/constants";

const NotificationBell: React.FC = () => {
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [items, setItems] = useState<API.NotificationListItem[]>([]);

    const loadUnreadCount = async () => {
        const response = await queryUnreadNotificationCount();
        setUnreadCount(response?.data || 0);
    }

    const loadUnreadList = async () => {
        setLoading(true);
        try {
            const pageSize = unreadCount > 0 ? Math.min(unreadCount, 50) : 10;
            const response = await queryNotificationList({ current: 1, pageSize });
            const unreadItems = (response?.data || []).filter((x: API.NotificationListItem) => !x.isRead);
            setItems(unreadItems);
        } finally {
            setLoading(false);
        }
    }

    const onOpenNotification = async (item: API.NotificationListItem) => {
        if (item.id) {
            await markNotificationAsRead(item.id);
        }
        window.dispatchEvent(new Event(NOTIFICATION_UPDATED_EVENT));
        history.push(item.actionUrl || "/user/notification");
    }

    useEffect(() => {
        loadUnreadCount();
        const timer = window.setInterval(loadUnreadCount, 60000);
        const onNotificationUpdated = () => loadUnreadCount();
        window.addEventListener(NOTIFICATION_UPDATED_EVENT, onNotificationUpdated);

        return () => {
            window.clearInterval(timer);
            window.removeEventListener(NOTIFICATION_UPDATED_EVENT, onNotificationUpdated);
        };
    }, []);

    const content = (
        <div style={{ width: 360, maxWidth: '90vw' }}>
            <Typography.Text strong>Thông báo chưa đọc</Typography.Text>
            <List
                className="mt-2"
                loading={loading}
                dataSource={items}
                locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo mới" /> }}
                renderItem={(item) => (
                    <List.Item className="cursor-pointer" onClick={() => onOpenNotification(item)}>
                        <List.Item.Meta
                            title={<Typography.Text strong>{item.title}</Typography.Text>}
                            description={(
                                <>
                                    {item.content && <Typography.Paragraph className="mb-0" ellipsis={{ rows: 2 }}>{item.content}</Typography.Paragraph>}
                                    <div>
                                        <Typography.Text type="secondary">
                                            {new Date(item.createdDate).toLocaleString('vi-VN')}
                                        </Typography.Text>
                                    </div>
                                </>
                            )}
                        />
                    </List.Item>
                )}
            />
            <div className="text-right mt-2">
                <Link to="/user/notification">Xem tất cả</Link>
            </div>
        </div>
    );

    return (
        <Popover trigger="hover" placement="bottomRight" content={content} onOpenChange={(open) => open && loadUnreadList()}>
            <Link to={`/user/notification`}>
                <Badge count={unreadCount} size="small" overflowCount={99}>
                    <BellOutlined className="text-lg" />
                </Badge>
            </Link>
        </Popover>
    )
}

export default NotificationBell;