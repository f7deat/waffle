import { apiResetPassword } from "@/services/user";
import { ProForm, ProFormText } from "@ant-design/pro-components"
import { useParams } from "@umijs/max";
import { message } from "antd";

const ResetPassword: React.FC = () => {

    const { id } = useParams();

    const onFinish = async (values: any) => {
        await apiResetPassword({
            userId: id!,
            newPassword: values.newPassword
        });
        message.success('Password reset successfully!');
    }

    return (
        <ProForm onFinish={onFinish}>
            <ProFormText label="New Password" name="newPassword" rules={[
                {
                    required: true
                }
            ]} />
        </ProForm>
    )
}

export default ResetPassword;