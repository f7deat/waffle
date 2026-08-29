import ImageLibraryPicker from '@/components/image-library/picker';
import { Partner, PartnerInput, apiPartnerCreate, apiPartnerDelete, apiPartnerList, apiPartnerUpdate } from '@/services/partner';
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProFormInstance, ProFormText, ProTable } from '@ant-design/pro-components';
import { Avatar, Button, Popconfirm, Space, Typography, message } from 'antd';
import { useRef, useState } from 'react';

const PartnerPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [editingPartner, setEditingPartner] = useState<Partner>();
  const [openForm, setOpenForm] = useState(false);

  const openCreateForm = () => {
    setEditingPartner(undefined);
    formRef.current?.resetFields();
    setOpenForm(true);
  };

  const openEditForm = (partner: Partner) => {
    setEditingPartner(partner);
    formRef.current?.setFieldsValue(partner);
    setOpenForm(true);
  };

  const onFinish = async (values: PartnerInput) => {
    try {
      if (editingPartner) {
        await apiPartnerUpdate(editingPartner.id, values);
        message.success('Partner updated successfully');
      } else {
        await apiPartnerCreate(values);
        message.success('Partner created successfully');
      }
      setOpenForm(false);
      actionRef.current?.reload();
      return true;
    } catch {
      return false;
    }
  };

  const deletePartner = async (id: string) => {
    try {
      await apiPartnerDelete(id);
      message.success('Partner deleted successfully');
      actionRef.current?.reload();
    } catch {
      message.error('Unable to delete partner');
    }
  };

  const columns: ProColumns<Partner>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      search: false,
      width: 88,
      align: 'center',
      render: (_, partner) => <Avatar shape="square" size={40} src={partner.logo} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'URL',
      dataIndex: 'url',
      search: false,
      render: (_, partner) => (
        <Typography.Link href={partner.url} target="_blank" rel="noreferrer">
          {partner.url}
        </Typography.Link>
      ),
    },
    {
      title: <SettingOutlined />,
      valueType: 'option',
      width: 92,
      align: 'center',
      render: (_, partner) => [
        <Button key="edit" type="primary" size="small" icon={<EditOutlined />} onClick={() => openEditForm(partner)} />,
        <Popconfirm
          key="delete"
          title="Are you sure you want to delete this partner?"
          onConfirm={() => deletePartner(partner.id)}
        >
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Partner>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={apiPartnerList}
        search={{ layout: 'vertical' }}
        headerTitle={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
            Add Partner
          </Button>
        }
      />
      <ModalForm<PartnerInput>
        formRef={formRef}
        open={openForm}
        title={editingPartner ? 'Edit Partner' : 'Add Partner'}
        layout="vertical"
        onOpenChange={(visible) => {
          setOpenForm(visible);
          if (!visible) {
            setEditingPartner(undefined);
            formRef.current?.resetFields();
          }
        }}
        onFinish={onFinish}
      >
        <ProFormText
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter partner name' }]}
        />
        <ProFormText
          name="logo"
          label="Logo"
          rules={[{ required: true, message: 'Please select a logo' }]}
          fieldProps={{
            addonAfter: (
              <ImageLibraryPicker onChange={(url) => formRef.current?.setFieldValue('logo', url)} />
            ),
          }}
        />
        <ProFormText
          name="url"
          label="URL"
          rules={[
            { required: true, message: 'Please enter partner URL' },
            { type: 'url', message: 'Please enter a valid URL' },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default PartnerPage;