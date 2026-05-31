import { ProForm, ProFormInstance } from "@ant-design/pro-components";
import TiptapEditor from "@/components/tiptap";
import { normalizeBlockOutput, blockOutputToTiptapHtml, tiptapJsonToBlockOutput } from "@/components/tiptap/block-output";
import { useEffect, useMemo } from "react";

type Props = {
  data: any;
}

const EditorComponent: React.FC<Props> = ({ data }) => {
  const formRef = ProForm.useFormInstance<ProFormInstance>();
  const initialOutput = useMemo(() => normalizeBlockOutput(data), [data]);
  const initialContent = useMemo(() => blockOutputToTiptapHtml(initialOutput), [initialOutput]);

  useEffect(() => {
    formRef?.setFieldValue('blocks', initialOutput.blocks);
    formRef?.setFieldValue('time', initialOutput.time);
    formRef?.setFieldValue('version', initialOutput.version);
  }, [formRef, initialOutput]);

  return (
    <>
      <ProForm.Item>
        <TiptapEditor
          value={initialContent}
          placeholder="Nhap noi dung..."
          onDocumentChange={(doc) => {
            const outputData = tiptapJsonToBlockOutput(doc);
            formRef?.setFieldValue('blocks', outputData.blocks);
            formRef?.setFieldValue('time', outputData.time);
            formRef?.setFieldValue('version', outputData.version);
          }}
        />
      </ProForm.Item>
      <ProForm.Item name="blocks" hidden />
      <ProForm.Item name="time" hidden />
      <ProForm.Item name="version" hidden />
    </>
  );
};

export default EditorComponent;
