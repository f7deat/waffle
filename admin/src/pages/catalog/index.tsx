import { apiListCatalogType } from '@/services/catalog';
import {
  PageContainer,
  ProCard,
} from '@ant-design/pro-components';
import { FormattedNumber, Link, useRequest } from '@umijs/max';
import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { Badge } from 'antd';

const CatalogPage: React.FC = () => {
  const { data } = useRequest(apiListCatalogType)

  return (
    <PageContainer>
      <div className='grid md:grid-cols-6 gap-4'>
        {
          data?.map((x: any) => (
            <Badge.Ribbon text={<FormattedNumber value={x.catalogCount} />} key={x.catalogType}>
              <ProCard title={x.name} headerBordered
                actions={[
                  <Link key="center" to={`/catalog/list/${x.catalogType}`}><FormOutlined /></Link>
                ]}
              />
            </Badge.Ribbon>
          ))
        }
      </div>
    </PageContainer>
  );
};

export default CatalogPage;
