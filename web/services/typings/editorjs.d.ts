export type EditorJSType = {
    time: number;
    blocks: EditorJSBlock[];
    version: string;
}

export type EditorJSBlock = {
    id: string;
    type: 'paragraph' | 'header' | 'list' | 'image' | 'quote' | 'code' | 'delimiter';
    data: EditorJSParagraphData | EditorJSHeaderData | EditorJSListData | EditorJSImageData | EditorJSQuoteData | EditorJSCodeData | EditorJSDelimiterData;
}

export type EditorJSImageData = {
    caption?: string;
    withBorder?: boolean;
    withBackground?: boolean;
    stretched?: boolean;
    file?: {
        url: string;
    };
}

export type EditorJSHeaderData = {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
}

export type EditorJSListData = {
    style: 'ordered' | 'unordered';
    items: {
        content: string;
        items: {
            content: string;
        }[];
    }[];
}

export type EditorJSQuoteData = {
    text: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
}

export type EditorJSCodeData = {
    code: string;
}

export type EditorJSDelimiterData = {
    // No data for delimiter
}

export type EditorJSParagraphData = {
    text: string;
}