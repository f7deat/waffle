import WorkContentComponent from '@/components/works';
import { addCatalog, getCatalog } from '@/services/catalog';
import {
  ModalForm,
  PageContainer,
  ProCard,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, useParams } from '@umijs/max';
import { Button, Col, message, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import CatalogSetting from './setting';
import CatalogSummary from './summary';
import { CatalogType } from '@/constants';
import ChildCatalog from './child';
import ProductDetail from './products/detail';
import { LeftOutlined } from '@ant-design/icons';

const CatalogPage: React.FC = () => {
  const { id } = useParams();

  const [open, setOpen] = useState<boolean>(false);
  const [catalog, setCatalog] = useState<API.Catalog>();
  const [tab, setTab] = useState('content');

  const reload = () => {
    getCatalog(id).then((response) => setCatalog(response));
  }

  useEffect(() => {
    reload();
  }, [id]);

  const onFinish = async (values: API.Catalog) => {
    addCatalog(values).then((response) => {
      if (response.succeeded) {
        message.success('Saved!');
        setOpen(false);
      }
    });
  };

  const onTabChange = (key: string) => {
    setTab(key);
  }

  return (
    <PageContainer
      title={catalog?.name}
      extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}><span><FormattedMessage id='general.back' /></span></Button>}
    >
      <Row gutter={16}>
        <Col md={18}>
          <ProCard
            tabs={{
              tabPosition: 'top',
              activeKey: tab,
              items: [
                {
                  label: 'Content',
                  key: 'content',
                  children: <WorkContentComponent />,
                },
                {
                  label: <FormattedMessage id='menu.settings' />,
                  key: 'setting',
                  children: <CatalogSetting catalog={catalog} reload={reload} />,
                },
                {
                  label: <FormattedMessage id='pages.catalog.productDetail' />,
                  key: 'product-detail',
                  children: <ProductDetail />,
                  disabled: catalog?.type !== CatalogType.Product
                },
                {
                  label: 'Trang con',
                  key: 'childen',
                  children: <ChildCatalog parent={catalog} />
                }
              ],
              onChange: onTabChange,
            }}
            className='mb-4'
          />
          <ModalForm onFinish={onFinish} open={open} onOpenChange={setOpen}>
            <ProFormText name="name" label="Name" />
            <ProFormText name="normalizedName" label="Normalized Name" />
          </ModalForm>
        </Col>
        <Col md={6}>
          <CatalogSummary catalog={catalog} />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default CatalogPage;
