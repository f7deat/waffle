import type { JSONContent } from '@tiptap/react';

type BlockData = Record<string, any>;

export type BlockOutputBlock = {
  type: string;
  data: BlockData;
};

export type BlockOutput = {
  time: number;
  blocks: BlockOutputBlock[];
  version: string;
};

export const EMPTY_BLOCK_OUTPUT: BlockOutput = {
  blocks: [],
  time: Date.now(),
  version: '2.31.0',
};

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const applyMarks = (text: string, marks: Array<any> = []) => {
  return marks.reduce((content, mark) => {
    if (!mark?.type) return content;
    if (mark.type === 'bold') return `<strong>${content}</strong>`;
    if (mark.type === 'italic') return `<em>${content}</em>`;
    if (mark.type === 'underline') return `<u>${content}</u>`;
    if (mark.type === 'strike') return `<s>${content}</s>`;
    if (mark.type === 'code') return `<code>${content}</code>`;
    if (mark.type === 'link') {
      const href = mark?.attrs?.href || '#';
      return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${content}</a>`;
    }
    return content;
  }, text);
};

const inlineNodesToHtml = (nodes: JSONContent[] = []) => {
  return nodes.map((node) => {
    if (node.type === 'hardBreak') return '<br/>';
    if (node.type !== 'text') return '';
    const text = escapeHtml(node.text || '');
    return applyMarks(text, node.marks);
  }).join('');
};

const getNodePlainText = (node?: JSONContent): string => {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  return (node.content || []).map((child) => getNodePlainText(child)).join('');
};

export const tiptapJsonToBlockOutput = (doc?: JSONContent | null): BlockOutput => {
  const blocks: BlockOutputBlock[] = [];

  for (const node of doc?.content || []) {
    if (!node?.type) continue;

    if (node.type === 'paragraph') {
      const text = inlineNodesToHtml(node.content || []);
      if (text.trim()) {
        blocks.push({
          type: 'paragraph',
          data: { text },
        });
      }
      continue;
    }

    if (node.type === 'heading') {
      const text = inlineNodesToHtml(node.content || []);
      if (text.trim()) {
        blocks.push({
          type: 'header',
          data: {
            level: Number(node.attrs?.level || 2),
            text,
          },
        });
      }
      continue;
    }

    if (node.type === 'bulletList' || node.type === 'orderedList') {
      const items = (node.content || [])
        .map((listItem) => {
          const firstNode = listItem.content?.[0];
          return inlineNodesToHtml(firstNode?.content || []).trim();
        })
        .filter(Boolean);

      if (items.length) {
        blocks.push({
          type: 'list',
          data: {
            style: node.type === 'orderedList' ? 'ordered' : 'unordered',
            items,
          },
        });
      }
      continue;
    }

    if (node.type === 'blockquote') {
      const quoteText = (node.content || []).map((item) => inlineNodesToHtml(item.content || [])).join('<br/>');
      if (quoteText.trim()) {
        blocks.push({
          type: 'quote',
          data: { text: quoteText },
        });
      }
      continue;
    }

    if (node.type === 'codeBlock') {
      const code = getNodePlainText(node).trim();
      if (code) {
        blocks.push({
          type: 'code',
          data: { code },
        });
      }
      continue;
    }

    if (node.type === 'image') {
      const imageUrl = String(node.attrs?.src || '').trim();
      if (imageUrl) {
        blocks.push({
          type: 'image',
          data: {
            url: imageUrl,
            caption: String(node.attrs?.alt || ''),
            align: 'center',
          },
        });
      }
    }
  }

  return {
    blocks,
    time: Date.now(),
    version: '2.31.0',
  };
};

export const normalizeBlockOutput = (value: any): BlockOutput => {
  if (!value) return { ...EMPTY_BLOCK_OUTPUT, time: Date.now() };

  if (typeof value === 'string') {
    try {
      return normalizeBlockOutput(JSON.parse(value));
    } catch {
      return { ...EMPTY_BLOCK_OUTPUT, time: Date.now() };
    }
  }

  if (Array.isArray(value)) {
    return {
      blocks: value,
      time: Date.now(),
      version: '2.31.0',
    };
  }

  if (Array.isArray(value?.blocks)) {
    return {
      blocks: value.blocks,
      time: Number(value?.time || Date.now()),
      version: String(value?.version || '2.31.0'),
    };
  }

  return { ...EMPTY_BLOCK_OUTPUT, time: Date.now() };
};

export const blockOutputToTiptapHtml = (value: any): string => {
  const data = normalizeBlockOutput(value);

  if (!Array.isArray(data.blocks)) return '<p></p>';

  const html = data.blocks.map((block: any) => {
    const blockType = block?.type;
    const blockData = block?.data || {};

    if (blockType === 'paragraph') return `<p>${blockData.text || ''}</p>`;
    if (blockType === 'header') {
      const level = Number(blockData.level || 2);
      const safeLevel = Math.min(Math.max(level, 1), 6);
      return `<h${safeLevel}>${blockData.text || ''}</h${safeLevel}>`;
    }
    if (blockType === 'list') {
      const items = (blockData.items || []).map((item: any) => {
        if (typeof item === 'string') return `<li>${item}</li>`;
        return `<li>${item?.content || ''}</li>`;
      }).join('');
      return blockData.style === 'ordered' ? `<ol>${items}</ol>` : `<ul>${items}</ul>`;
    }
    if (blockType === 'quote') return `<blockquote><p>${blockData.text || ''}</p></blockquote>`;
    if (blockType === 'code') return `<pre><code>${escapeHtml(blockData.code || '')}</code></pre>`;
    if (blockType === 'delimiter') return '<hr />';
    if (blockType === 'raw') return `${blockData.html || ''}`;
    if (blockType === 'image' || blockType === 'simpleImage') {
      const imageUrl = blockData.url || blockData.file?.url || '';
      if (!imageUrl) return '';
      return `<p><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(blockData.caption || '')}" /></p>`;
    }
    if (blockType === 'embed') {
      const embedUrl = blockData.embed || '';
      if (!embedUrl) return '';
      return `<p><a href="${escapeHtml(embedUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(embedUrl)}</a></p>`;
    }
    if (blockType === 'linkTool') {
      const link = blockData.link || '';
      const title = blockData.meta?.title || blockData.link || '';
      if (!link) return '';
      return `<p><a href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></p>`;
    }

    return '';
  }).join('');

  return html || '<p></p>';
};
