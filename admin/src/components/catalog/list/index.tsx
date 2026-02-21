import CatalogForm from '@/components/form/catalog';
import { CatalogType } from '@/constants';
import { activeCatalog, apiCatalogDeleteRange, deleteCatalog, listCatalog } from '@/services/catalog';
import { DeleteOutlined, EyeOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { Link, useParams } from '@umijs/max';
import { message, Button, Popconfirm, Tooltip, Dropdown, Switch } from 'antd';
import React, { useRef, useState } from 'react';

type CatalogListProps = {
  type: CatalogType;
};

const CatalogList: React.FC<CatalogListProps> = (props) => {

  const { id } = useParams();

  const actionRef = useRef<ActionType>();
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
      render: (text, record) => {
        if (id === '5') {
          return <Link to={`/catalog/place/${record.id}`}>{text}</Link>;
        }
        return <Link to={`/catalog/center/${record.id}`}>{text}</Link>;
      },
    },
    {
      title: 'Last updated',
      dataIndex: 'createdDate',
      valueType: 'dateTime',
      search: false,
      sorter: true,
      width: 160
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
      <CatalogForm open={open} onOpenChange={setOpen} reload={() => actionRef.current?.reload()} type={props.type} />
    </div>
  );
};

export default CatalogList;
