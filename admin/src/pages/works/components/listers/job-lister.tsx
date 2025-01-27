import { AbstractBlock } from "@/typings/work"
import { ProForm, ProFormDigit, ProFormInstance } from "@ant-design/pro-components";
import { useEffect } from "react";

const JobLister : React.FC<AbstractBlock> = ({ data }) => {
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
        <ProFormDigit name="pageSize" label="Page size" />
    )
}

export default JobLister