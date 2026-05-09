import type { Editor } from '@tiptap/react';
import { useEditorState } from '@tiptap/react';
import { Select } from 'antd';

type HeadingValue = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

type HeadingDropdownProps = {
	editor: Editor;
};

const headingOptions = [
	{ label: 'Paragraph', value: 'paragraph' },
	{ label: 'Heading 1', value: 'h1' },
	{ label: 'Heading 2', value: 'h2' },
	{ label: 'Heading 3', value: 'h3' },
	{ label: 'Heading 4', value: 'h4' },
	{ label: 'Heading 5', value: 'h5' },
	{ label: 'Heading 6', value: 'h6' },
] as const;

const HeadingDropdown: React.FC<HeadingDropdownProps> = ({ editor }) => {
	const currentHeadingValue = useEditorState({
		editor,
		selector: ({ editor: currentEditor }) => {
			for (let level = 1; level <= 6; level += 1) {
				if (currentEditor.isActive('heading', { level })) {
					return `h${level}` as HeadingValue;
				}
			}
			return 'paragraph' as HeadingValue;
		},
	});

	const onChangeHeading = (nextValue: HeadingValue) => {
		if (nextValue === 'paragraph') {
			editor.chain().focus().setParagraph().run();
			return;
		}

		const level = Number(nextValue.replace('h', ''));
		if (level >= 1 && level <= 6) {
			editor.chain().focus().setHeading({ level: level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
		}
	};

	return (
		<Select
			size="small"
			value={currentHeadingValue}
			style={{ minWidth: 130 }}
			options={headingOptions as unknown as { label: string; value: HeadingValue }[]}
			onChange={onChangeHeading}
		/>
	);
};

export default HeadingDropdown;
