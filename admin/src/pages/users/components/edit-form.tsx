import { apiGetUser, apiUpdateUser } from "@/services/user";
import { GENDER_OPTIONS } from "@/utils/constants";
import { DrawerForm, DrawerFormProps, ProFormDatePicker, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { message } from "antd";
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
        <DrawerForm {...rest} onFinish={onFinish} title="Chỉnh sửa thành viên" formRef={formRef} drawerProps={{ destroyOnClose: true }}>
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
            <ProFormDatePicker name="dateOfBirth" label="Ngày sinh" />
            <ProFormSelect name="gender" label="Gender" options={GENDER_OPTIONS} />
            <ProFormText name="email" label="Email" />
            <ProFormText name="phoneNumber" label="Phone Number" />
        </DrawerForm>
    )
}

export default UserEditForm;