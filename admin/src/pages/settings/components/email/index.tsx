import { ProForm, ProFormDigit, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { SettingProps } from "../../typings";
import { Col, Row } from "antd";
import { useEffect, useRef } from "react";

export const EmailSetting: React.FC<SettingProps> = ({ onFinish, data }) => {

    const formRef = useRef<ProFormInstance>();
    useEffect(() => {
        formRef.current?.setFields([
            {
                name: 'protocol',
                value: data?.protocol
            },
            {
                name: 'displayName',
                value: data?.displayName
            },
            {
                name: 'fromEmail',
                value: data?.fromEmail
            },
            {
                name: 'host',
                value: data?.host
            },
            {
                name: 'port',
                value: data?.port
            },
            {
                name: 'password',
                value: data?.password
            }
        ])
    }, [data]);

    return (
        <>
            <ProForm onFinish={onFinish} formRef={formRef}>
                <ProFormSelect name="protocol" label="Protocol" options={[
                    {
                        label: 'Default',
                        value: 0
                    },
                    {
                        label: 'SendGrid',
                        value: 1
                    }
                ]} initialValue={0} rules={[
                    {
                        required: true
                    }
                ]} allowClear={false} />
                <Row gutter={16}>
                    <Col md={12} xs={12}>
                        <ProFormText name="displayName" label="Display name" rules={[
                            {
                                required: true
                            }
                        ]} />
                    </Col>
                    <Col md={12} xs={12}>
                        <ProFormText name="fromEmail" label="From email" rules={[
                            {
                                required: true
                            },
                            {
                                type: 'email'
                            }
                        ]} />
                    </Col>
                    <Col span={10}>
                        <ProFormText name="host" label="Host" rules={[
                            {
                                required: true
                            }
                        ]} />
                    </Col>
                    <Col span={4}>
                        <ProFormDigit name="port" label="Port" rules={[
                            {
                                required: true
                            }
                        ]} />
                    </Col>
                    <Col span={10}>
                        <ProFormText.Password name="password" label="Password" rules={[
                            {
                                required: true
                            }
                        ]} />
                    </Col>
                </Row>
            </ProForm>
        </>
    )
}

export default EmailSetting;