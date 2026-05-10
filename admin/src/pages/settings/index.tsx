import { apiSyncSetting, listSetting } from '@/services/setting';
import { EditOutlined, SyncOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProList,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { history } from '@umijs/max';
import { Button, message } from 'antd';

type SettingItem = {
  id: string;
  name: string;
  value: string;
};

const SettingPage: React.FC = () => {

  const { data, loading } = useRequest(listSetting);

  return (
    <PageContainer extra={<Button type='primary' icon={<SyncOutlined />} onClick={async () => {
      await apiSyncSetting();
      message.success('Sync setting successfully');
    }}>Sync Setting</Button>}>
      <div className='grid md:grid-cols-4 grid-cols-1 gap-4'>
        {
          data?.map((item: SettingItem) => (
            <ProCard loading={loading} key={item.id} 
            headerBordered size='small'
            title={item.name} actions={[<EditOutlined onClick={() => history.push(`/setting/${item.id}`)} />] }>
              <div className='text-sm text-gray-500'>{item.value}</div>
            </ProCard>
          ))
        }
      </div>
    </PageContainer>
  );
};

export default SettingPage;
