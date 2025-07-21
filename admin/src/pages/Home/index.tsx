import { dataPieChart, queryViewCount } from '@/services/catalog';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Col, Row, Statistic } from 'antd';
import { ColumnChart, PieChart } from 'bizcharts';
import { useEffect, useState } from 'react';
import TopView from './components/top-view';
import { apiGetReportActivity } from '@/services/report';
import Revenue from './components/revenue';
import ViewCount from './components/view-count';
import Order from './components/order';
import Lead from './components/lead';

const HomePage: React.FC = () => {
  const [viewCount, setViewCount] = useState<number>(0);
  const [dataPie, setDataPie] = useState<any>([]);
  const [dataActivities, setDataActivities] = useState<any[]>([]);

  useEffect(() => {
    queryViewCount().then((response) => {
      setViewCount(response);
    });
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
      <ProCard title="Hoạt động" headerBordered className='mb-4'>
        <div className='md:flex gap-4 mb-4'>
          <div className='flex-1'>
            <ColumnChart
              xField="month"
              yField='value'
              data={dataActivities}
              autoFit
            />
          </div>
          <div className='md:w-1/4'>

          </div>
        </div>
      </ProCard>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <ProCard title="Catalogs" headerBordered className='mb-4'>
            <PieChart
              angleField='value'
              colorField='label'
              radius={1}
              innerRadius={0.55}
              data={dataPie} />
          </ProCard>
          <TopView />
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HomePage;
