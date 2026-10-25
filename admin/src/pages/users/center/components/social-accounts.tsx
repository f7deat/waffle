import { apiSocialPlatformList, SocialPlatform } from '@/services/social-platform';
import {
  apiGetUserSocialAccounts,
  apiUpdateUserSocialAccounts,
  UserSocialAccount,
  UserSocialAccountInput,
} from '@/services/user';
import {
  ProCard,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components';
import { useParams } from '@umijs/max';
import { message } from 'antd';
import { useEffect, useRef, useState } from 'react';

type SocialAccountFormValue = {
  socialPlatformId: string;
  profileUrl?: string;
  followersCount?: number;
  isVerified: boolean;
};

type SocialAccountsFormValues = {
  socialAccounts: SocialAccountFormValue[];
};

type SocialAccountsData = {
  platforms: SocialPlatform[];
  accounts: UserSocialAccount[];
};

const SocialAccounts: React.FC = () => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance<SocialAccountsFormValues> | undefined>(undefined);
  const [data, setData] = useState<SocialAccountsData>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      setData(undefined);
      setLoading(false);
      message.error('Không xác định được người dùng.');
      return;
    }

    let cancelled = false;
    setData(undefined);
    setLoading(true);
    Promise.all([apiSocialPlatformList(), apiGetUserSocialAccounts(id)])
      .then(([platformResult, accounts]) => {
        if (!cancelled) setData({ platforms: platformResult.data, accounts });
      })
      .catch(() => {
        if (!cancelled) message.error('Không thể tải thông tin mạng xã hội');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    if (!data) return;

    const accountsByPlatform = new Map(
      data.accounts.map((account) => [account.socialPlatformId, account]),
    );
    formRef.current?.setFieldsValue({
      socialAccounts: data.platforms.map((platform) => {
        const account = accountsByPlatform.get(platform.id);
        return {
          socialPlatformId: platform.id,
          profileUrl: account?.profileUrl ?? undefined,
          followersCount: account?.followersCount ?? undefined,
          isVerified: account?.isVerified ?? false,
        };
      }),
    });
  }, [data]);

  const onFinish = async (values: SocialAccountsFormValues) => {
    if (!id || !data) return false;

    const accounts: UserSocialAccountInput[] = (values.socialAccounts ?? []).flatMap(
      (account) => {
        const profileUrl = account.profileUrl?.trim();
        return profileUrl
          ? [
              {
                socialPlatformId: account.socialPlatformId,
                profileUrl,
                followersCount: account.followersCount,
                isVerified: account.isVerified,
              },
            ]
          : [];
      },
    );

    try {
      await apiUpdateUserSocialAccounts(id, accounts);
      message.success('Cập nhật thông tin mạng xã hội thành công');
      return true;
    } catch {
      message.error('Không thể cập nhật thông tin mạng xã hội');
      return false;
    }
  };

  return (
    <ProForm<SocialAccountsFormValues>
      formRef={formRef}
      loading={loading}
      onFinish={onFinish}
      submitter={data ? undefined : false}
    >
      {data?.platforms.map((platform, index) => (
        <ProCard key={platform.id} title={platform.name} bordered style={{ marginBottom: 16 }}>
          <ProFormText name={['socialAccounts', index, 'socialPlatformId']} hidden />
          <ProFormText
            name={['socialAccounts', index, 'profileUrl']}
            label="Đường dẫn trang cá nhân"
            fieldProps={{ maxLength: 1000 }}
            rules={[
              { max: 1000, message: 'Đường dẫn không được vượt quá 1000 ký tự' },
              {
                type: 'url',
                message: 'Vui lòng nhập URL đầy đủ, bắt đầu bằng http:// hoặc https://',
              },
              {
                pattern: /^https?:\/\//i,
                message: 'URL phải bắt đầu bằng http:// hoặc https://',
              },
            ]}
          />
          <ProFormDigit
            name={['socialAccounts', index, 'followersCount']}
            label="Số người theo dõi"
            min={0}
            fieldProps={{ precision: 0 }}
          />
          <ProFormSwitch
            name={['socialAccounts', index, 'isVerified']}
            label="Đã xác minh"
          />
        </ProCard>
      ))}
    </ProForm>
  );
};

export default SocialAccounts;
