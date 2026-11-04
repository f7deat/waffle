import { apiTeamAddMember, apiTeamGet, apiTeamMemberList, apiTeamRemoveMember, TeamMember } from '@/services/hr/team';
import { listUser } from '@/services/user';
import { DeleteOutlined, PlusOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProFormSelect, ProTable } from '@ant-design/pro-components';
import { history, useParams, useRequest } from '@umijs/max';
import { Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';

const TeamMembersPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const teamId = Number(id);
  const actionRef = useRef<ActionType>(null);
  const [openForm, setOpenForm] = useState(false);
  const { data: teamResponse } = useRequest(() => apiTeamGet(teamId), { ready: Number.isInteger(teamId) });
  const team = teamResponse?.data;

  const addMember = async ({ userId }: { userId: string }) => {
    const response = await apiTeamAddMember(teamId, userId);
    if (!response.succeeded) {
      message.error(response.message || 'Không thể thêm thành viên');
      return false;
    }
    message.success('Thêm thành viên thành công');
    setOpenForm(false);
    actionRef.current?.reload();
    return true;
  };

  const removeMember = async (userId: string) => {
    const response = await apiTeamRemoveMember(teamId, userId);
    if (!response.succeeded) {
      message.error(response.message || 'Không thể gỡ thành viên');
      return;
    }
    message.success('Đã gỡ thành viên khỏi Team');
    actionRef.current?.reload();
  };

  const columns: ProColumns<TeamMember>[] = [
    { title: '#', valueType: 'indexBorder', width: 48, align: 'center' },
    { title: <UserOutlined />, dataIndex: 'avatar', valueType: 'avatar', width: 56, search: false },
    { title: 'Tài khoản', dataIndex: 'userName' },
    { title: 'Họ tên', dataIndex: 'name', renderText: (value) => value || '-' },
    { title: 'Email', dataIndex: 'email', renderText: (value) => value || '-' },
    { title: 'Số điện thoại', dataIndex: 'phoneNumber', renderText: (value) => value || '-' },
    {
      title: <SettingOutlined />,
      valueType: 'option',
      width: 64,
      align: 'center',
      render: (_, member) => [
        <Popconfirm key="remove" title="Bạn có chắc muốn gỡ thành viên này?" onConfirm={() => removeMember(member.id)}>
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      title={team?.name ? `Thành viên: ${team.name}` : 'Thành viên Team'}
      onBack={() => history.back()}
      extra={<Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>Thêm thành viên</Button>}
    >
      <ProTable<TeamMember>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={(params) => apiTeamMemberList(teamId, params)}
        search={{ layout: 'vertical' }}
      />
      <ModalForm<{ userId: string }>
        open={openForm}
        title="Thêm thành viên"
        layout="vertical"
        onOpenChange={setOpenForm}
        onFinish={addMember}
      >
        <ProFormSelect
          name="userId"
          label="Người dùng"
          showSearch
          request={async ({ keyWords }) => {
            const response = await listUser({ name: keyWords });
            return response.data.map((user: any) => ({
              label: `${user.userName} - ${user.name || 'Chưa cập nhật tên'}`,
              value: user.id,
            }));
          }}
          rules={[{ required: true, message: 'Vui lòng chọn người dùng' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TeamMembersPage;