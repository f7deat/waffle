import { AlignCenterOutlined, AlignLeftOutlined, AlignRightOutlined, BoldOutlined, ClearOutlined, ItalicOutlined, LinkOutlined, LoadingOutlined, OrderedListOutlined, PictureOutlined, StrikethroughOutlined, TableOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { uploadRcFile } from '@/services/file-service';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { Button, Space, message } from 'antd';
import type { RcFile } from 'antd/lib/upload';
import { useEffect, useRef, useState } from 'react';
import './editor.less';

type TiptapEditorProps = {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
};

const TiptapEditor: React.FC<TiptapEditorProps> = ({
    value,
    onChange,
    placeholder = 'Nhap noi dung bai viet...',
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Link.configure({
                openOnClick: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: value || '',
        onUpdate: ({ editor: currentEditor }) => {
            onChange?.(currentEditor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) return;
        const currentValue = editor.getHTML();
        const nextValue = value || '';
        if (currentValue !== nextValue) {
            editor.commands.setContent(nextValue);
        }
    }, [editor, value]);

    const resolveUploadedUrl = (response: any): string | undefined => {
        if (!response) return undefined;
        if (typeof response === 'string') return response;
        if (typeof response.data === 'string') return response.data;
        if (typeof response.url === 'string') return response.url;
        return undefined;
    };

    const onSelectImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !editor) return;

        try {
            setUploading(true);
            const response = await uploadRcFile(file as RcFile);
            const imageUrl = resolveUploadedUrl(response);
            if (!imageUrl) {
                message.error('Khong lay duoc URL anh sau khi upload');
                return;
            }
            editor.chain().focus().setImage({ src: imageUrl, alt: file.name }).run();
            message.success('Upload anh thanh cong');
        } catch (error) {
            message.error('Upload anh that bai');
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const setLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('Nhap URL', previousUrl || 'https://');
        if (url === null) return;
        if (!url.trim()) {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
    };

    if (!editor) return null;

    return (
        <div className="tiptap-wrapper">
            <div className="tiptap-toolbar">
                <Space wrap>
                    <Button
                        size="small"
                        type={editor.isActive('bold') ? 'primary' : 'default'}
                        icon={<BoldOutlined />}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                    />
                    <Button
                        size="small"
                        type={editor.isActive('italic') ? 'primary' : 'default'}
                        icon={<ItalicOutlined />}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                    />
                    <Button
                        size="small"
                        type={editor.isActive('underline') ? 'primary' : 'default'}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                    >
                        U
                    </Button>
                    <Button
                        size="small"
                        type={editor.isActive('strike') ? 'primary' : 'default'}
                        icon={<StrikethroughOutlined />}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                    />
                    <Button
                        size="small"
                        type={editor.isActive('bulletList') ? 'primary' : 'default'}
                        icon={<UnorderedListOutlined />}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                    />
                    <Button
                        size="small"
                        type={editor.isActive('orderedList') ? 'primary' : 'default'}
                        icon={<OrderedListOutlined />}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    />
                    <Button
                        size="small"
                        type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
                        icon={<AlignLeftOutlined />}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    />
                    <Button
                        size="small"
                        type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
                        icon={<AlignCenterOutlined />}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    />
                    <Button
                        size="small"
                        type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
                        icon={<AlignRightOutlined />}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    />
                    <Button
                        size="small"
                        type={editor.isActive('blockquote') ? 'primary' : 'default'}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    >
                        Quote
                    </Button>
                    <Button
                        size="small"
                        type={editor.isActive('link') ? 'primary' : 'default'}
                        icon={<LinkOutlined />}
                        onClick={setLink}
                    />
                    <Button
                        size="small"
                        icon={uploading ? <LoadingOutlined /> : <PictureOutlined />}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    />
                    <Button
                        size="small"
                        icon={<TableOutlined />}
                        type={editor.isActive('table') ? 'primary' : 'default'}
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    />
                    <Button
                        size="small"
                        onClick={() => editor.chain().focus().addRowAfter().run()}
                        disabled={!editor.can().chain().focus().addRowAfter().run()}
                    >
                        +Row
                    </Button>
                    <Button
                        size="small"
                        onClick={() => editor.chain().focus().addColumnAfter().run()}
                        disabled={!editor.can().chain().focus().addColumnAfter().run()}
                    >
                        +Col
                    </Button>
                    <Button
                        size="small"
                        onClick={() => editor.chain().focus().deleteRow().run()}
                        disabled={!editor.can().chain().focus().deleteRow().run()}
                    >
                        -Row
                    </Button>
                    <Button
                        size="small"
                        onClick={() => editor.chain().focus().deleteColumn().run()}
                        disabled={!editor.can().chain().focus().deleteColumn().run()}
                    >
                        -Col
                    </Button>
                    <Button
                        size="small"
                        onClick={() => editor.chain().focus().deleteTable().run()}
                        disabled={!editor.can().chain().focus().deleteTable().run()}
                    >
                        Del table
                    </Button>
                    <Button
                        size="small"
                        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                        icon={<ClearOutlined />}
                    />
                </Space>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={onSelectImage}
                />
            </div>

            <div className="tiptap-content">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default TiptapEditor;