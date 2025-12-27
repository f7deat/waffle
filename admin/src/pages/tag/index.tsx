import { PageContainer, ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { Button, message, Modal, Form, Input, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { apiTags, apiTagCreate, apiTagUpdate, apiTagDelete, ITagListItem } from '@/services/tag';

const Index: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<ITagListItem>();
  const [form] = Form.useForm();

  const columns: ProColumns<ITagListItem>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 200,
      search: false,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      formItemProps: {
        rules: [{ required: false }],
      },
    },
    {
      title: 'Actions',
      valueType: 'option',
      width: 150,
      render: (_, record) => [
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={() => {
            setCurrentRow(record);
            form.setFieldsValue(record);
            setEditModalOpen(true);
          }}
        >
          Edit
        </Button>,
        <Popconfirm
          key="delete"
          title="Are you sure you want to delete this tag?"
          onConfirm={async () => {
            try {
              await apiTagDelete(record.id);
              message.success('Tag deleted successfully');
              actionRef.current?.reload();
            } catch (error) {
              message.error('Failed to delete tag');
            }
          }}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            Delete
          </Button>
        </Popconfirm>,
      ],
    },
  ];

  const handleCreate = async (values: { name: string }) => {
    try {
      await apiTagCreate(values);
      message.success('Tag created successfully');
      setCreateModalOpen(false);
      form.resetFields();
      actionRef.current?.reload();
    } catch (error) {
      message.error('Failed to create tag');
    }
  };

  const handleUpdate = async (values: { name: string }) => {
    if (!currentRow) return;
    try {
      await apiTagUpdate({ id: currentRow.id, ...values });
      message.success('Tag updated successfully');
      setEditModalOpen(false);
      form.resetFields();
      actionRef.current?.reload();
    } catch (error) {
      message.error('Failed to update tag');
    }
  };

  return (
    <PageContainer>
      <ProTable<ITagListItem>
        headerTitle="Tags"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setCreateModalOpen(true);
            }}
          >
            New Tag
          </Button>,
        ]}
        request={apiTags}
        columns={columns}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
      />

      {/* Create Modal */}
      <Modal
        title="Create Tag"
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter tag name' }]}
          >
            <Input placeholder="Enter tag name" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Tag"
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please enter tag name' }]}
          >
            <Input placeholder="Enter tag name" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default Index;
