/* eslint-disable @next/next/no-img-element */
import React, { JSX } from "react";

const Block: React.FC<API.Block> = (block) => {
    if (block.type === 'paragraph') {
        return (
            <p className="mb-4 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data.text || '' }} />
        );
    }
    if (block.type === 'header') {
        const HeaderTag = `h${block.data.level || 2}` as keyof JSX.IntrinsicElements;
        return <HeaderTag className={`font-bold mb-3 mt-6 ${block.data.level === 1 ? 'text-3xl' : block.data.level === 2 ? 'text-2xl' : 'text-xl'}`} dangerouslySetInnerHTML={{ __html: block.data.text || '' }}></HeaderTag>;
    }
    if (block.type === 'image') {
        return (
            <figure className={`mb-6 ${block.data.align === 'center' ? 'text-center' : block.data.align === 'right' ? 'text-right' : ''}`}>
                <img src={block.data.url} alt={block.data.caption || ''} className="max-w-full h-auto inline-block" />
                {block.data.caption && <figcaption className="text-sm text-gray-600 mt-2">{block.data.caption}</figcaption>}
            </figure>
        );
    }
    if (block.type === 'list') {
        return (
            <ul className="list-disc list-inside mb-4 ml-4">
                {block.data.items?.map((item, i) => <li key={i} className="mb-1" dangerouslySetInnerHTML={{__html: item}}></li>)}
            </ul>
        );
    }
    if (block.type === 'quote') {
        return <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">{block.data.text}</blockquote>;
    }
    if (block.type === 'code') {
        return <pre className="bg-gray-100 p-4 rounded overflow-x-auto mb-4"><code>{block.data.code}</code></pre>;
    }
    return <React.Fragment />;
}

export default Block;