import { listSetting, saveLayoutHead } from '@/services/setting';
import { EditOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
  ProColumns,
  ProForm,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { Button, Col, message, Row } from 'antd';

const SettingPage: React.FC = () => {
  const intl = useIntl();

  const columns: ProColumns<API.AppSetting>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 30
    },
    {
      title: 'name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      search: false
    },
    {
      title: 'Option',
      valueType: 'option',
      render: (dom, entity) => [
        <Button
          size='small'
          icon={<EditOutlined />}
          key={1}
          onClick={() =>
            history.push(
              `/settings/${entity.normalizedName.toLocaleLowerCase()}/${entity.id
              }`,
            )
          }
        ></Button>,
      ],
      width: 40
    },
  ];

  const onFinish = async (values: any) => {
    const response = await saveLayoutHead(values);
    if (response.succeeded) {
      message.success('Saved!');
    }
  };

  return (
    <PageContainer
      title={intl.formatMessage({
        id: 'menu.settings',
      })}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProTable
            search={{
              layout: 'vertical'
            }}
            request={listSetting} rowKey="id" columns={columns} />
        </Col>
        <Col span={12}>
          <ProCard>
            <ProForm onFinish={onFinish}>
              <ProFormText name="address" label="Address" />
              <ProFormText name="phoneNumber" label="PhoneNumber" />
              <ProFormText name="email" label="Email" />
            </ProForm>
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default SettingPage;
