import { saveArguments } from '@/services/work-content';
import { ActionType, DragSortTable, ProColumns, ProForm, ProFormInstance, ProFormText } from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { Button, Divider, Popconfirm, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import ModalLink from '@/components/modals/link';
import { FormattedMessage } from '@umijs/max';
import { uuidv4 } from '@/utils/common';
import { AbstractBlock } from '@/typings/work';

const ListGroup: React.FC<AbstractBlock> = ({ data }) => {
  const { id } = useParams();
  const [dataTable, setDataTable] = useState<CPN.ListGroupItem[]>();
  const formRef = ProForm.useFormInstance<ProFormInstance>();

  useEffect(() => {
    setDataTable(data?.items);
    formRef.setFields([
      {
        name: 'name' as any,
        value: data?.name
      }
    ])
  }, [data]);

  const actionRef = useRef<ActionType>();
  const [open, setOpen] = useState<boolean>(false);

  const onConfirm = async (itemId?: string) => {
    if (dataTable) {
      const items = dataTable.filter((x: any) => x.id !== itemId);
      setDataTable(items);
      formRef.setFieldValue('items' as any, items);
      message.success('Deleted!');
      actionRef.current?.reload();
    }
  };

  const addLink = async (values: any) => {
    let newData = dataTable || [];
    let item = {
      id: uuidv4(),
      link: {
        href: values.href,
        name: values.name,
        target: values.target,
        id: uuidv4()
      }
    }
    newData.push(item);
    setDataTable(newData);
    formRef.setFieldValue('items' as any, newData);
    message.success('Added!')
    setOpen(false);
  };

  const columns: ProColumns<CPN.ListGroupItem>[] = [
    {
      title: '#',
      dataIndex: 'sort',
      className: 'drag-visible',
      width: 20
    },
    {
      title: 'Name',
      render: (dom, entity) => entity.link?.name
    },
    {
      title: 'Url',
      render: (dom, entity) => entity.link?.href
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (_, entity) => [
        <Button
          key={1}
          type="primary"
          icon={<EditOutlined />} size='small'
        />,
        <Popconfirm
          title="Are you sure?"
          key={4}
          onConfirm={() => onConfirm(entity.id)}
        >
          <Button
            icon={<DeleteOutlined />}
            danger
            type="primary" size='small'
          ></Button>
        </Popconfirm>
      ],
      width: 60
    }
  ];

  const handleDragSortEnd = (beforeIndex: number, afterIndex: number, newDataSource: CPN.ListGroupItem[]) => {
    formRef.setFieldValue('items' as any, newDataSource);
    setDataTable(newDataSource)
    message.success('Saved!');
  };

  return (
    <>
      <ProFormText name="name" label="Name" rules={[
        {
          required: true
        }
      ]} />
      <ProFormText name='items' hidden />
      <DragSortTable<CPN.ListGroupItem>
        headerTitle={<Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        ><FormattedMessage id="general.new" />
        </Button>}
        rowKey="id"
        ghost
        columns={columns}
        dataSource={dataTable}
        pagination={false}
        search={false}
        dragSortKey="sort"
        onDragSortEnd={handleDragSortEnd}
      />
      <Divider dashed />

      <ModalLink open={open} onOpenChange={setOpen} onFinish={addLink} />
    </>
  );
};

export default ListGroup;
