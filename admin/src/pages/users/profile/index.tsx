import { apiConfirmEmail, getUser } from '@/services/user';
import { InboxOutlined, MessageOutlined, UserAddOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import {
  Image,
  Button,
  Col,
  Empty,
  Row,
  Divider,
  Descriptions,
  Typography,
  Popconfirm,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import ProfileRoles from './role';

const Profile: React.FC = () => {
  const { id } = useParams();
  const [user, setUser] = useState<API.User>();
  const [activeKey, setActiveKey] = useState<string>('activity');

  useEffect(() => {
    getUser(id).then((response) => {
      setUser(response);
    });
  }, [id]);

  const onConfirmEmail = async () => {
    const response = await apiConfirmEmail(id);
    if (response.succeeded) {
      message.success('Saved!');
    }
  }

  return (
    <PageContainer>
      <Row gutter={16}>
        <Col span={6}>
          <ProCard
            title="Profile"
            headerBordered
            actions={[
              <Popconfirm title="Confirm email?" onConfirm={onConfirmEmail}>
                <Button icon={<InboxOutlined />} type='link' />
              </Popconfirm>
            ]}
          >
            <div className="flex items-center justify-center flex-col">
              <div className='mb-4'>
                <Image src={user?.avatar} width={200} height={200} alt='Avatar' className='rounded-full' />
              </div>
              <div className='mb-2'><Typography.Title level={4}>{user?.userName}</Typography.Title></div>
              <div className='flex gap-2 justify-center'>
                <Button type='primary' icon={<UserAddOutlined />}>Follow</Button>
                <Button icon={<MessageOutlined />}>Message</Button>
              </div>
            </div>
            <Divider />
            <Descriptions title="Info" column={1}>
              <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
              <Descriptions.Item label="Phone">
                {user?.phoneNumber}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            {
              user && <ProfileRoles roles={user?.roles} />
            }
          </ProCard>
        </Col>
        <Col span={18}>
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
