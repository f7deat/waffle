import { apiBranchList } from '@/services/hr/branch';
import { apiDepartmentList } from '@/services/hr/department';
import { apiTeamList } from '@/services/hr/team';
import { ApartmentOutlined, ReloadOutlined, TeamOutlined } from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { Button, Col, message, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';

type HrStatistics = {
  branchCount: number;
  departmentCount: number;
  teamCount: number;
};

const emptyStatistics: HrStatistics = {
  branchCount: 0,
  departmentCount: 0,
  teamCount: 0,
};

const getTotal = (response: any) => {
  const payload = response?.data ?? response?.Data ?? response;
  return Number(payload?.total ?? payload?.Total ?? 0);
};

const HrStatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [statistics, setStatistics] = useState<HrStatistics>(emptyStatistics);

  const loadStatistics = async () => {
    setLoading(true);
    try {
      const [branchResponse, departmentResponse, teamResponse] = await Promise.all([
        apiBranchList({ current: 1, pageSize: 1 }),
        apiDepartmentList({ current: 1, pageSize: 1 }),
        apiTeamList({ current: 1, pageSize: 1 }),
      ]);

      setStatistics({
        branchCount: getTotal(branchResponse),
        departmentCount: getTotal(departmentResponse),
        teamCount: getTotal(teamResponse),
      });
    } catch {
      message.error('Không thể tải thống kê nhân sự.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatistics();
  }, []);

  return (
    <PageContainer
      title='Thống kê nhân sự'
      extra={<Button icon={<ReloadOutlined />} loading={loading} onClick={loadStatistics}>Làm mới</Button>}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <ProCard loading={loading}>
            <Statistic title='Chi nhánh' value={statistics.branchCount} prefix={<ApartmentOutlined />} />
          </ProCard>
        </Col>
        <Col xs={24} md={8}>
          <ProCard loading={loading}>
            <Statistic title='Phòng ban' value={statistics.departmentCount} prefix={<ApartmentOutlined />} />
          </ProCard>
        </Col>
        <Col xs={24} md={8}>
          <ProCard loading={loading}>
            <Statistic title='Team - Nhóm' value={statistics.teamCount} prefix={<TeamOutlined />} />
          </ProCard>
        </Col>
      </Row>
    </PageContainer>
  );
};

export default HrStatisticsPage;