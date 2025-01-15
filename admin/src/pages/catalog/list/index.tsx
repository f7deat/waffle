import CatalogList from '@/components/catalog/list';
import { apiGetCatalogType } from '@/services/catalog';
import { LeftOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { FormattedMessage, history, useParams, useRequest } from '@umijs/max';
import { Button } from 'antd';

const Index: React.FC = () => {

    const { id } = useParams();
    const { data } = useRequest(() => apiGetCatalogType(id))

    return (
        <PageContainer title={data?.name} extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}><FormattedMessage id="general.back" /></Button>}>
            <CatalogList type={id as any} />
        </PageContainer>
    );
};

export default Index;
