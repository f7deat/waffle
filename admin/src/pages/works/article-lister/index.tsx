import { AbstractBlock } from "@/typings/work";
import { ProForm, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import { useEffect } from "react";

const ArticleLister: React.FC<AbstractBlock> = ({ data }) => {
    const formRef = ProForm.useFormInstance<ProFormInstance>();

    useEffect(() => {
        if (data) {
            formRef?.setFields([
                {
                    name: 'name',
                    value: data.name,
                }
            ]);
        }
    }, [data]);

    return (
        <>
            <ProFormText name="name" label="Name" rules={[
                {
                    required: true
                }
            ]} />
        </>
    )
}

export default ArticleLister