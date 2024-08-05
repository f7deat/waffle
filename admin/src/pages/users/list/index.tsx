import { createUser, deleteUser, listUser } from '@/services/user';
import { DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl, history } from '@umijs/max';
import { Badge, Button, message, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';

const UserList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const [open, setOpen] = useState<boolean>(false);

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
    const response = await deleteUser(id);
    if (response.succeeded) {
      message.success('Deleted');
      actionRef.current?.reload();
    }
  }

  const columns: ProColumns<API.User>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 50
    },
    {
      title: 'User name',
      dataIndex: 'userName',
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (dom, entity) => (
        <Space>
          <Badge color={entity.emailConfirmed ? 'green' : 'red'} /> {dom}
        </Space>
      )
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
      title: '',
      valueType: 'option',
      render: (dom, entity) => [
        <Button
          type="text"
          icon={<EyeOutlined />}
          key={1}
          size='small'
          onClick={() => {
            history.push(`/users/profile/${entity.id}`);
          }}
        />,
        <Popconfirm title="Are you sure?" key={2} onConfirm={() => onConfirm(entity.id)}>
          <Button type="text" icon={<DeleteOutlined />} size='small' danger />
        </Popconfirm>,
      ],
      width: 80
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
        <ProFormText name="userName" label="User Name" rules={[
          {
            required: true
          }
        ]} />
        <ProFormText
          name="email"
          label="Email"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText name="phoneNumber" label="Phone Number" />
        <ProFormText.Password
          name="password"
          label="Password"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText.Password
          name="confirmPassword"
          label="Confirm password"
          rules={[
            {
              required: true,
            },
          ]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default UserList;
