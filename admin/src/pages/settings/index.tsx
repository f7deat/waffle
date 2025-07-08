import { apiSyncSetting, listSetting } from '@/services/setting';
import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProList,
} from '@ant-design/pro-components';
import { history } from '@umijs/max';
import { Button, message } from 'antd';
import { useRef } from 'react';

const SettingPage: React.FC = () => {

  const actionRef = useRef<ActionType>();

  return (
    <PageContainer extra={<Button type='primary' icon={<SyncOutlined />} onClick={async () => {
      await apiSyncSetting();
      message.success('Sync setting successfully');
      actionRef.current?.reload();
    }}>Sync Setting</Button>}>
      <ProList
        grid={{ gutter: 16, column: 2, xxl: 4 }}
        actionRef={actionRef}
        ghost
        search={false}
        metas={{
          title: {
            dataIndex: 'name'
          },
          description: {
            dataIndex: 'description'
          },
          actions: {
            render: (text, record) => [
              <Button
                key="edit"
                type="primary"
                size="small"
                icon={<EditOutlined />}
                onClick={() => history.push(`/settings/general/center/${record.id}`)}
              >
                Edit
              </Button>,
            ],
          }
        }}
        request={listSetting} rowKey="id" />
    </PageContainer>
  );
};

export default SettingPage;
