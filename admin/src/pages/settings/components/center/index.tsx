import {
  getComponent,
  listComponentWork,
  updateComponent,
} from '@/services/component';
import { deleteWork } from '@/services/work-content';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
  ActionType,
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormCheckbox,
  ProFormInstance,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { useParams, history } from '@umijs/max';
import { Button, Col, message, Popconfirm, Row } from 'antd';
import { useEffect, useRef, useState } from 'react';

const ComponentCenter: React.FC = () => {
  const { id } = useParams();
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();

  const [component, setComponent] = useState<API.Component>();
  useEffect(() => {
    getComponent(id).then((response) => {
      setComponent(response);
      formRef.current?.setFields([
        {
          name: 'id',
          value: response.id,
        },
        {
          name: 'name',
          value: response.name,
        },
        {
          name: 'normalizedName',
          value: response.normalizedName,
        },
        {
          name: 'active',
          value: response.active,
        },
      ]);
    });
  }, []);

  const onConfirm = async (id?: string) => {
    const response = await deleteWork(id);
    if (response.succeeded) {
      message.success('Deleted!');
      actionRef.current?.reload();
    }
  };

  const columns: ProColumns<API.WorkItem>[] = [
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
      title: 'Active',
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
      title: '',
      valueType: 'option',
      render: (dom, entity) => [
        <Button
          icon={<EditOutlined />}
          key={1} size='small'
          type="primary"
          onClick={() =>
            history.push(`/works/${entity.normalizedName}/${entity.id}`)
          }
        ></Button>,
        <Popconfirm
          title="Are you sure?"
          key={3}
          onConfirm={() => onConfirm(entity.id)}
        >
          <Button icon={<DeleteOutlined />} type="primary" danger size='small' />
        </Popconfirm>,
      ],
      width: 80
    },
  ];

  const onFinish = async (values: API.Component) => {
    const response = await updateComponent(values);
    if (response.succeeded) {
      message.success('Saved');
    }
  };

  return (
    <PageContainer title={component?.name}>
      <Row gutter={16}>
        <Col span={16}>
          <ProTable
            search={{
              layout: 'vertical'
            }}
            actionRef={actionRef}
            columns={columns}
            rowKey="id"
            request={(params) => listComponentWork(params, id)}
          />
        </Col>
        <Col span={8}>
          <ProCard title="Info">
            <ProForm formRef={formRef} onFinish={onFinish}>
              <ProFormText name="id" hidden />
              <ProFormText label="Name" name="name" />
              <ProFormText label="Normalized name" name="normalizedName" tooltip="Do not changes!" />
              <ProFormCheckbox label="Active" name="active" />
            </ProForm>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default ComponentCenter;
