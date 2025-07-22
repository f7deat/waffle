import { apiConfirmEmail, apiGetUser } from '@/services/user';
import { EditOutlined, InboxOutlined, LeftOutlined, MessageOutlined, UserAddOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Link, useParams, useRequest } from '@umijs/max';
import {
  Image,
  Button,
  Col,
  Empty,
  Row,
  Divider,
  Descriptions,
  Typography,
  message,
  Alert,
} from 'antd';
import { useState } from 'react';
import ProfileRoles from './role';

const Profile: React.FC = () => {
  const { id } = useParams();
  const [activeKey, setActiveKey] = useState<string>('activity');
  const { data } = useRequest(() => apiGetUser(id));

  const onConfirmEmail = async () => {
    const response = await apiConfirmEmail(id);
    if (response.succeeded) {
      message.success('Saved!');
    }
  }

  return (
    <PageContainer extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}>Back</Button>} title={data?.name}>
      <Row gutter={16}>
        <Col span={6}>
          <ProCard
            title="Profile"
            headerBordered
            actions={[
              <Link to={`/users/center/${id}`}>
                <EditOutlined /> Chỉnh sửa
              </Link>
            ]}
          >
            <div className="flex items-center justify-center flex-col">
              <div className='mb-4 relative'>
                <Button icon={<EditOutlined />} size='small' type='text' className='absolute right-0 z-10' />
                <Image src={data?.avatar} width={200} height={200} alt='Avatar' className='rounded-full' />
              </div>
              <div className='mb-2'><Typography.Title level={4}>{data?.userName}</Typography.Title></div>
              <div className='flex gap-2 justify-center'>
                <Button type='primary' icon={<UserAddOutlined />}>Follow</Button>
                <Button icon={<MessageOutlined />}>Message</Button>
              </div>
            </div>
            <Divider />
            <Descriptions title="Info" column={1}>
              <Descriptions.Item label="Email">{data?.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">
                {data?.phoneNumber}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            {
              data && <ProfileRoles roles={data?.roles} />
            }
          </ProCard>
        </Col>
        <Col span={18}>
          <Alert message={(
            <div>Bạn chưa xác thực email, vui lòng kiểm tra email để xác thực tài khoản của bạn. <span className='font-semibold cursor-pointer' onClick={onConfirmEmail}>Gửi lại email xác thực?</span></div>
          )} type="warning" showIcon className='mb-4' />
          <ProCard tabs={{
            tabPosition: 'top',
            activeKey: activeKey,
            items: [
              {
                label: 'Activity',
                key: 'activity',
                children: <Empty />,
              },
              {
                label: 'Follower',
                key: 'follower',
                children: <Empty />,
              },
            ],
            onChange: (key) => {
              setActiveKey(key);
            },
          }}>
            <Empty />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default Profile;
