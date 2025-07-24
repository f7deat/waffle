import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Empty } from 'antd';
import { useState } from 'react';
import SecuriryCenter from './components/security';
import Basic from './components/basic';
import { LeftOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';

const UserCenter: React.FC = () => {
  const [tab, setTab] = useState('basic');
  return (
    <PageContainer extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}>Quay lại</Button>}>
      <ProCard
        tabs={{
          tabPosition: 'top',
          activeKey: tab,
          items: [
            {
              label: 'Cơ bản',
              key: 'basic',
              children: <Basic />,
            },
            {
              label: 'Bảo mật',
              key: 'tab2',
              children: <SecuriryCenter headerTitle="Bảo mật" />,
            },
            {
              label: 'Liên kết',
              key: 'tab3',
              children: <Empty />,
            },
            {
              label: 'Thông báo',
              key: 'tab4',
              children: <Empty />,
            },
          ],
          onChange: (key) => {
            setTab(key);
          },
        }}
      ></ProCard>
    </PageContainer>
  );
};

export default UserCenter;
