import { apiGetUser, apiUpdateUser } from "@/services/user"
import { ProForm, ProFormDatePicker, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-components"
import { useParams, useRequest } from "@umijs/max"
import { message } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";

const Basic: React.FC = () => {

    const { id } = useParams();
    const formRef = useRef<ProFormInstance>();

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
            <div className="flex gap-4">
                <div className="flex-1">
                    <ProFormText label="Name" name="name" rules={[
                        {
                            required: true
                        }
                    ]} />
                </div>
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
            </div>
            <ProFormText name="address" label="Địa chỉ" />
        </ProForm>
    )
}
export default Basic