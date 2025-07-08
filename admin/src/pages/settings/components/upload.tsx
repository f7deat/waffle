import { ProForm, ProFormInstance, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import { SettingProps } from "../typings";
import { useEffect, useRef } from "react";

const UploadSetting: React.FC<SettingProps> = ({ data, onFinish }) => {

    const formRef = useRef<ProFormInstance>();

    useEffect(() => {
        formRef.current?.setFields([
            {
                name: 'id',
                value: data?.id
            },
            {
                name: 'type',
                value: data?.type
            }
        ])
    }, [data]);

    return (
        <>
            <ProForm onFinish={onFinish} formRef={formRef}>
                <ProFormText name="id" hidden />
                <ProFormSelect label="Loại upload" name="type" options={[
                    {
                        label: 'Local',
                        value: 0
                    },
                    {
                        label: 'HPUNI',
                        value: 1
                    }
                ]} rules={[
                    {
                        required: true,
                        message: 'Vui lòng chọn loại upload'
                    }
                ]} allowClear={false} />
            </ProForm>
        </>
    )
}

export default UploadSetting;