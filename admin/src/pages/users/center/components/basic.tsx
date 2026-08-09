import { apiGetUser, apiUpdateUser } from "@/services/user"
import { ProForm, ProFormDatePicker, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { useParams, useRequest } from "@umijs/max"
import { Col, message, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

const Basic: React.FC = () => {

    const { id } = useParams();
    const formRef = useRef<ProFormInstance | undefined>(undefined);

    const { data, loading } = useRequest(() => apiGetUser(id));

    useEffect(() => {
        if (data) {
            formRef.current?.setFields([
                {
                    name: 'id',
                    value: data.id
                },
                {
                    name: 'name',
                    value: data.name
                },
                {
                    name: 'dateOfBirth',
                    value: data.dateOfBirth ? dayjs(data.dateOfBirth) : undefined
                },
                {
                    name: 'gender',
                    value: data.gender
                }
            ])
        }
    }, [data]);

    const onFinish = async (values: any) => {
        await apiUpdateUser(values);
        message.success('Lưu thành công!');
    }

    return (
        <ProForm loading={loading} onFinish={onFinish} formRef={formRef}>
            <ProFormText name="id" hidden />
            <ProFormText name="name" label="Họ và tên" rules={[
                {
                    required: true
                }
            ]} />
            <Row gutter={16}>
                <Col md={6}>
                    <ProFormDatePicker name="dateOfBirth" label="Ngày sinh" width="xl" />
                </Col>
                <Col md={18}>
                    <ProFormSelect name="gender" label="Giới tính" options={[
                        {
                            label: 'Nam',
                            value: false
                        },
                        {
                            label: 'Nữ',
                            value: true
                        }
                    ]} />
                </Col>
            </Row>
        </ProForm>
    )
}
export default Basic