import { AbstractBlock } from "@/typings/work";
import { ProForm, ProFormInstance, ProFormText } from "@ant-design/pro-components";
import { useEffect } from "react";

const LocationPicker: React.FC<AbstractBlock> = ({ data }) => {

    const formRef = ProForm.useFormInstance<ProFormInstance>();

    useEffect(() => {
        if (data) {
            formRef.setFields([
                {
                    name: 'title' as any,
                    value: data.value,
                }
            ]);
        }
    }, [data]);

    return (
        <ProFormText name="title" label="Title" />
    )
}

export default LocationPicker;