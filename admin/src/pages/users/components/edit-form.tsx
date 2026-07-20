import { apiGetUser, apiUpdateUser } from "@/services/user";
import { GENDER_OPTIONS } from "@/utils/constants";
import { DrawerForm, DrawerFormProps, ProFormDatePicker, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { Col, message, Row } from "antd";
import { useEffect, useRef } from "react";

type Props = DrawerFormProps & {
    userId?: string;
    reload?: () => void;
}

const UserEditForm: React.FC<Props> = ({ userId, reload, ...rest }) => {

    const formRef = useRef<ProFormInstance>(null);

    useEffect(() => {
        if (userId) {
            apiGetUser(userId).then((response) => {
                formRef.current?.setFieldsValue(response.data);
            });
        }
    }, [userId]);

    const onFinish = async (values: any) => {
        await apiUpdateUser(values);
        message.success('Cập nhật thành công');
        reload?.();
        return true;
    }

    return (
        <DrawerForm {...rest} onFinish={onFinish} title="Chỉnh sửa thành viên" formRef={formRef} drawerProps={{ destroyOnHidden: true }}>
            <ProFormText name="id" hidden />
            <ProFormText
                name="name"
                label="Name"
                rules={[
                    {
                        required: true,
                    },
                ]}
            />
            <Row gutter={16}>
                <Col span={12}>
                    <ProFormDatePicker name="dateOfBirth" label="Ngày sinh" width="lg" />
                </Col>
                <Col span={12}>
                    <ProFormSelect name="gender" label="Gender" options={GENDER_OPTIONS} />
                </Col>
                <Col span={12}>
                    <ProFormText name="email" label="Email" />
                </Col>
                <Col span={12}>
                    <ProFormText name="phoneNumber" label="Phone Number" />
                </Col>
            </Row>
        </DrawerForm>
    )
}

export default UserEditForm;