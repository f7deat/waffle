import {
  activeWork,
  addItem,
  addWorkContent,
  deleteWorkContent,
  listWork,
  listWorkContent,
  sortWork,
} from '@/services/work-content';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  MoreOutlined
} from '@ant-design/icons';
import {
  DragSortTable,
  ModalForm,
  ProColumns,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { Button, Dropdown, MenuProps, message, Popconfirm, Switch } from 'antd';
import { FormattedMessage, history, Link } from '@umijs/max';
import { useParams } from '@umijs/max';
import { useEffect, useState } from 'react';
import AddComponent from '../add-component';
import React from 'react';

const WorkContentComponent: React.FC = () => {
  const { id } = useParams();
  const [dataSource, setDataSource] = useState<API.WorkItem[]>([]);

  const [visible, setVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<any>();

  const fetchData = () => {
    listWorkContent(id).then(response => {
      setDataSource(response.data)
    })
  }

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const onConfirm = async (workId?: string) => {
    const response = await deleteWorkContent(workId, id);
    if (response.succeeded) {
      message.success('Deleted!');
      fetchData();
    } else {
      message.error(response.errors[0].description);
    }
  };

  const onFinish = async (value: any) => {
    value.catalogId = id;
    const response = await addWorkContent(value);
    if (response.succeeded) {
      message.success('Added!');
      setVisible(false);
      fetchData();
    }
  };

  const onSelect = async () => {
    const response = await listWork();
    setOptions(response);
    setOpen(true);
  };

  const addWorkItem = async (values: API.WorkItem) => {
    const response = await addItem(values);
    if (response.succeeded) {
      message.success('Saved');
      setOpen(false);
      fetchData();
    }
  };

  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />
    }
  ];

  const onMoreClick = async (event: any, entity: any) => {
    if (event.key === '1') {
      const resposne = await activeWork(entity.id);
      if (resposne.succeeded) {
        message.success('Actived!');
        fetchData();
      }
    }
    if (event.key === 'edit') {
      onGoToBlock(entity)
    }
  }

  const onGoToBlock = (entity: any) => {
    history.push(`/works/${entity.id}`);
  }

  const onActive = async (entity: API.WorkItem) => {
    await activeWork(entity.id);
    message.success('Actived!');
    fetchData();
  }

  const columns: ProColumns<API.WorkItem>[] = [
    {
      title: '#',
      dataIndex: 'sort',
      className: 'drag-visible',
      width: 20,
      align: 'center'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (dom, entity) => (
        <Link to={`/works/${entity.id}`} className='font-semibold text-blue-500 hover:text-blue-700'>
          {dom}
        </Link>
      )
    },
    {
      title: 'Status',
      dataIndex: 'active',
      width: 60,
      render: (_, entity) => <Switch size='small' checked={entity.active} onChange={() => onActive(entity)} />,
      align: 'center'
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (dom, entity) => [
        <Dropdown menu={{ items, onClick: (event) => onMoreClick(event, entity) }} key="more">
          <Button icon={<MoreOutlined />} type='dashed' size='small' />
        </Dropdown>,
        <Popconfirm
          title="Are you sure?"
          key={4}
          onConfirm={() => onConfirm(entity.id)}
        >
          <Button
            size='small'
            icon={<DeleteOutlined />}
            danger
            type="primary"
          ></Button>
        </Popconfirm>
      ],
      width: 50
    }
  ];

  const handleDragSortEnd = (beforeIndex: number, afterIndex: number, newDataSource: API.WorkItem[]) => {
    const workIds = newDataSource.map(x => (x.id || ''));
    sortWork(workIds).then(response => {
      if (response.succeeded) {
        setDataSource(newDataSource);
        message.success('Saved!');
      }
    })
  };

  return (
    <>
      <DragSortTable<API.WorkItem>
        ghost
        headerTitle={(
          <div className='mb-2 flex justify-end gap-2'>
            <Button
              key={0}
              onClick={() => setVisible(true)}
              type="primary"
              icon={<PlusOutlined />}
            >
              <span>
                <FormattedMessage id="general.new" />
              </span>
            </Button>
            <Button key={1} onClick={onSelect} icon={<PlusOutlined />}>
              Chọn
            </Button>
          </div>
        )}
        search={false}
        rowKey="id"
        columns={columns}
        pagination={false}
        dataSource={dataSource}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd}
      />
      <AddComponent
        open={visible}
        onOpenChange={setVisible}
        onFinish={onFinish}
      />
      <ModalForm open={open} onOpenChange={setOpen} onFinish={addWorkItem}>
        <ProFormText name="catalogId" initialValue={id} hidden />
        <ProFormSelect
          showSearch
          name="workContentId"
          options={options}
          label="Work"
        />
      </ModalForm>
    </>
  );
};

export default WorkContentComponent;
