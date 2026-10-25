import {
  SocialPlatform,
  SocialPlatformInput,
  apiSocialPlatformCreate,
  apiSocialPlatformDelete,
  apiSocialPlatformList,
  apiSocialPlatformUpdate,
} from '@/services/social-platform';
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormInstance,
  ProFormSwitch,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import { useRef, useState } from 'react';

const SocialPlatformPage: React.FC = () => {
  const actionRef = useRef<ActionType | undefined>(undefined);
  const formRef = useRef<ProFormInstance | undefined>(undefined);
  const [editingPlatform, setEditingPlatform] = useState<SocialPlatform>();
  const [openForm, setOpenForm] = useState(false);

  const openCreateForm = () => {
    setEditingPlatform(undefined);
    formRef.current?.resetFields();
    setOpenForm(true);
  };

  const openEditForm = (platform: SocialPlatform) => {
    setEditingPlatform(platform);
    formRef.current?.setFieldsValue(platform);
    setOpenForm(true);
  };

  const onFinish = async (values: SocialPlatformInput) => {
    try {
      if (editingPlatform) {
        await apiSocialPlatformUpdate(editingPlatform.id, values);
        message.success('Cập nhật nền tảng mạng xã hội thành công');
      } else {
        await apiSocialPlatformCreate(values);
        message.success('Tạo nền tảng mạng xã hội thành công');
      }
      setOpenForm(false);
      actionRef.current?.reload();
      return true;
    } catch {
      message.error('Không thể lưu nền tảng mạng xã hội');
      return false;
    }
  };

  const deletePlatform = async (id: string) => {
    try {
      await apiSocialPlatformDelete(id);
      message.success('Xóa nền tảng mạng xã hội thành công');
      actionRef.current?.reload();
    } catch {
      message.error('Không thể xóa nền tảng mạng xã hội đang được sử dụng');
    }
  };

  const columns: ProColumns<SocialPlatform>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: 'Mã',
      dataIndex: 'code',
    },
    {
      title: 'Tên nền tảng',
      dataIndex: 'name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      valueEnum: {
        true: { text: 'Đang hoạt động', status: 'Success' },
        false: { text: 'Đã tắt', status: 'Default' },
      },
    },
    {
      title: <SettingOutlined />,
      valueType: 'option',
      width: 92,
      align: 'center',
      render: (_, platform) => [
        <Button
          key="edit"
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => openEditForm(platform)}
        />,
        <Popconfirm
          key="delete"
          title="Bạn có chắc muốn xóa nền tảng này?"
          description="Không thể xóa nền tảng đã được gán cho tài khoản."
          onConfirm={() => deletePlatform(platform.id)}
        >
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<SocialPlatform>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={apiSocialPlatformList}
        search={false}
        headerTitle={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
            Thêm nền tảng
          </Button>
        }
      />
      <ModalForm<SocialPlatformInput>
        formRef={formRef}
        open={openForm}
        title={editingPlatform ? 'Sửa nền tảng' : 'Thêm nền tảng'}
        layout="vertical"
        onOpenChange={(visible) => {
          setOpenForm(visible);
          if (!visible) {
            setEditingPlatform(undefined);
            formRef.current?.resetFields();
          }
        }}
        onFinish={onFinish}
      >
        <ProFormText
          name="code"
          label="Mã"
          rules={[
            { required: true, whitespace: true, message: 'Vui lòng nhập mã nền tảng' },
            { max: 40, message: 'Mã nền tảng không được vượt quá 40 ký tự' },
          ]}
        />
        <ProFormText
          name="name"
          label="Tên nền tảng"
          rules={[
            { required: true, whitespace: true, message: 'Vui lòng nhập tên nền tảng' },
            { max: 100, message: 'Tên nền tảng không được vượt quá 100 ký tự' },
          ]}
        />
        <ProFormSwitch name="isActive" label="Đang hoạt động" />
      </ModalForm>
    </PageContainer>
  );
};

export default SocialPlatformPage;
