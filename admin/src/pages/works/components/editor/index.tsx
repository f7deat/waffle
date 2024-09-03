import { ProForm, ProFormInstance } from "@ant-design/pro-components";
import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "@/components/editorjs/tool";

type Props = {
  data: any;
}

const EditorComponent: React.FC<Props> = ({ data }) => {
  const formRef = ProForm.useFormInstance<ProFormInstance>();
  const ejInstance = useRef<any>();

  const initEditor = () => {
    const editor = new EditorJS({
      holder: 'editorjs',
      data: data,
      onReady: () => {
        ejInstance.current = editor;
      },
      onChange: (api) => {
        api.saver.save().then((outputData) => {
          console.log(outputData);
          formRef.setFieldValue('blocks', outputData.blocks);
          formRef.setFieldValue('time', outputData.time);
          formRef.setFieldValue('version', outputData.version);
        });
      },
      autofocus: true,
      tools: EDITOR_JS_TOOLS,
    });
  };

  useEffect(() => {
    if (!ejInstance.current) {
      initEditor();
    }
    return () => {
      ejInstance.current.destroy();
      ejInstance.current = null;
    };
  }, []);

  return (
    <>
      <ProForm.Item name="blocks">
        <div id="editorjs"> </div>
      </ProForm.Item>
      <ProForm.Item name="time" hidden />
      <ProForm.Item name="version" hidden />
    </>
  );
};

export default EditorComponent;
