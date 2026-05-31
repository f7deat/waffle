import { ProForm, ProFormItemProps } from '@ant-design/pro-components';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from 'antd';
import React, { useMemo } from 'react';
import { blockOutputToTiptapHtml, tiptapJsonToBlockOutput } from './block-output';
import './form-editor.less';

type Props = ProFormItemProps & {
  initialValue?: any;
};

const ToolbarButton: React.FC<{
  active?: boolean;
  label: string;
  onClick: () => void;
}> = ({ active, label, onClick }) => {
  return (
    <Button
      size="small"
      type={active ? 'primary' : 'default'}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
    >
      {label}
    </Button>
  );
};

const FormEditor: React.FC<Props> = (props) => {
  const formRef = ProForm.useFormInstance();
  const initialContent = useMemo(() => blockOutputToTiptapHtml(props.initialValue), [props.initialValue]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Image.configure({
        allowBase64: true,
        inline: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Nhập nội dung...',
      }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onCreate: ({ editor: createdEditor }) => {
      if (props.name) {
        formRef?.setFieldValue(props.name, tiptapJsonToBlockOutput(createdEditor.getJSON()));
      }
    },
    onUpdate: ({ editor: updatedEditor }) => {
      if (props.name) {
        formRef?.setFieldValue(props.name, tiptapJsonToBlockOutput(updatedEditor.getJSON()));
      }
    },
  });

  const setLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Link URL', previousUrl);

    if (url === null) return;

    if (url === '') {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url }).run();
  };

  const addImage = () => {
    if (!editor) return;
    const imageUrl = window.prompt('Image URL');
    if (!imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
  };

  return (
    <ProForm.Item {...props}>
      <div className="border rounded-md overflow-hidden">
        <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-2">
          <ToolbarButton label="B" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} />
          <ToolbarButton label="I" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} />
          <ToolbarButton label="U" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
          <ToolbarButton label="H1" active={editor?.isActive('heading', { level: 1 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} />
          <ToolbarButton label="H2" active={editor?.isActive('heading', { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
          <ToolbarButton label="UL" active={editor?.isActive('bulletList')} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
          <ToolbarButton label="OL" active={editor?.isActive('orderedList')} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
          <ToolbarButton label="Quote" active={editor?.isActive('blockquote')} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
          <ToolbarButton label="Code" active={editor?.isActive('codeBlock')} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} />
          <ToolbarButton label="Link" active={editor?.isActive('link')} onClick={setLink} />
          <ToolbarButton label="Image" onClick={addImage} />
        </div>
        <EditorContent editor={editor} className="tiptap-editor min-h-64 p-3" />
      </div>
    </ProForm.Item>
  );
};

export default FormEditor;
