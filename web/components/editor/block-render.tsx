import React from "react";
import { EditorJSHeaderData } from "@/services/typings/editorjs";
import sanitizeHtml from "sanitize-html";

const BlockRender: React.FC<API.BlockEditor> = (props) => {

    const BLOCK_TYPES = {
        PARAGRAPH: 'paragraph',
        HEADER: 'header',
        IMAGE: 'image',
        LIST: 'list',
        QUOTE: 'quote',
        CODE: 'code'
    }

    const { blocks } = props;
    if (!blocks || blocks.length === 0) {
        return null;
    }

    const cleanHtml = (value?: string) => sanitizeHtml(value || "");

    return (
        <div>
            {blocks.map((block, index) => {
                const sectionId = (index: number) => `post-section-${index}`;

                if (block.type === BLOCK_TYPES.PARAGRAPH) {
                    return (
                        <p className="mb-2 text-slate-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data.text || '' }} />
                    );
                }
                if (block.type === BLOCK_TYPES.HEADER) {
                    const data = block.data as EditorJSHeaderData;
                    const Heading = (`h${Math.min(Math.max(data.level, 2), 4)}`) as "h2" | "h3" | "h4";
                    return (
                        <Heading
                            key={block.id || index}
                            id={sectionId(index)}
                            className="scroll-mt-24 mb-4 mt-10 text-2xl font-bold tracking-tight text-slate-900 first:mt-0 md:text-3xl"
                            dangerouslySetInnerHTML={{ __html: cleanHtml(data.text) }}
                        />
                    );
                }
                if (block.type === BLOCK_TYPES.IMAGE) {
                    return (
                        <figure className={`mb-6 ${block.data.align === 'center' ? 'text-center' : block.data.align === 'right' ? 'text-right' : ''}`}>
                            <img src={block.data.file?.url} alt={block.data.caption || ''} className="max-w-full h-auto inline-block" />
                            {block.data.caption && <figcaption className="text-sm text-gray-600 mt-2">{block.data.caption}</figcaption>}
                        </figure>
                    );
                }
                if (block.type === BLOCK_TYPES.LIST) {
                    return (
                        <ul className="list-disc list-inside mb-4 ml-4">
                            {block.data.items?.map((item, i) => (
                                <li key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: item.content || '' }}></li>
                            ))}
                        </ul>
                    );
                }
                if (block.type === BLOCK_TYPES.QUOTE) {
                    return <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">{block.data.text}</blockquote>;
                }
                if (block.type === BLOCK_TYPES.CODE) {
                    return <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4"><code>{block.data.code}</code></pre>;
                }

                return <React.Fragment key={block.id || index} />;
            })}
        </div>
    )
}

export default BlockRender;