import { apiCatalogDetail } from "@/services/catalog";
import { LeftOutlined } from "@ant-design/icons";
import { PageContainer, ProCard } from "@ant-design/pro-components"
import { useParams, useRequest } from "@umijs/max";
import { Button } from "antd";
import PlaceContent from "./components/content";
import CatalogSetting from "../setting";

const Index: React.FC = () => {

    const { id } = useParams<{ id: string }>();
    const { data, loading } = useRequest(() => apiCatalogDetail(id));

    return (
        <PageContainer extra={<Button onClick={() => history.back()} icon={<LeftOutlined />}>Back</Button>} title={data?.name}>
            <ProCard
                tabs={{
                    items: [
                        {
                            key: 'content',
                            label: 'Nội dung',
                            children: <PlaceContent />
                        },
                        {
                            key: 'setting',
                            label: 'Cài đặt',
                            children: <CatalogSetting />
                        }
                    ]
                }}
            >
            </ProCard>
        </PageContainer>
    )
}

export default Index;