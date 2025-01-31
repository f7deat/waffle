import { PageContainer, ProTable } from "@ant-design/pro-components"

const Index: React.FC = () => {
    return (
        <PageContainer>
            <ProTable
                rowKey="id"
                columns={[
                    {
                        title: '#',
                        valueType: 'indexBorder',
                        width: 30
                    }
                ]}
            />
        </PageContainer>
    )
}

export default Index;