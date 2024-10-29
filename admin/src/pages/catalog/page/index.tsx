import CatalogList from '@/components/catalog/list';
import { CatalogType } from '@/constants';
import { apiGetCatalogTypes } from '@/services/catalog';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useEffect, useState } from 'react';

const Page: React.FC = () => {
  const [catalogTypes, setCatalogTypes] = useState<any[]>([]);

  useEffect(() => {
    apiGetCatalogTypes().then(response => setCatalogTypes(response.filter((x: any) => x.value !== CatalogType.Product.toString())));
  }, []);

  return (
    <PageContainer>
      <ProCard
        tabs={{
          tabPosition: 'top',
          items: catalogTypes.map((type => ({
            label: type.label,
            key: type.value,
            children: <CatalogList type={type.value} />
          })))
        }}
      />
    </PageContainer>
  );
};

export default Page;
