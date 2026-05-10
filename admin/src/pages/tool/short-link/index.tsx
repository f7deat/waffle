import {
    CopyOutlined,
    DeleteOutlined,
    LinkOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import {
    PageContainer,
    ProCard,
    ProForm,
    ProFormText,
} from '@ant-design/pro-components';
import {
    clearShortLink,
    createShortLink,
    deleteShortLink,
    listShortLink,
    ShortLinkItem,
} from '@/services/short-link';
import { Button, Empty, List, Space, Typography, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';

const Index: React.FC = () => {
    const [history, setHistory] = useState<ShortLinkItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const latestItem = useMemo(() => history[0], [history]);

    const loadHistory = async () => {
        setLoading(true);
        try {
            const response = await listShortLink();
            setHistory(response?.data || []);
        } catch {
            message.error('Cannot load short link history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    const onCreateShortLink = async (values: { url: string }) => {
        setSubmitting(true);
        try {
            const item = await createShortLink(values.url);
            const nextItems = [item, ...history.filter((x) => x.id !== item.id)];
            setHistory(nextItems);
            message.success('Short link created');
        } catch {
            message.error('Cannot create short link now. Please try again.');
        } finally {
            setSubmitting(false);
        }

        return true;
    };

    const onCopy = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value);
            message.success('Copied to clipboard');
        } catch {
            message.error('Failed to copy');
        }
    };

    const onDeleteItem = async (id: string) => {
        try {
            await deleteShortLink(id);
            setHistory(history.filter((item) => item.id !== id));
            message.success('Deleted');
        } catch {
            message.error('Cannot delete short link');
        }
    };

    const onClearHistory = async () => {
        try {
            await clearShortLink();
            setHistory([]);
            message.success('History cleared');
        } catch {
            message.error('Cannot clear history');
        }
    };

    return (
        <PageContainer>
            <Space direction="vertical" size={16} className="w-full">
                <ProCard title="Create Short Link" bordered>
                    <ProForm
                        submitter={{
                            searchConfig: {
                                submitText: 'Shorten URL',
                            },
                            submitButtonProps: {
                                loading: submitting,
                                icon: <LinkOutlined />,
                                type: 'primary',
                            },
                            resetButtonProps: false,
                        }}
                        onFinish={onCreateShortLink}
                    >
                        <ProFormText
                            name="url"
                            label="Long URL"
                            placeholder="https://example.com/article/your-very-long-link"
                            rules={[
                                {
                                    required: true,
                                    message: 'URL is required',
                                },
                                {
                                    type: 'url',
                                    message: 'Please input a valid URL',
                                },
                            ]}
                        />
                    </ProForm>
                </ProCard>

                <ProCard
                    title="Latest Result"
                    bordered
                    extra={
                        latestItem ? (
                            <Space>
                                <Button
                                    size="small"
                                    icon={<CopyOutlined />}
                                    onClick={() => onCopy(latestItem.shortUrl)}
                                >
                                    Copy
                                </Button>
                                <Button
                                    size="small"
                                    onClick={() => window.open(latestItem.shortUrl, '_blank')}
                                >
                                    Open
                                </Button>
                            </Space>
                        ) : null
                    }
                >
                    {latestItem ? (
                        <Space direction="vertical" size={4}>
                            <Typography.Text type="secondary">Short URL</Typography.Text>
                            <Typography.Text copyable={{ text: latestItem.shortUrl }} strong>
                                {latestItem.shortUrl}
                            </Typography.Text>
                            <Typography.Text type="secondary">Long URL</Typography.Text>
                            <Typography.Paragraph ellipsis={{ rows: 2 }} className="mb-0">
                                {latestItem.originalUrl}
                            </Typography.Paragraph>
                        </Space>
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No short link yet" />
                    )}
                </ProCard>

                <ProCard
                    title="History"
                    bordered
                    extra={
                        history.length > 0 ? (
                            <Button danger type="text" icon={<ReloadOutlined />} onClick={onClearHistory}>
                                Clear all
                            </Button>
                        ) : null
                    }
                >
                    {history.length > 0 ? (
                        <List
                            loading={loading}
                            dataSource={history}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            key="copy"
                                            type="text"
                                            icon={<CopyOutlined />}
                                            onClick={() => onCopy(item.shortUrl)}
                                        >
                                            Copy
                                        </Button>,
                                        <Button
                                            key="open"
                                            type="text"
                                            onClick={() => window.open(item.shortUrl, '_blank')}
                                        >
                                            Open
                                        </Button>,
                                        <Button
                                            key="delete"
                                            danger
                                            type="text"
                                            icon={<DeleteOutlined />}
                                            onClick={() => onDeleteItem(item.id)}
                                        />,
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<Typography.Text copyable={{ text: item.shortUrl }}>{item.shortUrl}</Typography.Text>}
                                        description={<Typography.Text type="secondary" ellipsis>{item.originalUrl}</Typography.Text>}
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="History is empty" />
                    )}
                </ProCard>
            </Space>
        </PageContainer>
    );
};

export default Index;