import { apiJobApplicationList } from "@/services/careers/application";
import { PageContainer, ProTable } from "@ant-design/pro-components"

const Index: React.FC = () => {
    return (
        <PageContainer>
            <ProTable
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
                        valueType: 'dateTime'
                    },
                    {
                        title: 'Họ và tên',
                        dataIndex: 'candidateName'
                    },
                    {
                        title: 'Ngày sinh',
                        dataIndex: 'dateOfBirth',
                        valueType: 'date'
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
                            1: 'Đã duyệt'
                        }
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