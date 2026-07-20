import { apiChangeAvatar, apiConfirmEmail, apiGetUser } from '@/services/user';
import { EditOutlined, LoadingOutlined, MessageOutlined, UploadOutlined, UserAddOutlined } from '@ant-design/icons';
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
  message,
  Alert,
  Modal,
} from 'antd';
import { useRef, useState } from 'react';
import ProfileRoles from './role';
import ResetPassword from './components/reset-password';

const Profile: React.FC = () => {
  const { id } = useParams();
  const [activeKey, setActiveKey] = useState<string>('activity');
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string>();
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data, refresh } = useRequest(() => apiGetUser(id), {
    refreshDeps: [id],
  });

  const onConfirmEmail = async () => {
    const response = await apiConfirmEmail(id);
    if (response.succeeded) {
      message.success('Saved!');
    }
  };

  const onAvatarButtonClick = () => {
    if (isAvatarUploading) {
      return;
    }

    fileInputRef.current?.click();
  };

  const closeAvatarModal = () => {
    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setAvatarModalOpen(false);
    setAvatarPreviewUrl(undefined);
    setSelectedAvatarFile(undefined);
  };

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';

    if (!file || !id) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      message.error('Vui lòng chọn file hình ảnh hợp lệ.');
      return;
    }

    if (avatarPreviewUrl) {
      URL.revokeObjectURL(avatarPreviewUrl);
    }

    setSelectedAvatarFile(file);
    setAvatarPreviewUrl(URL.createObjectURL(file));
    setAvatarModalOpen(true);
  };

  const onConfirmAvatarUpload = async () => {
    if (!selectedAvatarFile || !id) {
      return;
    }

    const formData = new FormData();
    formData.append('userId', id);
    formData.append('file', selectedAvatarFile);

    setIsAvatarUploading(true);

    try {
      const response = await apiChangeAvatar(formData);
      if (!response?.succeeded) {
        message.error(response?.message || 'Đổi avatar thất bại.');
        return;
      }

      message.success('Đổi avatar thành công.');
      await refresh();
      closeAvatarModal();
    } catch (error: any) {
      message.error(error?.data?.message || error?.message || 'Đổi avatar thất bại.');
    } finally {
      setIsAvatarUploading(false);
    }
  };

  return (
    <PageContainer onBack={() => history.back()}>
      <Row gutter={16}>
        <Col span={6}>
          <ProCard
            title="Profile"
            headerBordered
            actions={[
              <Link to={`/user/center/${id}`}>
                <EditOutlined /> Chỉnh sửa
              </Link>
            ]}
          >
            <div className="flex items-center justify-center flex-col">
              <div className='mb-4 relative'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className='hidden'
                  onChange={onAvatarChange}
                />
                <Button
                  icon={isAvatarUploading ? <LoadingOutlined /> : <UploadOutlined />}
                  size='small'
                  type='text'
                  className='absolute right-0 z-10'
                  loading={isAvatarUploading}
                  onClick={onAvatarButtonClick}
                />
                <Image src={data?.avatar} width={200} height={200} alt='Avatar' className='rounded-full' />
              </div>
              <div className='mb-4 text-center'>
                <div className='text-lg font-semibold'>{data?.name}</div>
                <div className='text-sm text-gray-500'>{data?.userName}</div>
              </div>
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
          {!data?.emailConfirmed && (
            <Alert message={(
              <div>Bạn chưa xác thực email, vui lòng kiểm tra email để xác thực tài khoản của bạn. <span className='font-semibold cursor-pointer' onClick={onConfirmEmail}>Gửi lại email xác thực?</span></div>
            )} type="warning" showIcon className='mb-4' />
          )}
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
              {
                label: 'Reset Password',
                key: 'reset-password',
                children: <ResetPassword />,
              }
            ],
            onChange: (key) => {
              setActiveKey(key);
            },
          }}>
            <Empty />
          </ProCard>
        </Col>
      </Row>
      <Modal
        title='Xác nhận avatar mới'
        open={avatarModalOpen}
        okText='Cập nhật avatar'
        cancelText='Hủy'
        confirmLoading={isAvatarUploading}
        onCancel={closeAvatarModal}
        onOk={onConfirmAvatarUpload}
      >
        <div className='flex flex-col items-center gap-4'>
          <Image
            preview={false}
            src={avatarPreviewUrl}
            width={220}
            height={220}
            alt='Avatar preview'
            className='rounded-full object-cover'
          />
          <div className='text-center text-sm text-gray-500'>
            {selectedAvatarFile?.name}
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default Profile;
