import { getTelegramUpdates, testTelegram } from "@/services/setting";
import { ProCard, ProForm, ProFormText, ProFormTextArea } from "@ant-design/pro-components";
import { Row, Col, message, Button } from "antd";
import { useEffect, useState } from "react";
import { SettingProps } from "./typing";

const TelegramSettings: React.FC<SettingProps> = ({ value }) => {

    const form = ProForm.useFormInstance();

    useEffect(() => {
        form.setFieldsValue({
            token: value?.token || '',
            chatId: value?.chatId || ''
        });
    }, [value]);

    const [updates, setUpdates] = useState<any>();

    const onTest = async (values: any) => {
        const response = await testTelegram(values);
        if (response.succeeded) {
            message.success('Sended');
        } else {
            message.error(response.errors[0].description)
        }
    };

    const onGetUpdates = async () => {
        const response = await getTelegramUpdates();
        setUpdates(response.data);
    }

    return (
        <div>
            <Row gutter={16}>
                <Col span={24}>
                    <ProCard>
                        <ProFormText.Password
                            name="token"
                            label="Token"
                            tooltip="The token is a string, like 110201543:AAHdqTcvCH1vGWJxfSeofSAs0K5PALDsaw, which is required to authorize the bot and send requests to the Bot API. Keep your token secure and store it safely, it can be used by anyone to control your bot"
                        />
                        <ProFormText name="chatId" label="Chat ID" />
                    </ProCard>
                </Col>
                <Col span={24}>
                    <ProCard title="Updates">
                        <Button type="primary" onClick={onGetUpdates}>Get Updates</Button>
                        <pre>{JSON.stringify(updates, null, 2)}</pre>
                    </ProCard>
                </Col>
                <Col span={24}>
                    <ProCard title="Test">
                        <ProForm onFinish={onTest}>
                            <ProFormTextArea
                                name="message"
                                label="Message"
                                rules={[
                                    {
                                        required: true,
                                    },
                                ]}
                            />
                        </ProForm>
                    </ProCard>
                </Col>
            </Row>
        </div>
    )
}

export default TelegramSettings;