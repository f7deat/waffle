import { apiDepartmentOptions } from '@/services/hr/department';
import { Team, TeamInput, apiTeamCreate, apiTeamDelete, apiTeamList, apiTeamUpdate } from '@/services/hr/team';
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProFormInstance, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';

const TeamPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [editingTeam, setEditingTeam] = useState<Team>();
  const [openForm, setOpenForm] = useState(false);

  const openCreateForm = () => {
    setEditingTeam(undefined);
    formRef.current?.resetFields();
    setOpenForm(true);
  };

  const openEditForm = (team: Team) => {
    setEditingTeam(team);
    formRef.current?.setFieldsValue(team);
    setOpenForm(true);
  };

  const onFinish = async (values: TeamInput) => {
    try {
      if (editingTeam) {
        await apiTeamUpdate(editingTeam.id, values);
        message.success('Cập nhật nhóm thành công');
      } else {
        await apiTeamCreate(values);
        message.success('Tạo nhóm thành công');
      }
      setOpenForm(false);
      actionRef.current?.reload();
      return true;
    } catch {
      return false;
    }
  };

  const deleteTeam = async (id: number) => {
    try {
      await apiTeamDelete(id);
      message.success('Xóa nhóm thành công');
      actionRef.current?.reload();
    } catch {
      message.error('Không thể xóa nhóm');
    }
  };

  const columns: ProColumns<Team>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: 'Tên nhóm',
      dataIndex: 'name',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'departmentId',
      valueType: 'select',
      request: apiDepartmentOptions,
    },
    {
      title: <SettingOutlined />,
      valueType: 'option',
      width: 92,
      align: 'center',
      render: (_, team) => [
        <Button key="edit" type="primary" size="small" icon={<EditOutlined />} onClick={() => openEditForm(team)} />,
        <Popconfirm
          key="delete"
          title="Bạn có chắc muốn xóa nhóm này?"
          onConfirm={() => deleteTeam(team.id)}
        >
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Team>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={apiTeamList}
        search={{ layout: 'vertical' }}
        headerTitle={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
            Thêm nhóm
          </Button>
        }
      />
      <ModalForm<TeamInput>
        formRef={formRef}
        open={openForm}
        title={editingTeam ? 'Sửa nhóm' : 'Thêm nhóm'}
        layout="vertical"
        onOpenChange={(visible) => {
          setOpenForm(visible);
          if (!visible) {
            setEditingTeam(undefined);
            formRef.current?.resetFields();
          }
        }}
        onFinish={onFinish}
      >
        <ProFormText
          name="name"
          label="Tên nhóm"
          rules={[{ required: true, message: 'Vui lòng nhập tên nhóm' }]}
        />
        <ProFormSelect
          name="departmentId"
          label="Phòng ban"
          request={apiDepartmentOptions}
          rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TeamPage;
