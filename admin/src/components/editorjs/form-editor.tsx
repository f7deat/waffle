import { ProForm, ProFormItemProps } from '@ant-design/pro-components';
import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import { message } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import React, { useEffect, useMemo, useRef } from 'react';
import { uploadFromUrl, uploadRcFile } from '@/services/file-service';
import './form-editor.less';

type Props = ProFormItemProps & {
  initialValue?: any;
};

const EMPTY_OUTPUT: OutputData = {
  blocks: [],
  time: Date.now(),
  version: '2.31.0',
};

const toOutputData = (value: any): OutputData => {
  if (!value) {
    return EMPTY_OUTPUT;
  }

  if (typeof value === 'string') {
    try {
      return toOutputData(JSON.parse(value));
    } catch {
      return EMPTY_OUTPUT;
    }
  }

  if (Array.isArray(value)) {
    return {
      ...EMPTY_OUTPUT,
      blocks: value,
    };
  }

  if (typeof value === 'object') {
    return {
      blocks: Array.isArray(value.blocks) ? value.blocks : [],
      time: typeof value.time === 'number' ? value.time : Date.now(),
      version: typeof value.version === 'string' ? value.version : EMPTY_OUTPUT.version,
    };
  }

  return EMPTY_OUTPUT;
};

const resolveUploadedUrl = (response: any): string | undefined => {
  if (!response) return undefined;
  if (typeof response === 'string') return response;
  if (typeof response.data === 'string') return response.data;
  if (typeof response.url === 'string') return response.url;
  if (typeof response.data?.url === 'string') return response.data.url;
  return undefined;
};

const FormEditor: React.FC<Props> = (props) => {
  const formRef = ProForm.useFormInstance();
  const holderId = useMemo(() => `editorjs-${Math.random().toString(36).slice(2, 11)}`, []);
  const editorRef = useRef<EditorJS | null>(null);
  const initialOutput = useMemo(() => toOutputData(props.initialValue), [props.initialValue]);

  useEffect(() => {
    let mounted = true;
    const editor = new EditorJS({
      holder: holderId,
      data: initialOutput,
      placeholder: 'Nhập nội dung...',
      inlineToolbar: ['bold', 'italic', 'link'],
      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            levels: [1, 2, 3],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
        },
        delimiter: Delimiter,
        code: CodeTool,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (file: File) => {
                const response = await uploadRcFile(file as RcFile);
                const imageUrl = resolveUploadedUrl(response);
                if (!imageUrl) {
                  message.error('Khong lay duoc URL anh sau khi upload');
                  return {
                    success: 0,
                  };
                }

                return {
                  success: 1,
                  file: {
                    url: imageUrl,
                  },
                };
              },
              uploadByUrl: async (url: string) => {
                const response = await uploadFromUrl(url);
                const imageUrl = resolveUploadedUrl(response) ?? url;
                return {
                  success: imageUrl ? 1 : 0,
                  file: {
                    url: imageUrl,
                  },
                };
              },
            },
          },
        },
      },
      onReady: async () => {
        if (!props.name || !mounted) {
          return;
        }
        const output = await editor.save();
        if (mounted) {
          formRef?.setFieldValue(props.name, output);
        }
      },
      onChange: async () => {
        if (!props.name || !mounted) {
          return;
        }
        const output = await editor.save();
        if (mounted) {
          formRef?.setFieldValue(props.name, output);
        }
      },
    });

    editorRef.current = editor;

    return () => {
      mounted = false;
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [formRef, holderId, initialOutput, props.name]);

  return (
    <ProForm.Item {...props}>
      <div className="editorjs-wrapper">
        <div className="editorjs-toolbar-note -mx-4">
          Gõ / để mở menu block (Heading, List, Quote, Code, Delimiter, Image)
        </div>
        <div id={holderId} className="editorjs-holder" />
      </div>
    </ProForm.Item>
  );
};

export default FormEditor;
