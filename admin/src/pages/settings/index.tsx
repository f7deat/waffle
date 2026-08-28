import { apiDeleteSetting, apiInitializeSettings, apiSaveSetting, listSetting } from '@/services/setting';
import { DeleteOutlined, EditOutlined, HomeOutlined, SendOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import {
  ActionType,
  DrawerForm,
  PageContainer,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { useEffect, useRef, useState } from 'react';
import SiteSettings from './components/site';
import TelegramSettings from './components/telegram';

const SettingPage: React.FC = () => {

  const [open, setOpen] = useState(false);
  const formRef = useRef<ProFormInstance>(null);
  const actionRef = useRef<ActionType>(null);
  const [selected, setSelected] = useState<any>();

  useEffect(() => {
    if (selected && open) {
      formRef.current?.setFieldsValue({
        ...JSON.parse((selected.value || '{}') as string)
      });
    } else {
      formRef.current?.resetFields();
    }
  }, [selected, open]);

  const onFinish = async (values: any) => {
    await apiSaveSetting(selected?.id, values);
    message.success('Save setting successfully');
    actionRef.current?.reload();
    return true;
  }

  const SETTINGS = [
    {
      name: 'Site Settings',
      normalizedName: 'SITE',
      description: 'Manage site settings like site name, logo, favicon, etc.',
      component: <SiteSettings />,
      icon: <HomeOutlined className="text-2xl text-gray-500" />,
    },
    {
      name: 'Telegram',
      normalizedName: 'TELEGRAM',
      description: 'Manage Telegram settings like bot token, chat id, etc.',
      component: <TelegramSettings />,
      icon: <SendOutlined className="text-2xl text-gray-500" />,
    }
  ]

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        {
          SETTINGS.map(setting => (
            <div key={setting.normalizedName} className='mb-4'>
              <div className="bg-white rounded p-4 border border-transparent cursor-pointer hover:border-blue-500" onClick={() => {
                setSelected(setting);
                setOpen(true);
              }}>
                <div className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-2 w-20 h-20 justify-center bg-gray-100 rounded-lg">
                    {setting.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-lg font-semibold">{setting.name}</div>
                    <div className="text-sm text-gray-500">{setting.description}</div>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      
      <DrawerForm
        title="Edit Setting"
        open={open}
        onOpenChange={setOpen}
        formRef={formRef} onFinish={onFinish}
        drawerProps={{
          destroyOnHidden: true
        }}
      >
        {selected?.component}
      </DrawerForm>
    </PageContainer>
  );
};

export default SettingPage;
