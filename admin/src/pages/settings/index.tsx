import { apiSaveSetting, apiSyncSetting, listSetting } from '@/services/setting';
import { EditOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
import {
  ActionType,
  DrawerForm,
  PageContainer,
  ProFormInstance,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import SiteSettings from './components/site';

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

  return (
    <PageContainer>
      <ProTable 
      actionRef={actionRef}
      request={listSetting}
        columns={[
          {
            title: '#',
            valueType: 'indexBorder',
            width: 30,
            align: 'center'
          },
          {
            title: 'Name',
            dataIndex: 'name',
          },
          {
            title: 'Normalized Name',
            dataIndex: 'normalizedName',
          },
          {
            title: <SettingOutlined />,
            valueType: 'option',
            render: (text, record) => [
              <Button key='edit' type='primary' size='small' icon={<EditOutlined />} onClick={() => {
                setSelected(record);
                setOpen(true);
              }} />
            ],
            width: 30,
            align: 'center'
          }
        ]}
        search={{
          layout: 'vertical',
        }}
      />
      <DrawerForm
        title="Edit Setting"
        open={open}
        onOpenChange={setOpen}
        formRef={formRef} onFinish={onFinish}
      >
        <SiteSettings />
      </DrawerForm>
    </PageContainer>
  );
};

export default SettingPage;
