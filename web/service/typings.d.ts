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
    }
    type BlockType = 'paragraph' | 'header' | 'image' | 'list' | 'quote' | 'code';
    interface BlockData {
        text?: string;
        level?: number;
        html?: string;
        code?: string;
        items?: string[];
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
        name: string;
        description: string;
    }
}