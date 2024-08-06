import { dataPieChart, queryViewCount } from '@/services/catalog';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Col, Row, Statistic } from 'antd';
import { ColumnChart, PieChart } from 'bizcharts';
import { useEffect, useState } from 'react';
import TopView from './components/top-view';
import { apiGetReportActivity } from '@/services/report';

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
      <Row gutter={16}>
        <Col span={16}>
          <ProCard title="Hoạt động" headerBordered>
            <ColumnChart 
            xField="month"
            yField='value'
            data={dataActivities}
            />
          </ProCard>
        </Col>
        <Col span={8}>
          <Row gutter={16} className='mb-4'>
            <Col span={12}>
              <ProCard>
                <Statistic title="Lượt xem" value={viewCount} />
              </ProCard>
            </Col>
            <Col span={12}>
              <ProCard>
                <Statistic title="Bài viết" value={0} />
              </ProCard>
            </Col>
          </Row>
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
