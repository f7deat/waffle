import { apiGetSetting, saveSetting } from "@/services/setting";
import { PageContainer, ProCard } from "@ant-design/pro-components"
import { FormattedMessage, history, useParams, useRequest } from "@umijs/max";
import { Button, Empty, message } from "antd";
import Footer from "../footer";
import { LeftOutlined } from "@ant-design/icons";
import EmailSetting from "../components/email";
import GoogleSetting from "../google";

const SettingCenterPage: React.FC = () => {

    const { id } = useParams();
    const { data, refresh } = useRequest(() => apiGetSetting(id));

    const onFinish = async (values: any) => {
      const response = await saveSetting(id, values);
      if (response.succeeded) {
        message.success('Saved!');
        refresh();
      }
    };

    const renderContent = () => {
        if (!data) return <Empty />
        if (data.normalizedName === 'Footer') {
            return <Footer data={data.data} onFinish={onFinish} />
        }
        if (data.normalizedName === 'EmailSetting') {
            return <EmailSetting data={data.data} onFinish={onFinish} />
        }
        if (data.normalizedName === 'Google') {
            return <GoogleSetting data={data.data} onFinish={onFinish} />
        }
        return <Empty />
    }

    return (
        <PageContainer title={data?.name} extra={<Button icon={<LeftOutlined />} onClick={() => history.back()}><FormattedMessage id='general.back' /></Button>}>
            <ProCard title={<FormattedMessage id='menu.settings' />} headerBordered>
                {renderContent()}
            </ProCard>
        </PageContainer>
    )
}

export default SettingCenterPage;