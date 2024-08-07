import { apiGetUser, apiUpdateUser } from "@/services/user"
import { ProForm, ProFormDatePicker, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { useParams, useRequest } from "@umijs/max"
import { message } from "antd";
import { useEffect, useRef } from "react";

const Basic: React.FC = () => {

    const { id } = useParams();
    const formRef = useRef<ProFormInstance>();

    const { data, loading } = useRequest(() => apiGetUser(id));

    useEffect(() => {
        if (data) {
            formRef.current?.setFields([
                {
                    name: 'name',
                    value: data.name
                }
            ])
        }
    }, [data]);

    const onFinish = async (values: any) => {
        values.id = id;
        await apiUpdateUser(values);
        message.success('Lưu thành công!');
    }

    return (
        <ProForm loading={loading} onFinish={onFinish} formRef={formRef}>
            <ProFormText label="Name" name="name" rules={[
                {
                    required: true
                }
            ]} />
            <ProFormDatePicker label="Ngày sinh" name="dateOfBirth" />
            <ProFormSelect label="Giới tính" name="gender" options={[
                {
                    label: 'Nam',
                    value: false as any
                },
                {
                    label: 'Nữ',
                    value: true as any
                }
            ]} />
        </ProForm>
    )
}
export default Basic