import { AbstractBlock } from "@/typings/work"
import { ProForm, ProFormInstance, ProFormTextArea } from "@ant-design/pro-components";
import { useEffect } from "react";

const HtmlBlock : React.FC<AbstractBlock> = ({ data }) => {
    const formRef = ProForm.useFormInstance<ProFormInstance>();
  
    useEffect(() => {
      if (data) {
        formRef.setFields([
          {
            name: 'value',
            value: data.value,
          }
        ]);
      }
    }, [data]);
    
    return (
        <ProFormTextArea name="html" label="HTML" />
    )
}

export default HtmlBlock