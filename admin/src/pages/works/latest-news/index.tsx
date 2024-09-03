import { AbstractBlock } from "@/typings/work"
import { ProForm, ProFormDigit, ProFormInstance, ProFormText } from "@ant-design/pro-components"
import { useEffect } from "react";

const LatestNews: React.FC<AbstractBlock> = ({ data }) => {

    const formRef = ProForm.useFormInstance<ProFormInstance>();

    useEffect(() => {
        if (data) {
            formRef.setFields([
                {
                    name: 'title',
                    value: data.title
                },
                {
                    name: 'pageSize',
                    value: data.pageSize
                }
            ])
        }
    }, [data]);

    return (
        <>
            <ProFormText label="Tiêu đề" name="title" rules={[
                {
                    required: true
                }
            ]} />
            <ProFormText label="Tiêu đề phụ" name="subTitle" />
            <ProFormDigit label="Số bản ghi" name="pageSize" />
        </>
    )
}

export default LatestNews