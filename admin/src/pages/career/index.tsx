import { apiDeleteJobApplication, apiJobApplicationList, apiUpdateJobApplicationStatus } from "@/services/careers/application";
import { DeleteOutlined, EyeOutlined, SettingOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProTable } from "@ant-design/pro-components"
import { Button, message, Popconfirm, Space } from "antd";
import { useRef } from "react";

const Index: React.FC = () => {
    const actionRef = useRef<ActionType>(null);

    const handleUpdateStatus = async (id: string, status: number) => {
        await apiUpdateJobApplicationStatus(id, status);
        message.success("Cap nhat trang thai thanh cong");
        actionRef.current?.reload();
    };

    const handleDelete = async (id: string) => {
        await apiDeleteJobApplication(id);
        message.success("Xoa don ung tuyen thanh cong");
        actionRef.current?.reload();
    };

    return (
        <PageContainer>
            <ProTable
                actionRef={actionRef}
                request={apiJobApplicationList}
                rowKey="id"
                columns={[
                    {
                        title: '#',
                        valueType: 'indexBorder',
                        width: 30
                    },
                    {
                        title: 'Vị trí tuyển dụng',
                        dataIndex: 'jobTitle'
                    },
                    {
                        title: 'Ngày ứng tuyển',
                        dataIndex: 'appliedDate',
                        valueType: 'dateTime',
                        search: false
                    },
                    {
                        title: 'Họ và tên',
                        dataIndex: 'candidateName'
                    },
                    {
                        title: 'Ngày sinh',
                        dataIndex: 'dateOfBirth',
                        valueType: 'date',
                        search: false
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email'
                    },
                    {
                        title: 'Số điện thoại',
                        dataIndex: 'phoneNumber'
                    },
                    {
                        title: 'Trạng thái',
                        dataIndex: 'status',
                        valueEnum: {
                            0: 'Chờ duyệt',
                            1: 'Đã duyệt',
                            2: 'Từ chối'
                        }
                    },
                    {
                        title: <SettingOutlined />,
                        valueType: 'option',
                        width: 300,
                        align: 'center',
                        render: (_, record: any) => (
                            <Space>
                                <Button
                                    size="small"
                                    type="default"
                                    icon={<EyeOutlined />}
                                    href={record.resumeFile}
                                    target="_blank"
                                    disabled={!record.resumeFile}
                                >
                                    Xem CV
                                </Button>
                                <Button
                                    size="small"
                                    type="primary"
                                    disabled={record.status === 1}
                                    onClick={() => handleUpdateStatus(record.id, 1)}
                                >
                                    Duyệt
                                </Button>
                                <Button
                                    size="small"
                                    danger
                                    disabled={record.status === 2}
                                    onClick={() => handleUpdateStatus(record.id, 2)}
                                >
                                    Từ chối
                                </Button>
                                <Popconfirm
                                    title="Bạn có chắc muốn xóa đơn ứng tuyển này?"
                                    onConfirm={() => handleDelete(record.id)}
                                >
                                    <Button size="small" type="primary" danger icon={<DeleteOutlined />} />
                                </Popconfirm>
                            </Space>
                        )
                    }
                ]}
                search={{
                    layout: 'vertical'
                }}
            />
        </PageContainer>
    )
}

export default Index;