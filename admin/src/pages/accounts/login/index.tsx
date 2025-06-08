import { login } from '@/services/user';
import {
  FacebookFilled,
  GithubFilled,
  GoogleCircleFilled,
  LockOutlined,
  MobileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedHTMLMessage, Link, SelectLang, useIntl } from '@umijs/max';
import { history, useModel } from '@umijs/max';
import { Button, message, Space, Tabs } from 'antd';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import logo from '../../../assets/logo.png';
import '../index.css';
import { Helmet } from '@umijs/max';
import Settings from '../../../../config/defaultSetting';
import '../../../../style.css';
import ForgotPassword from '../components/forgot-password';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [open, setOpen] = useState<boolean>(false);

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const msg = await login({ ...values, type });
      if (!msg.succeeded) {
        return message.error('Login failed!');
      }
      localStorage.setItem('wf_token', msg.token);
      await fetchUserInfo();
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
    } catch (error) {
      message.error('Login failed!');
    }
  };

  return (
    <div className='h-screen'>
      <Helmet>
        <title>{intl.formatMessage({ id: 'menu.login', defaultMessage: 'Login', })} - {Settings.title}</title>
      </Helmet>
      <div className='fixed z-50 right-2 top-2'>
        <SelectLang />
      </div>
      <div className="flex items-center relative h-full">
        <LoginForm
          logo={<img alt="logo" src={logo} />}
          title="Waffle"
          subTitle={intl.formatMessage({ id: 'pages.login.subTitle' })}
          initialValues={{
            autoLogin: true,
          }}
          actions={[
            <div key={2} className="mb-4 text-center text-gray-̀500 text-sm">
              <FormattedHTMLMessage id="pages.login.orLoginWith" />
            </div>,
            <div className="text-center" key={3}>
              <Space align="center">
                <Button icon={<FacebookFilled />} shape='circle' size='large' type='primary'></Button>
                <Button icon={<GoogleCircleFilled />} shape='circle' size='large' type='primary' danger></Button>
                <Button icon={<GithubFilled />} shape='circle' size='large'></Button>
              </Space>
            </div>,
          ]}
          onFinish={async (values) => {
            await handleSubmit(values as any);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({ id: 'pages.login.account', defaultMessage: 'Account' }),
              },
              {
                key: 'mobile',
                label: intl.formatMessage({
                  id: 'general.phoneNumber',
                  defaultMessage: 'Phone number',
                }),
              },
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="Tài khoản"
                rules={[
                  {
                    required: true,
                    message: 'Please input username!'
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password',
                })}
                rules={[
                  {
                    required: true,
                    message: 'Please input password!',
                  },
                ]}
              />
            </>
          )}

          {type === 'mobile' && (
            <>
              <ProFormText
                fieldProps={{
                  size: 'large',
                  prefix: <MobileOutlined />,
                }}
                name="mobile"
                placeholder={intl.formatMessage({
                  id: 'general.phoneNumber',
                  defaultMessage: 'Phone number',
                })}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập số điện thoại',
                  },
                  {
                    pattern: /^1\d{10}$/,
                    message: 'Số điện thoại không hợp lệ',
                  },
                ]}
              />
              <ProFormCaptcha
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined />,
                }}
                captchaProps={{
                  size: 'large',
                }}
                placeholder="Mã xác nhận"
                captchaTextRender={(timing, count) => {
                  if (timing) {
                    return 'Lấy mã + ' + count;
                  }
                  return 'Lấy mã';
                }}
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập mã xác nhận!',
                  },
                ]}
                onGetCaptcha={async (phone) => {
                  message.success('Đã gửi mã xác minh tới: ' + phone);
                }}
              />
            </>
          )}
          <div className='mb-6'>
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedHTMLMessage id="pages.login.rememberMe" />
            </ProFormCheckbox>
            <div className='float-right'>
              <button type='button' onClick={() => setOpen(true)} className='hover:text-blue-500'>
                <FormattedHTMLMessage id="pages.login.forgotPassword" />
              </button>
            </div>
          </div>
        </LoginForm>
      </div>
      <ForgotPassword open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Login;
