import { googleSignIn, login } from '@/services/user';
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
import { FormattedHTMLMessage, SelectLang, useIntl } from '@umijs/max';
import { history, useModel } from '@umijs/max';
import { Button, message, Space, Tabs } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import '../index.css';
import { Helmet } from '@umijs/max';
import Settings from '../../../../config/defaultSetting';
import ForgotPassword from '../components/forgot-password';

const companyName = process.env.COMPANY_NAME || 'DefZone.Net';

const GOOGLE_GSI_SCRIPT = 'https://accounts.google.com/gsi/client';

const loadGoogleGsiScript = () => {
  if ((window as any).google?.accounts?.id) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_GSI_SCRIPT}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Google SDK failed to load.')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = GOOGLE_GSI_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google SDK failed to load.'));
    document.head.appendChild(script);
  });
};

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');
  const [open, setOpen] = useState<boolean>(false);

  const intl = useIntl();

  const fetchUserInfo = useCallback(async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  }, [initialState, setInitialState]);

  const completeLogin = useCallback(async (token: string) => {
    localStorage.setItem('wf_token', token);
    await fetchUserInfo();
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/');
  }, [fetchUserInfo]);

  const handleSubmit = async (values: any) => {
    const msg = await login({ ...values, type });
    if (!msg.succeeded) {
      return message.error('Sai tên đăng nhập hoặc mật khẩu!');
    }
    await completeLogin(msg.token);
  };

  const handleGoogleCredential = useCallback(async (response: any) => {
    if (!response?.credential) {
      message.error('Google credential không hợp lệ');
      return;
    }

    const msg = await googleSignIn(response.credential);
    if (!msg?.succeeded || !msg?.token) {
      message.error('Đăng nhập Google thất bại');
      return;
    }

    await completeLogin(msg.token);
  }, [completeLogin]);

  useEffect(() => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) return;

    loadGoogleGsiScript()
      .then(() => {
        const google = (window as any).google;
        if (!google?.accounts?.id) return;

        google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredential,
        });
      })
      .catch(() => {
        message.error('Không thể tải Google SDK');
      });
  }, [handleGoogleCredential]);

  return (
    <div className='h-screen'>
      <Helmet>
        <title>{intl.formatMessage({ id: 'menu.login', defaultMessage: 'Login', })} - {Settings.title}</title>
      </Helmet>
      <div className='fixed z-50 right-2 top-2'>
        <SelectLang />
      </div>
      <div className="flex items-center relative h-full flex-col justify-center">
        <div>
          <LoginForm
            logo={<img alt="logo" src={`${process.env.API_URL}/imgs/logo-icon.png`} />}
            title={companyName}
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
                  <Button
                    icon={<GoogleCircleFilled />}
                    shape='circle'
                    size='large'
                    type='primary'
                    danger
                    onClick={() => {
                      if (!process.env.GOOGLE_CLIENT_ID) {
                        message.warning('Thiếu GOOGLE_CLIENT_ID');
                        return;
                      }

                      const google = (window as any).google;
                      if (!google?.accounts?.id) {
                        message.error('Google SDK chưa sẵn sàng');
                        return;
                      }

                      google.accounts.id.prompt();
                    }}
                  ></Button>
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
                    if (!phone) {
                      message.warning('Vui lòng nhập số điện thoại');
                      return;
                    }
                    if (!/^1\d{10}$/.test(phone)) {
                      message.error('Số điện thoại không hợp lệ');
                      return;
                    }
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
        <div className='text-sm text-slate-800 text-capitalize'>&copy; 2025 {process.env.COMPANY_NAME}</div>
      </div>
      <ForgotPassword open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Login;
