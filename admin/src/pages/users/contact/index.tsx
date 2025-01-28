import { apiDeleteContact, listContact } from "@/services/contact";
import { DeleteOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProTable } from "@ant-design/pro-components"
import { Button, message, Popconfirm, Tooltip } from "antd";
import { useRef } from "react";

const ContactPage: React.FC = () => {

    const actionRef = useRef<ActionType>();

    const onDelete = async (id: string) => {
        await apiDeleteContact(id);
        message.success('Xóa liên hệ thành công');
        actionRef.current?.reload();
    }

    return (
        <PageContainer>
            <ProTable
                actionRef={actionRef}
                search={{
                    layout: 'vertical'
                }}
                request={listContact}
                columns={[
                    {
                        title: '#',
                        valueType: 'indexBorder',
                        width: 30
                    },
                    {
                        title: 'Họ và tên',
                        dataIndex: 'name'
                    },
                    {
                        title: 'Số điện thoại',
                        dataIndex: 'phoneNumber'
                    },
                    {
                        title: 'Email',
                        dataIndex: 'email'
                    },
                    {
                        title: 'Ghi chú',
                        dataIndex: 'note',
                        search: false
                    },
                    {
                        title: 'Tác vụ',
                        valueType: 'option',
                        render: (_, entity) => [
                            <Popconfirm key="delete" title="Xác nhận xóa?" onConfirm={() => onDelete(entity.id)}>
                                <Tooltip title="Xóa">
                                    <Button type="primary" size="small" icon={<DeleteOutlined />} danger />
                                </Tooltip>
                            </Popconfirm>
                        ],
                        width: 70
                    }
                ]}
            />
        </PageContainer>
    )
}

export default ContactPage;