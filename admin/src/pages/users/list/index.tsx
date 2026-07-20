import { apiGetUser, apiUpdateUser, createUser, apiUserDelete, listUser } from '@/services/user';
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, EyeOutlined, ManOutlined, MoreOutlined, PlusOutlined, UserOutlined, WomanOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import UserFormFields from '../components/user-form-fields';
import { FormattedMessage, useIntl, history, Link } from '@umijs/max';
import { Button, Dropdown, message, Popconfirm, Space } from 'antd';
import { useRef, useState } from 'react';
import UserEditForm from '../components/edit-form';

const UserList: React.FC = () => {
  const intl = useIntl();
  const actionRef = useRef<ActionType | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editData, setEditData] = useState<any>();

  const onFinish = async (values: any) => {
    if (values.password !== values.confirmPassword) {
      message.error('Mật khẩu không khớp');
      return;
    }
    const response = await createUser(values);
    if (response.succeeded) {
      message.success("Tạo tài khoản thành công!");
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
        <Link to={`/user/profile/${entity.id}`}>{dom}</Link>
      )
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (dom, entity) => (
        <Space size={'small'}>
          {
            entity.gender === true && <WomanOutlined className='text-red-700' />
          }
          {
            entity.gender === false && <ManOutlined className='text-blue-700' />
          }
          {dom}
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (dom, entity) => (
        <>
          <span className={`${entity.emailConfirmed ? 'text-green-700' : 'text-red-700'} mr-1`}>&bull;</span>
          {dom}
        </>
      ),
      width: 200,
      minWidth: 200
    },
    {
      title: <FormattedMessage id='general.phoneNumber' />,
      dataIndex: 'phoneNumber',
      render: (dom, entity) => (
        <>
          <span className={`${entity.phoneNumberConfirmed ? 'text-green-700' : 'text-red-700'} mr-1`}>&bull;</span>
          {dom}
        </>
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      search: false,
      valueType: 'dateTime',
      width: 170
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
      render: (_, entity) => [
        <Dropdown key="more" menu={{
          items: [
            {
              key: 'view',
              label: 'View Profile',
              icon: <EyeOutlined />,
              onClick: () => {
                history.push(`/user/profile/${entity.id}`);
              }
            },
            {
              key: 'edit',
              label: 'Edit',
              icon: <EditOutlined />,
              onClick: () => {
                setEditData(entity);
                setEditOpen(true);
              }
            }
          ]
        }}>
          <Button type="dashed" size='small'>
            <MoreOutlined />
          </Button>
        </Dropdown>,
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
        size="small"
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
      <UserEditForm open={editOpen} onOpenChange={setEditOpen} userId={editData?.id} reload={() => {
        actionRef.current?.reload();
        setEditData(undefined);
      }} />
    </PageContainer>
  );
};

export default UserList;
