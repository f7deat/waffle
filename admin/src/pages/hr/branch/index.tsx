import { Branch, BranchInput, apiBranchCreate, apiBranchDelete, apiBranchList, apiBranchUpdate } from '@/services/hr/branch';
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { ActionType, ModalForm, PageContainer, ProColumns, ProFormInstance, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm, message } from 'antd';
import { useRef, useState } from 'react';

const BranchPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [editingBranch, setEditingBranch] = useState<Branch>();
  const [openForm, setOpenForm] = useState(false);

  const openCreateForm = () => {
    setEditingBranch(undefined);
    formRef.current?.resetFields();
    setOpenForm(true);
  };

  const openEditForm = (branch: Branch) => {
    setEditingBranch(branch);
    formRef.current?.setFieldsValue(branch);
    setOpenForm(true);
  };

  const onFinish = async (values: BranchInput) => {
    try {
      if (editingBranch) {
        await apiBranchUpdate(editingBranch.id, values);
        message.success('Cập nhật chi nhánh thành công');
      } else {
        await apiBranchCreate(values);
        message.success('Tạo chi nhánh thành công');
      }
      setOpenForm(false);
      actionRef.current?.reload();
      return true;
    } catch {
      return false;
    }
  };

  const deleteBranch = async (id: number) => {
    try {
      await apiBranchDelete(id);
      message.success('Xóa chi nhánh thành công');
      actionRef.current?.reload();
    } catch {
      message.error('Không thể xóa chi nhánh');
    }
  };

  const columns: ProColumns<Branch>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 48,
      align: 'center',
    },
    {
      title: 'Tên chi nhánh',
      dataIndex: 'name',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      search: false,
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      search: false,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      search: false,
    },
    {
      title: <SettingOutlined />,
      valueType: 'option',
      width: 92,
      align: 'center',
      render: (_, branch) => [
        <Button key="edit" type="primary" size="small" icon={<EditOutlined />} onClick={() => openEditForm(branch)} />,
        <Popconfirm
          key="delete"
          title="Bạn có chắc muốn xóa chi nhánh này?"
          onConfirm={() => deleteBranch(branch.id)}
        >
          <Button type="primary" danger size="small" icon={<DeleteOutlined />} />
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<Branch>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        request={apiBranchList}
        search={{ layout: 'vertical' }}
        headerTitle={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateForm}>
            Thêm chi nhánh
          </Button>
        }
      />
      <ModalForm<BranchInput>
        formRef={formRef}
        open={openForm}
        title={editingBranch ? 'Sửa chi nhánh' : 'Thêm chi nhánh'}
        layout="vertical"
        onOpenChange={(visible) => {
          setOpenForm(visible);
          if (!visible) {
            setEditingBranch(undefined);
            formRef.current?.resetFields();
          }
        }}
        onFinish={onFinish}
      >
        <ProFormText
          name="name"
          label="Tên chi nhánh"
          rules={[{ required: true, message: 'Vui lòng nhập tên chi nhánh' }]}
        />
        <ProFormText name="address" label="Địa chỉ" />
        <ProFormText name="phone" label="Điện thoại" />
        <ProFormText name="email" label="Email" rules={[{ type: 'email', message: 'Email không hợp lệ' }]} />
      </ModalForm>
    </PageContainer>
  );
};

export default BranchPage;
