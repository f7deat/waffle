import { googleSignIn, login } from '@/services/user';
import {
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
import { Button, message, Tabs } from 'antd';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import '../index.less';
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
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const hasGoogleClientId = Boolean(googleClientId && !googleClientId.includes('Your Google Client Id'));

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
    if (!hasGoogleClientId) return;

    loadGoogleGsiScript()
      .then(() => {
        const google = (window as any).google;
        if (!google?.accounts?.id) return;

        google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCredential,
        });

        if (googleButtonRef.current) {
          google.accounts.id.renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            width: 348,
          });
        }
      })
      .catch(() => {
        message.error('Không thể tải Google SDK');
      });
  }, [googleClientId, handleGoogleCredential, hasGoogleClientId]);

  return (
    <div className="login-page">
      <Helmet>
        <title>{intl.formatMessage({ id: 'menu.login', defaultMessage: 'Login' })} - {Settings.title}</title>
      </Helmet>
      <header className="login-header">
        <div className="login-header-inner">
          <a className="login-brand" href="/" aria-label={companyName}>
            <span className="login-brand-mark"><UserOutlined /></span>
            <span className="login-brand-copy">
              <strong>{companyName}</strong>
              <small>CMS quản trị nội dung</small>
            </span>
          </a>
          <div className="login-header-actions">
            <span className="login-system-status">
              <span className="login-status-dot" />
              Cổng quản trị
            </span>
            <SelectLang />
          </div>
        </div>
      </header>

      <main className="login-main">
        <div className="login-shell">
          <section className="login-brand-panel">
            <div className="login-brand-decoration login-brand-decoration-top" />
            <div className="login-brand-decoration login-brand-decoration-bottom" />
            <div className="login-brand-content">
              <div className="login-brand-kicker">Không gian làm việc nội bộ</div>
              <div className="login-brand-heading">
                <span>{companyName}</span>
                <strong>CMS</strong>
              </div>
              <p className="login-brand-description">
                Nền tảng quản trị và xuất bản nội dung, được thiết kế để hỗ trợ đội ngũ vận hành
                công việc hằng ngày.
              </p>

              <div className="login-feature-card">
                <div className="login-feature-heading">
                  <span className="login-feature-icon"><LockOutlined /></span>
                  <span>
                    <strong>Bảo vệ tài khoản</strong>
                    <small>Đăng nhập an toàn, có kiểm soát</small>
                  </span>
                </div>
                <div className="login-feature-divider" />
                <p>
                  Chỉ sử dụng tài khoản được cấp. Không chia sẻ thông tin đăng nhập và mã xác thực
                  với bất kỳ ai.
                </p>
              </div>

              <blockquote className="login-quote">
                <span className="login-quote-mark">“</span>
                <p>Thông tin chính xác bắt đầu từ quy trình biên tập có trách nhiệm.</p>
                <footer>{companyName} · Editorial workspace</footer>
              </blockquote>
            </div>
            <div className="login-brand-footer">
              <span><span className="login-status-dot" /> Khu vực dành cho nhân sự được cấp quyền</span>
              <span>CMS / INTERNAL</span>
            </div>
          </section>

          <section className="login-form-panel">
            <LoginForm
              title={false}
              logo={false}
              subTitle={false}
              initialValues={{ autoLogin: true }}
              submitter={{ searchConfig: { submitText: 'Đăng nhập vào hệ thống' } }}
              onFinish={async (values) => {
                await handleSubmit(values as any);
              }}
            >
              <div className="login-form-content">
                <div className="login-form-heading">
                  <div className="login-form-eyebrow">
                    <LockOutlined />
                    <span>Cổng xác thực nội bộ</span>
                  </div>
                  <h1>Đăng nhập hệ thống</h1>
                  <p>Nhập thông tin tài khoản được cấp để tiếp tục.</p>
                </div>

                <div className="login-sso-section">
                  <div className="login-google-button" ref={googleButtonRef}>
                    {!hasGoogleClientId && (
                      <Button block icon={<GoogleCircleFilled />} disabled>
                        Google SSO chưa được cấu hình
                      </Button>
                    )}
                  </div>
                  <div className="login-divider">
                    <span>Hoặc đăng nhập bằng tài khoản CMS</span>
                  </div>
                </div>

                <Tabs
                  className="login-tabs"
                  activeKey={type}
                  onChange={setType}
                  items={[
                    {
                      key: 'account',
                      label: intl.formatMessage({ id: 'pages.login.account', defaultMessage: 'Tài khoản' }),
                    },
                    {
                      key: 'mobile',
                      label: intl.formatMessage({
                        id: 'general.phoneNumber',
                        defaultMessage: 'Số điện thoại',
                      }),
                    },
                  ]}
                />

                {type === 'account' && (
                  <>
                    <div className="login-field-label">Tên đăng nhập</div>
                    <ProFormText
                      name="username"
                      fieldProps={{
                        size: 'large',
                        prefix: <UserOutlined />,
                        placeholder: 'Nhập tên đăng nhập',
                      }}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập tên đăng nhập',
                        },
                      ]}
                    />
                    <div className="login-field-label login-password-label">
                      <span>Mật khẩu</span>
                      <button type="button" onClick={() => setOpen(true)}>
                        <FormattedHTMLMessage id="pages.login.forgotPassword" />
                      </button>
                    </div>
                    <ProFormText.Password
                      name="password"
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined />,
                        placeholder: 'Nhập mật khẩu',
                      }}
                      rules={[
                        {
                          required: true,
                          message: 'Vui lòng nhập mật khẩu',
                        },
                      ]}
                    />
                  </>
                )}

                {type === 'mobile' && (
                  <>
                    <div className="login-field-label">Số điện thoại</div>
                    <ProFormText
                      fieldProps={{
                        size: 'large',
                        prefix: <MobileOutlined />,
                        placeholder: intl.formatMessage({
                          id: 'general.phoneNumber',
                          defaultMessage: 'Nhập số điện thoại',
                        }),
                      }}
                      name="mobile"
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
                    <div className="login-field-label">Mã xác nhận</div>
                    <ProFormCaptcha
                      fieldProps={{
                        size: 'large',
                        prefix: <LockOutlined />,
                      }}
                      captchaProps={{ size: 'large' }}
                      placeholder="Nhập mã xác nhận"
                      captchaTextRender={(timing, count) => (timing ? `Lấy mã + ${count}` : 'Lấy mã')}
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

                <div className="login-options">
                  <ProFormCheckbox noStyle name="autoLogin">
                    <FormattedHTMLMessage id="pages.login.rememberMe" />
                  </ProFormCheckbox>
                  {type === 'mobile' && (
                    <button type="button" onClick={() => setOpen(true)}>
                      <FormattedHTMLMessage id="pages.login.forgotPassword" />
                    </button>
                  )}
                </div>

                <div className="login-security-note">
                  <span className="login-security-icon"><LockOutlined /></span>
                  <span>
                    <strong>Bảo mật tài khoản của bạn</strong>
                    <small>Không chia sẻ mật khẩu hoặc mã xác thực với người khác.</small>
                  </span>
                </div>
              </div>
            </LoginForm>

            <div className="login-legal">
              © {new Date().getFullYear()} {companyName}. Bản quyền được bảo lưu.
            </div>
          </section>
        </div>
      </main>

      <footer className="login-footer">
        <span>{companyName} · Nền tảng quản trị nội dung</span>
        <span>Đăng nhập an toàn vào không gian làm việc của bạn</span>
      </footer>
      <ForgotPassword open={open} onOpenChange={setOpen} />
    </div>
  );
};

export default Login;
