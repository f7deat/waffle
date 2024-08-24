import { listSetting } from '@/services/setting';
import { EditOutlined } from '@ant-design/icons';
import {
  PageContainer,
  ProColumns,
  ProTable,
} from '@ant-design/pro-components';
import { history, useIntl } from '@umijs/max';
import { Button, Col, message, Row } from 'antd';

const SettingPage: React.FC = () => {

  const columns: ProColumns<API.AppSetting>[] = [
    {
      title: '#',
      valueType: 'indexBorder',
      width: 40,
      align: 'center'
    },
    {
      title: 'Name',
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
          type='primary'
          onClick={() =>
            history.push(
              `/settings/general/center/${entity.id
              }`,
            )
          }
        ></Button>,
      ],
      width: 40
    },
  ];

  return (
    <PageContainer>
      <ProTable
        search={{
          layout: 'vertical'
        }}
        request={listSetting} rowKey="id" columns={columns} />
    </PageContainer>
  );
};

export default SettingPage;
