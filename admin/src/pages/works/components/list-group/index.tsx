import { ActionType, DragSortTable, ModalForm, ProColumns, ProForm, ProFormInstance, ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { Button, Divider, Popconfirm, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { FormattedMessage } from '@umijs/max';
import { uuidv4 } from '@/utils/common';
import { AbstractBlock } from '@/typings/work';
import { apiGetCatalogTypes, apiGetUrlOption } from '@/services/catalog';
import { CatalogType } from '@/constants';

const ListGroup: React.FC<AbstractBlock> = ({ data }) => {
  const [dataTable, setDataTable] = useState<CPN.ListGroupItem[]>();
  const formRef = ProForm.useFormInstance<ProFormInstance>();
  const modalFormRef = useRef<ProFormInstance>();
  const [catalogOptions, setCatalogOptions] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<CatalogType>(CatalogType.Default);

  useEffect(() => {
    setDataTable(data?.items);
    formRef.setFields([
      {
        name: 'name' as any,
        value: data?.name
      }
    ])
  }, [data]);

  useEffect(() => {
    apiGetUrlOption({ type: selectedType }).then(response => setCatalogOptions(response));
  }, [selectedType]);

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

      <ModalForm open={open} onOpenChange={setOpen} title="Thêm mới" onFinish={addLink} formRef={modalFormRef}>
        <ProFormText name="name" label="Name" />
        <ProFormSelect name="type" label="Type" request={apiGetCatalogTypes} showSearch onChange={(value, option) => {
          setSelectedType(value as CatalogType);
        }} />
        <ProFormSelect name="href" label="Catalog" options={catalogOptions} showSearch onChange={(value, option) => {
          modalFormRef.current?.setFieldValue('name', option?.label);
        }} />
      </ModalForm>
    </>
  );
};

export default ListGroup;
