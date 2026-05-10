import { ProLayoutProps } from '@ant-design/pro-components';

const companyName = process.env.COMPANY_NAME || 'DefZone.Net';

const defaultSettings: ProLayoutProps = {
  navTheme: 'light',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  title: companyName
};

export default defaultSettings;