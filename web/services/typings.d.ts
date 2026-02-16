declare namespace API {
    interface TResult<T> {
        succeeded: boolean;
        message: string;
        data: T;
    }
    interface ListResult<T> {
        data: T[];
        total: number;
    }
    interface FilterOptions {
        current: number;
        pageSize: number;
        locale?: 'vi-VN' | 'en-US' | 'zh-CN' | 'ja-JP' | 'ko-KR' | string;
    }
    type BlockType = 'paragraph' | 'header' | 'image' | 'list' | 'quote' | 'code' | 'simpleImage' | 'image';
    interface BlockData {
        text?: string;
        level?: number;
        html?: string;
        code?: string;
        items?: EditorjsItem[];
        url?: string;
        caption?: string;
        align?: 'left' | 'center' | 'right';
        embed?: string;
    }
    interface Block {
        type: BlockType;
        data: BlockData;
    }
    interface BlockEditor {
        version: string;
        blocks: Block[];
    }
    interface Meta {
        title: string;
        description: string;
        thumbnail?: string;
    }
    interface Tag {
        id: string;
        name: string;
        normalizedName: string;
    }
    interface IOption {
        label: string;
        value: string;
    }
    interface EditorjsItem {
        content: string;
        items?: EditorjsItem[];
    }
}