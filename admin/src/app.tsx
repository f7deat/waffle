import { RequestConfig } from '@umijs/max';
import '../style.css';
import logo from './assets/logo.png';
import { queryCurrentUser } from './services/user';
import { history } from '@umijs/max';
import { RunTimeLayoutConfig } from '@umijs/max';
import { DefaultFooter } from '@ant-design/pro-components';
import { GithubOutlined, LinkOutlined } from '@ant-design/icons';
import { SelectLang } from '@umijs/max';
import { AvatarDropdown, Question } from './components';
import { Space, message } from 'antd';
import { errorConfig } from './requestErrorConfig';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/accounts/login';

export async function getInitialState(): Promise<{
  avatar?: string;
  name?: string;
  currentUser?: API.User;
  fetchUserInfo?: () => Promise<API.User | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      return await queryCurrentUser();
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  const { location } = history;
  if (location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      name: currentUser?.userName,
      avatar: currentUser?.avatar,
      currentUser: currentUser,
    };
  }
  return {
    fetchUserInfo,
    name: '@umijs/max',
  };
}
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    logo: logo,
    menu: {
      locale: true,
    },
    layout: 'mix',
    waterMarkProps: {
      content: initialState?.currentUser?.userName
    },
    token: {
        sider: {
          colorMenuBackground: '#020617',
          colorBgMenuItemHover: '#1677ff',
          colorTextMenu: '#FFFFFF',
          colorTextMenuSelected: '#FFFFFF',
          colorTextMenuItemHover: '#FFFFFF',
          colorTextMenuActive: '#FFFFFF',
          colorBgMenuItemSelected: '#1677ff',
          colorTextMenuSecondary: '#FFFFFF',
          colorTextMenuTitle: '#FFFFFF',
        }
    },
    footerRender: () => (
      <DefaultFooter copyright="Produced by Waffle Financial Experience Department" links={[
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/f7deat/waffle',
          blankTarget: true,
        },
        {
          key: 'Waffle',
          title: 'Waffle',
          href: 'https://github.com/f7deat/waffle',
          blankTarget: true,
        },
      ]} />
    ),
    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    rightContentRender: () => (
      <Space>
        <Question key="doc" />
        <SelectLang key="SelectLang" />
        <AvatarDropdown menu />
      </Space>
    ),
    links: isDev
      ? [
        <a key="openapi" href="https://waffleverse.gitbook.io/api/" target="_blank" rel="noreferrer">
          <LinkOutlined />
          <span>OpenAPI Docs</span>
        </a>,
      ]
      : []
  };
};

export const request: RequestConfig = {
  baseURL: 'https://shinecgialai.com.vn/api/',
  ...errorConfig,
  responseInterceptors: [
    (response: any) => {
      return response;
    },
  ],
  errorConfig: {
    errorHandler: error => {
      message.error(error.message)
    }
  }
};
