import { ProForm, ProFormItemProps } from '@ant-design/pro-components';
import EditorJS from '@editorjs/editorjs';
import React, { useEffect, useRef } from 'react';
import { EDITOR_JS_TOOLS } from './tool';

type Props = ProFormItemProps & {

}

const FormEditor: React.FC<Props> = (props) => {
    const ejInstance = useRef<any>();
    const formRef = ProForm.useFormInstance();

    useEffect(() => {
        if (formRef) {
            if (!ejInstance.current) {
                const editor = new EditorJS({
                    holder: 'editorjs',
                    data: formRef.getFieldValue(props.name),
                    onReady: () => {
                        ejInstance.current = editor;
                    },
                    onChange: (api) => {
                        api.saver.save().then((outputData) => {
                            formRef?.setFieldValue(props.name, outputData);
                        });
                    },
                    autofocus: true,
                    tools: EDITOR_JS_TOOLS,
                });
            }
            return () => {
                ejInstance.current.destroy();
                ejInstance.current = null;
            };
        }
    }, [formRef]);

    return (
        <ProForm.Item {...props}>
            <div className='border rounded-md'>
                <div id="editorjs"> </div>
            </div>
        </ProForm.Item>
    );
};

export default FormEditor;
