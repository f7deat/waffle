import { login } from '@/services/user';
import {
  FacebookFilled,
  GithubFilled,
  GoogleCircleFilled,
  LockOutlined,
  MobileOutlined,
  PlusOutlined,
  SelectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedHTMLMessage, Link, SelectLang, useIntl } from '@umijs/max';
import { history, useModel } from '@umijs/max';
import { Button, Divider, Input, InputRef, message, Space, Tabs } from 'antd';
import React, { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import logo from '../../../assets/logo.png';
import '../index.css';
import { Helmet } from '@umijs/max';
import Settings from '../../../../config/defaultSetting';
import '../../../../style.css';

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [endPoints, setEndPoints] = useState<string[]>(localStorage.getItem('wfEndPoints') ? localStorage.getItem('wfEndPoints')?.split(',') || [] : []);
  const [endPoint, setEndPoint] = useState('');
  const inputRef = useRef<InputRef>(null);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndPoint(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    if (!endPoint) {
      message.warning('URL is required!');
      return;
    }
    if (endPoints.includes(endPoint)) {
      message.warning('URL existed!');
      return;
    }
    const newEndPoints = [...endPoints, endPoint];
    setEndPoints(newEndPoints);
    localStorage.setItem('wfEndPoints', newEndPoints.join(','));
    setEndPoint('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

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
      localStorage.setItem('wf_URL', values.baseURL);
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
    <div className='h-full'>
      <Helmet>
        <title>{intl.formatMessage({ id: 'menu.login', defaultMessage: 'Login', })} - {Settings.title}</title>
      </Helmet>
      <div className='fixed' style={{
        left: 10,
        top: 10
      }}>
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
            <div key={2} className="mb-4 text-center">
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
              <ProFormSelect
                name="baseURL"
                fieldProps={{
                  size: 'large',
                  suffixIcon: <SelectOutlined />,
                  options: endPoints.map((item) => ({ label: item, value: item })),
                  dropdownRender: (menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: '8px 0' }} />
                      <div className='flex gap-2'>
                        <Input
                          placeholder="Please enter item"
                          ref={inputRef}
                          onChange={onNameChange}
                          onKeyDown={(e) => e.stopPropagation()}
                          className='w-full'
                          value={endPoint}
                        />
                        <Button type="text" icon={<PlusOutlined />} onClick={addItem} />
                      </div>
                    </>
                  )
                }}
                placeholder="Website url"
              />
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined />,
                }}
                placeholder="Email"
                rules={[
                  {
                    required: true,
                    message: 'Please input email!',
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
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedHTMLMessage id="pages.login.rememberMe" />
            </ProFormCheckbox>
            <div
              style={{
                float: 'right',
              }}
            >
              <Link to="#">
                <FormattedHTMLMessage id="pages.login.forgotPassword" />
              </Link>
            </div>
          </div>
        </LoginForm>
      </div>
    </div>
  );
};

export default Login;
