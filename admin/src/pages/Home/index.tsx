import { dataPieChart } from '@/services/catalog';
import { PageContainer, ProCard, ProForm, ProFormDateRangePicker, ProList } from '@ant-design/pro-components';
import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import TopView from './components/top-view';
import { apiGetReportActivity } from '@/services/report';
import Revenue from './components/revenue';
import ViewCount from './components/view-count';
import Order from './components/order';
import Lead from './components/lead';
import { Column, Pie } from '@ant-design/charts';

const HomePage: React.FC = () => {
  const [dataPie, setDataPie] = useState<any>([]);
  const [dataActivities, setDataActivities] = useState<any[]>([]);

  useEffect(() => {
    dataPieChart().then(response => {
      setDataPie(response);
    });
    apiGetReportActivity().then(response => setDataActivities(response));
  }, []);

  return (
    <PageContainer>
      <div className='grid grid-cols-1 md:grid-cols-4 mb-4 gap-4'>
        <Revenue />
        <ViewCount />
        <Order />
        <Lead />
      </div>
      <ProCard title="Hoạt động" headerBordered className='mb-4' extra={
        (
          <ProForm submitter={false}>
            <ProFormDateRangePicker
              name="dateRange"
              initialValue={[new Date(new Date().setDate(new Date().getDate() - 30)), new Date()]}
              formItemProps={{
                className: 'mb-0'
              }}
              allowClear={false}
              fieldProps={{
                autoFocus: false,
                variant: 'filled'
              }}
            />
          </ProForm>
        )
      }>
        <div className='md:flex gap-4 mb-4'>
          <div className='flex-1'>
            <Column
              xField="month"
              yField='value'
              data={dataActivities}
              autoFit
              height={400}
              sizeField={60}
            />
          </div>
          <div className='md:w-1/4'>
            <ProList
              headerTitle="Bảng đóng góp"
              ghost
              dataSource={[
                {
                  name: 'Đinh Công Tân',
                  count: 100,
                },
                {
                  name: 'Nguyễn Văn A',
                  count: 80,
                },
                {
                  name: 'Trần Thị B',
                  count: 60,
                },
                {
                  name: 'Lê Văn C',
                  count: 40,
                },
              ]}
              metas={{
                avatar: {
                  valueType: 'indexBorder',
                },
                title: {
                  dataIndex: 'name',
                },
                actions: {
                  render: (text, row) => [
                    <a key="view">{row.count}</a>
                  ],
                }
              }}
            />
          </div>
        </div>
      </ProCard>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ProCard title="Catalogs" headerBordered className='mb-4'>
            <Pie
              angleField='value'
              colorField='label'
              radius={1}
              innerRadius={0.55}
              data={dataPie} />
          </ProCard>
          
        </Col>
        <Col span={12}>
          <TopView />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
