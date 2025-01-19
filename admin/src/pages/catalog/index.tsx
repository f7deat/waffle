import { apiGetCatalogTypes } from '@/services/catalog';
import {
  PageContainer,
  ProCard,
} from '@ant-design/pro-components';
import { Link } from '@umijs/max';
import React, { useEffect, useState } from 'react';
import { FormOutlined } from '@ant-design/icons';

const CatalogPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    apiGetCatalogTypes().then(response => setData(response));
  }, []);

  return (
    <PageContainer>
      <div className='grid md:grid-cols-6 gap-4'>
        {
          data.map((x) => (
            <ProCard key={x.value} title={x.label} headerBordered 
            actions={[
              <Link key={x.value} to={`/catalog/list/${x.value}`}><FormOutlined /></Link>
            ]}
            />
          ))
        }
      </div>
    </PageContainer>
  );
};

export default CatalogPage;
