import CatalogList from '@/components/catalog/list';
import { CatalogType } from '@/constants';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useState } from 'react';

const Page: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(`${CatalogType.Default}`);

  return (
    <PageContainer>
      <ProCard 
        tabs={{
          activeKey: activeKey,
          tabPosition: 'top',
          onChange: (key) => {
            setActiveKey(key);
          },
          items: [
            {
              label: 'Trang',
              key: `${CatalogType.Default}`,
              children: <CatalogList type={CatalogType.Default} />
            },
            {
              label: 'Games',
              key: `${CatalogType.Game}`,
              children: <CatalogList type={CatalogType.Game} />
            },
            {
              label: 'Locations',
              key: `${CatalogType.Location}`,
              children: <CatalogList type={CatalogType.Location} />
            },
            {
              label: 'Videos',
              key: `${CatalogType.Video}`,
              children: <CatalogList type={CatalogType.Video} />
            },
            {
              label: 'Albums',
              key: `${CatalogType.Albums}`,
              children: <CatalogList type={CatalogType.Albums} />
            },
            {
              label: 'WordPress',
              key: `${CatalogType.WordPress}`,
              children: <CatalogList type={CatalogType.WordPress} />
            },
            {
              label: 'Brand',
              key: `${CatalogType.Brand}`,
              children: <CatalogList type={CatalogType.Brand} />
            }
          ]
        }}
      />
    </PageContainer>
  );
};

export default Page;
