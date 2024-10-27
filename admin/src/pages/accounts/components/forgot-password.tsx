import { ModalForm, ModalFormProps, ProFormText } from "@ant-design/pro-components"

const ForgotPassword: React.FC<ModalFormProps> = (props) => {
    return (
        <ModalForm {...props} title="Quên mật khẩu?" width={400} modalProps={{
            centered: true
        }}>
            <ProFormText name="email" label="Email" rules={[
                {
                    type: 'email'
                },
                {
                    required: true
                }
            ]} />
        </ModalForm>
    )
}
export default ForgotPassword;