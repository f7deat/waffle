import { apiGetUser, apiUpdateUser } from "@/services/user";
import { GENDER_OPTIONS } from "@/utils/constants";
import { apiDistrictOptions } from "@/services/locations/district";
import { apiTeamOptions } from "@/services/hr/team";
import {
    DrawerForm,
    DrawerFormProps,
    ProFormDatePicker,
    ProFormDateTimePicker,
    ProFormDigit,
    ProFormInstance,
    ProFormSelect,
    ProFormSwitch,
    ProFormText,
    ProFormTextArea,
} from "@ant-design/pro-components"
import { Col, message, Row } from "antd";
import { useEffect, useRef } from "react";
import dayjs from "dayjs";

type Props = DrawerFormProps & {
    userId?: string;
    reload?: () => void;
}

const UserEditForm: React.FC<Props> = ({ userId, reload, ...rest }) => {

    const formRef = useRef<ProFormInstance>(null);

    useEffect(() => {
        if (userId) {
            apiGetUser(userId).then((response) => {
                formRef.current?.setFieldsValue({
                    ...response.data,
                    createdAt: response.data.createdAt
                        ? dayjs(response.data.createdAt).format('YYYY-MM-DD HH:mm')
                        : '',
                    dateOfBirth: response.data.dateOfBirth
                        ? dayjs(response.data.dateOfBirth)
                        : undefined,
                    lockoutEnd: response.data.lockoutEnd
                        ? dayjs(response.data.lockoutEnd)
                        : undefined,
                });
            });
        }
    }, [userId]);

    const onFinish = async (values: any) => {
        const response = await apiUpdateUser(values);
        if (!response.succeeded) {
            message.error(response.message || 'Không thể cập nhật thông tin người dùng');
            return false;
        }
        message.success('Cập nhật thành công');
        reload?.();
        return true;
    }

    return (
        <DrawerForm {...rest} onFinish={onFinish} title="Chỉnh sửa thành viên" formRef={formRef} drawerProps={{ destroyOnHidden: true }}>
            <ProFormText name="id" hidden />
            <ProFormText name="createdAt" label="Ngày tạo" disabled />
            <ProFormText
                name="userName"
                label="Tên đăng nhập"
                fieldProps={{ maxLength: 256 }}
                rules={[{ required: true }]}
            />
            <ProFormText
                name="name"
                label="Họ và tên"
                fieldProps={{ maxLength: 256 }}
                rules={[{ required: true }]}
            />
            <Row gutter={16}>
                <Col span={12}>
                    <ProFormDatePicker name="dateOfBirth" label="Ngày sinh" width="lg" />
                </Col>
                <Col span={12}>
                    <ProFormSelect name="gender" label="Giới tính" options={GENDER_OPTIONS} />
                </Col>
                <Col span={12}>
                    <ProFormText
                        name="email"
                        label="Email"
                        fieldProps={{ maxLength: 256 }}
                        rules={[{ type: 'email' }]}
                    />
                </Col>
                <Col span={12}>
                    <ProFormText name="phoneNumber" label="Số điện thoại" fieldProps={{ maxLength: 256 }} />
                </Col>
                <Col span={12}>
                    <ProFormSelect
                        name="districtId"
                        label="Quận / huyện"
                        showSearch
                        request={apiDistrictOptions}
                        fieldProps={{ allowClear: true }}
                    />
                </Col>
                <Col span={12}>
                    <ProFormSelect
                        name="teamId"
                        label="Nhóm"
                        showSearch
                        request={apiTeamOptions}
                        fieldProps={{ allowClear: true }}
                    />
                </Col>
            </Row>
            <ProFormText name="address" label="Địa chỉ" fieldProps={{ maxLength: 512 }} />
            <ProFormText name="avatar" label="Ảnh đại diện (URL)" fieldProps={{ maxLength: 2058 }} />
            <ProFormTextArea name="bio" label="Giới thiệu" fieldProps={{ maxLength: 1024 }} />
            <ProFormDigit name="amount" label="Số dư" fieldProps={{ precision: 2 }} />
            <Row gutter={16}>
                <Col span={12}>
                    <ProFormSwitch name="emailConfirmed" label="Email đã xác thực" />
                </Col>
                <Col span={12}>
                    <ProFormSwitch name="phoneNumberConfirmed" label="Số điện thoại đã xác thực" />
                </Col>
                <Col span={12}>
                    <ProFormSwitch name="twoFactorEnabled" label="Xác thực hai bước" />
                </Col>
                <Col span={12}>
                    <ProFormSwitch name="lockoutEnabled" label="Cho phép khóa tài khoản" />
                </Col>
                <Col span={12}>
                    <ProFormDateTimePicker name="lockoutEnd" label="Khóa đến" />
                </Col>
                <Col span={12}>
                    <ProFormDigit
                        name="accessFailedCount"
                        label="Số lần đăng nhập thất bại"
                        min={0}
                        fieldProps={{ precision: 0 }}
                    />
                </Col>
            </Row>
        </DrawerForm>
    )
}

export default UserEditForm;