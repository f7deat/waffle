import { apiGetUser, apiUpdateUser } from "@/services/user"
import { ProForm, ProFormInstance } from "@ant-design/pro-components"
import UserFormFields from "../../components/user-form-fields";
import { useParams, useRequest } from "@umijs/max"
import { message } from "antd";
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
            <UserFormFields
                includeId
                includeAddress
                includeDateOfBirth
                includeUserName={false}
                includeEmail={false}
                includePhoneNumber={false}
            />
        </ProForm>
    )
}
export default Basic