import { apiStreetList } from "@/services/locations/street";
import { PageContainer, ProTable } from "@ant-design/pro-components";
import { useParams } from "@umijs/max";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    return (
        <PageContainer>
            <ProTable request={apiStreetList} rowKey={"id"} params={{ districtId: id }} columns={[
                {
                    title: '#',
                    valueType: 'indexBorder',
                    width: 30,
                    align: 'center'
                },
                {
                    title: 'Name',
                    dataIndex: 'name'
                }
            ]} search={{
                layout: 'vertical'
            }} />
        </PageContainer>
    )
}

export default Index;