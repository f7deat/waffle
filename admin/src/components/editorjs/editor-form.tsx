import { ProForm, ProFormItemProps } from '@ant-design/pro-components';
import EditorJS from '@editorjs/editorjs';
import React, { useEffect, useRef } from 'react';
import { EDITOR_JS_TOOLS } from './tool';
import './style.less';

type Props = ProFormItemProps & {

}

const FormEditor: React.FC<Props> = (props) => {
    const ejInstance = useRef<any>();
    const formRef = ProForm.useFormInstance();

    useEffect(() => {
        if (!ejInstance.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                data: props.initialValue,
                onReady: () => {
                    ejInstance.current = editor;
                },
                onChange: (api) => {
                    api.saver.save().then((outputData) => {
                        console.log('Article data: ', outputData);
                        formRef.setFieldValue(props.name, outputData);
                    });
                },
                autofocus: true,
                tools: EDITOR_JS_TOOLS,
            });
        }
        return () => {
            ejInstance.current?.destroy();
            ejInstance.current = null;
        };
    }, []);

    return (
        <ProForm.Item {...props}>zxcccccccccccccccccccc
            <div className='border rounded-md'>
                <div id="editorjs"> </div>
            </div>
        </ProForm.Item>
    );
};

export default FormEditor;
