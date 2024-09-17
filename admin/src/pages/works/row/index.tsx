import { PageContainer, ProCard } from '@ant-design/pro-components';
import { FormattedMessage, history } from '@umijs/max';
import { useState } from 'react';
import RowContent from './components/content';
import RowSetting from './components/setting';
import { AbstractBlock } from '@/typings/work';

const RowComponent: React.FC<AbstractBlock> = ({ data }) => {
  const [tab, setTab] = useState('content');

  return (
    <>
      <ProCard
        tabs={{
          activeKey: tab,
          items: [
            {
              label: 'Content',
              key: 'content',
              children: <RowContent />,
            },
            {
              label: <FormattedMessage id='menu.settings' />,
              key: 'setting',
              children: <RowSetting />,
            },
          ],
          onChange: (key) => {
            setTab(key);
          },
        }}
      />
    </>
  );
};

export default RowComponent;
