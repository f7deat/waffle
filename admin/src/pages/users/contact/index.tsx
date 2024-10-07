import { listContact } from "@/services/contact";
import { PageContainer, ProTable } from "@ant-design/pro-components"

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
                    }
                ]}
            />
        </PageContainer>
    )
}

export default ContactPage;