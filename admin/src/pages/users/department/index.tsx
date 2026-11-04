import { apiBranchOptions } from '@/services/hr/branch';
import { Department, DepartmentInput, apiDepartmentCreate, apiDepartmentDelete, apiDepartmentList, apiDepartmentUpdate } from '@/services/hr/department';
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProFormInstance, ProFormSelect, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';

const DepartmentPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [editingDepartment, setEditingDepartment] = useState<Department>();
  const [openForm, setOpenForm] = useState(false);

  const openCreateForm = () => {
    setEditingDepartment(undefined);
    formRef.current?.resetFields();
    setOpenForm(true);
  };

  const openEditForm = (department: Department) => {
    setEditingDepartment(department);
    formRef.current?.setFieldsValue(department);
    setOpenForm(true);
  };

  const onFinish = async (values: DepartmentInput) => {
    try {
      if (editingDepartment) {
        await apiDepartmentUpdate(editingDepartment.id, values);
        message.success('Cập nhật phòng ban thành công');
      } else {
        await apiDepartmentCreate(values);
        message.success('Tạo phòng ban thành công');
      }
      setOpenForm(false);
      actionRef.current?.reload();
      return true;
    } catch {
      return false;
    }
  };

  const deleteDepartment = async (id: number) => {
    try {
      await apiDepartmentDelete(id);
      message.success('Xóa phòng ban thành công');
      actionRef.current?.reload();
    } catch {
      message.error('Không thể xóa phòng ban');
    }
  };

  const columns: ProColumns<Department>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: 'Tên phòng ban',
      dataIndex: 'name',
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branchId',
      valueType: 'select',
      request: apiBranchOptions,
    },
    {
      title: <SettingOutlined />,
      valueType: 'option',
      width: 92,
      align: 'center',
      render: (_, department) => [
        <Button key="edit" type="primary" size="small" icon={<EditOutlined />} onClick={() => openEditForm(department)} />,
        <Popconfirm
          key="delete"
          title="Bạn có chắc muốn xóa phòng ban này?"
          onConfirm={() => deleteDepartment(department.id)}
        >
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Department>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={apiDepartmentList}
        search={{ layout: 'vertical' }}
        headerTitle={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
            Thêm phòng ban
          </Button>
        }
      />
      <ModalForm<DepartmentInput>
        formRef={formRef}
        open={openForm}
        title={editingDepartment ? 'Sửa phòng ban' : 'Thêm phòng ban'}
        layout="vertical"
        onOpenChange={(visible) => {
          setOpenForm(visible);
          if (!visible) {
            setEditingDepartment(undefined);
            formRef.current?.resetFields();
          }
        }}
        onFinish={onFinish}
      >
        <ProFormText
          name="name"
          label="Tên phòng ban"
          rules={[{ required: true, message: 'Vui lòng nhập tên phòng ban' }]}
        />
        <ProFormSelect
          name="branchId"
          label="Chi nhánh"
          request={apiBranchOptions}
          rules={[{ required: true, message: 'Vui lòng chọn chi nhánh' }]}
        />
      </ModalForm>
    </PageContainer>
  );
};

export default DepartmentPage;
