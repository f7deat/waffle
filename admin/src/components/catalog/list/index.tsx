import { CatalogType } from '@/constants';
import { activeCatalog, addCatalog, apiCatalogDeleteRange, deleteCatalog, listCatalog } from '@/services/catalog';
import { DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined, SendOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { useIntl } from '@umijs/max';
import { history } from '@umijs/max';
import { message, Button, Popconfirm, Tooltip, Dropdown } from 'antd';
import React, { useRef, useState } from 'react';

type CatalogListProps = {
  type?: CatalogType;
};

const CatalogList: React.FC<CatalogListProps> = (props) => {
  const intl = useIntl();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const onConfirm = async (id?: string) => {
    const response = await deleteCatalog(id);
    if (response.succeeded) {
      message.success('Deleted');
      actionRef.current?.reload();
    } else {
      message.error(response.errors[0].description);
    }
  };

  const url = () => {
    switch (props.type) {
      case CatalogType.Tag:
        return 'catalog/tag';

      default:
        return 'catalog';
    }
  };

  const onMoreClick = (e: any, entity: any) => {
    if (e.key === 'edit') {
      history.push(`/${url()}/${entity.id}`)
      return;
    }
    if (e.key === 'publish') {
      activeCatalog(entity.id).then(response => {
        if (response.succeeded) {
          message.success(entity.active ? 'Drafted' : 'Published');
          actionRef.current?.reload();
        }
      })
    }
  }

  const columns: ProColumns<API.Catalog>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 50
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Created date',
      dataIndex: 'createdDate',
      valueType: 'fromNow',
      search: false,
      sorter: true,
      width: 180
    },
    {
      title: 'Modified date',
      dataIndex: 'modifiedDate',
      valueType: 'fromNow',
      search: false,
      sorter: true,
      width: 180
    },
    {
      title: 'View',
      dataIndex: 'viewCount',
      valueType: 'digit',
      search: false,
      sorter: true,
      width: 100
    },
    {
      title: 'Status',
      dataIndex: 'active',
      valueEnum: {
        false: {
          text: 'Draft',
          status: 'Default',
        },
        true: {
          text: 'Active',
          status: 'Processing',
        },
      },
      width: 100
    },
    {
      title: 'Option',
      valueType: 'option',
      render: (dom, entity) => [
        <Dropdown key="more" menu={{
          items: [
            {
              key: 'edit',
              label: 'Edit',
              icon: <EditOutlined />
            },
            {
              key: 'publish',
              label: entity.active ? 'Draft' : 'Publish',
              icon: <SendOutlined />
            }
          ], onClick: (event) => onMoreClick(event, entity)
        }}>
          <Button type='dashed' size='small' icon={<MoreOutlined />} />
        </Dropdown>,
        <Popconfirm
          title="Are you sure?"
          key={2}
          onConfirm={() => onConfirm(entity.id)}
        >
          <Button
            size='small'
            type="primary" icon={<DeleteOutlined />} danger />
        </Popconfirm>
      ],
      width: 100
    },
  ];

  const onFinish = async (values: API.Catalog) => {
    values.type = Number(values.type);
    const response = await addCatalog(values);
    if (response.succeeded) {
      formRef.current?.resetFields();
      message.success('Added!');
      actionRef.current?.reload();
      setOpen(false);
    }
  };

  const onRemoveRange = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Vui lòng chọn dòng cần xóa!');
      return;
    }
    await apiCatalogDeleteRange(selectedRowKeys);
    message.success('Xóa thành công!');
    actionRef.current?.reload();
  }

  return (
    <div>
      <ProTable
        ghost
        rowSelection={{
          onChange: (selectedRowKeys) => setSelectedRowKeys(selectedRowKeys)
        }}
        onSubmit={(params) => console.log(params)}
        rowKey="id"
        request={(params, sort) =>
          listCatalog({
            ...params,
            type: props.type
          }, sort)
        }
        pagination={{
          defaultPageSize: 10
        }}
        search={{
          layout: "vertical",
        }}
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Tooltip key="new" title="Thêm mới">
            <Button type="text" onClick={() => setOpen(true)} icon={<PlusOutlined />} />
          </Tooltip>,
          <Popconfirm key="delete" title="Xác nhận xóa?" onConfirm={onRemoveRange}>
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        ]}
      />
      <ModalForm
        formRef={formRef}
        open={open}
        onOpenChange={setOpen}
        onFinish={onFinish}
        title={intl.formatMessage({
          id: 'general.new',
        })}
      >
        <ProFormText
          name="name"
          label="Name"
          rules={[
            {
              required: true,
            },
          ]}
        />
        <ProFormText name='type' initialValue={props.type} hidden />
        <ProFormTextArea label="Description" name="description" rules={[
          {
            required: true
          }
        ]} />
        <ProFormText name="locale" initialValue={intl.locale} hidden />
      </ModalForm>
    </div>
  );
};

export default CatalogList;
