import { useParams } from "@umijs/max";
import { saveArguments } from "@/services/work-content";
import { ProForm, ProFormInstance } from "@ant-design/pro-components";
import { message } from "antd";
import { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS } from "@/components/editorjs/tool";

type Props = {
  data: any;
}

const EditorComponent: React.FC<Props> = ({ data }) => {
  const { id } = useParams();
  const formRef = useRef<ProFormInstance>();
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
          formRef.current?.setFieldValue('blockEditor', outputData);
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

  const onFinish = async (values: any) => {
    const response = await saveArguments(id, values.blockEditor);
    if (response.succeeded) {
      message.success('Saved');
    }
  };

  return (
    <ProForm onFinish={onFinish} formRef={formRef}>
      <ProForm.Item name="blockEditor">
        <div id="editorjs"> </div>
      </ProForm.Item>
    </ProForm>
  );
};

export default EditorComponent;
