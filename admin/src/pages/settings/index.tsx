import { apiDeleteSetting, apiInitializeSettings, apiSaveSetting, listSetting } from '@/services/setting';
import { DeleteOutlined, EditOutlined, SettingOutlined, SyncOutlined } from '@ant-design/icons';
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
    <PageContainer extra={<Button type='primary' icon={<SyncOutlined />} onClick={apiInitializeSettings}>
      Initialize Settings
    </Button>}>
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
            search: false,
          },
          {
            title: <SettingOutlined />,
            valueType: 'option',
            render: (text, record) => [
              <Button key='edit' type='primary' size='small' icon={<EditOutlined />} onClick={() => {
                setSelected(record);
                setOpen(true);
              }} />,
              <Popconfirm key='delete' title='Are you sure to delete this setting?' onConfirm={async () => {
                await apiDeleteSetting(record.id);
                message.success('Delete setting successfully');
                actionRef.current?.reload();
              }}>
                <Button type='primary' danger size='small' icon={<DeleteOutlined />}></Button>
              </Popconfirm>
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
