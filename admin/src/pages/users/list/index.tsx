import { createUser, deleteUser, listUser } from '@/services/user';
import { DeleteOutlined, EyeOutlined, ManOutlined, PlusOutlined, WomanOutlined } from '@ant-design/icons';
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
      title: 'Tài khoản',
      dataIndex: 'userName',
      width: 200
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
      dataIndex: 'createdDate',
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
