import { listContact } from "@/services/contact";
import { DeleteOutlined } from "@ant-design/icons";
import { PageContainer, ProTable } from "@ant-design/pro-components"
import { Button, Popconfirm, Tooltip } from "antd";

const ContactPage: React.FC = () => {
    return (
        <PageContainer>
            <ProTable
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
                        render: () => [
                            <Popconfirm key="delete" title="Xác nhận xóa?">
                                <Tooltip title="Xóa">
                                    <Button type="primary" size="small" icon={<DeleteOutlined />} danger />
                                </Tooltip>
                            </Popconfirm>
                        ],
                        width: 60
                    }
                ]}
            />
        </PageContainer>
    )
}

export default ContactPage;