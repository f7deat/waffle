import { apiGetUser, apiUpdateUser, createUser, apiUserDelete, listUser } from '@/services/user';
import { DeleteOutlined, EditOutlined, EyeOutlined, ManOutlined, PlusOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import UserFormFields from '../components/user-form-fields';
import { FormattedMessage, useIntl, history, Link } from '@umijs/max';
import { Badge, Button, message, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';

const UserList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [updating, setUpdating] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>();

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu không khớp');
      return;
    }
    const response = await createUser(values);
    if (response.succeeded) {
      message.success(
        intl.formatMessage({
          id: 'general.saved',
        }),
      );
      setOpen(false);
      actionRef.current?.reload();
    } else {
      message.error(response.errors[0].description)
    }
  };

  const onConfirm = async (id?: string) => {
    await apiUserDelete(id);
    message.success('Deleted');
    actionRef.current?.reload();
  }

  const openEditModal = async (id?: string) => {
    if (!id) return;
    setUpdating(true);
    try {
      const response = await apiGetUser(id);
      setEditData(response);
      setEditOpen(true);
    } finally {
      setUpdating(false);
    }
  };

  const onUpdate = async (values: any) => {
    await apiUpdateUser(values);
    message.success('Updated');
    setEditOpen(false);
    actionRef.current?.reload();
    return true;
  };

  const columns: ProColumns<API.User>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 30,
      align: 'center'
    },
    {
      title: <UserOutlined />,
      dataIndex: 'avatar',
      valueType: 'avatar',
      width: 30,
      search: false
    },
    {
      title: 'Tài khoản',
      dataIndex: 'userName',
      width: 200,
      render: (dom, entity) => (
        <Link to={`/users/profile/${entity.id}`}>{dom}</Link>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (dom, entity) => (
        <Space>
          {
            entity.gender === true && <WomanOutlined className='text-red-500' />
          }
          {
            entity.gender === false && <ManOutlined className='text-blue-500' />
          }
          {dom}
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (dom, entity) => (
        <Space>
          <Badge color={entity.emailConfirmed ? 'green' : 'red'} /> {dom}
        </Space>
      ),
      width: 200
    },
    {
      title: <FormattedMessage id='general.phoneNumber' />,
      dataIndex: 'phoneNumber',
      render: (dom, entity) => (
        <Space>
          <Badge color={entity.phoneNumberConfirmed ? 'green' : 'red'} /> {dom}
        </Space>
      )
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      valueType: 'date',
      search: false,
      width: 120
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      search: false
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      search: false,
      valueType: 'fromNow',
      width: 120
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      valueType: 'money',
      width: 100,
      search: false
    },
    {
      title: 'Tác vụ',
      valueType: 'option',
      render: (dom, entity) => [
        <Button
          type="default"
          icon={<EditOutlined />}
          key={0}
          size='small'
          loading={updating}
          onClick={() => openEditModal(entity.id)}
        />,
        <Button
          type="primary"
          icon={<EyeOutlined />}
          key={1}
          size='small'
          onClick={() => {
            history.push(`/users/profile/${entity.id}`);
          }}
        />,
        <Popconfirm title="Are you sure?" key={2} onConfirm={() => onConfirm(entity.id)}>
          <Button type="primary" icon={<DeleteOutlined />} size='small' danger />
        </Popconfirm>,
      ],
      width: 120
    },
  ];

  return (
    <PageContainer
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          <FormattedMessage id="general.new" />
        </Button>
      }
    >
      <ProTable<API.User>
        rowSelection={{}}
        rowKey="id"
        request={listUser}
        columns={columns}
        actionRef={actionRef}
        search={{
          layout: 'vertical',
        }}
      />
      <ModalForm
        open={open}
        onOpenChange={setOpen}
        title={intl.formatMessage({
          id: 'general.new',
        })}
        onFinish={onFinish}
      >
        <UserFormFields includePassword />
      </ModalForm>

      <ModalForm
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit user"
        onFinish={onUpdate}
        initialValues={editData}
      >
        <UserFormFields includeId includeAddress />
      </ModalForm>
    </PageContainer>
  );
};

export default UserList;
