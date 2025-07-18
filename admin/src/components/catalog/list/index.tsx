import { CatalogType } from '@/constants';
import { activeCatalog, addCatalog, apiCatalogDeleteRange, deleteCatalog, listCatalog } from '@/services/catalog';
import { DeleteOutlined, EyeOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormInstance,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Link, useIntl } from '@umijs/max';
import { message, Button, Popconfirm, Tooltip, Dropdown, Switch } from 'antd';
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

  const onMoreClick = (e: any, entity: any) => {
    if (e.key === 'view') {
      return;
    }
  }

  const onSwitchChange = async (checked: boolean, id?: string) => {
    const response = await activeCatalog(id);
    if (response.succeeded) {
      message.success(checked ? 'Published' : 'Drafted');
      actionRef.current?.reload();
    } else {
      message.error(response.errors[0].description);
    }
  };

  const columns: ProColumns<API.Catalog>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 30,
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => <Link to={`/catalog/center/${record.id}`}>{text}</Link>,
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
      title: 'Active',
      dataIndex: 'active',
      render: (text, record) => <Switch size='small' checked={record.active} onChange={(checked) => onSwitchChange(checked, record.id)} />,
      width: 50,
      align: 'center',
      valueType: 'select',
      valueEnum: {
        true: 'Published',
        false: 'Drafted',
      }
    },
    {
      title: 'Option',
      valueType: 'option',
      render: (dom, entity) => [
        <Dropdown key="more" menu={{
          items: [
            {
              key: 'view',
              label: 'Xem trước',
              icon: <EyeOutlined />
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
      width: 80
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
        headerTitle={(
          <Button type="primary" onClick={() => setOpen(true)} icon={<PlusOutlined />}>Thêm mới</Button>
        )}
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
        search={{
          layout: "vertical",
        }}
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <Popconfirm key="delete" title="Xác nhận xóa?" onConfirm={onRemoveRange}>
            <Tooltip title="Xóa">
              <button type="button" className='ant-pro-table-list-toolbar-setting-item'>
                <DeleteOutlined />
              </button>
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
