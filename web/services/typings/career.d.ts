declare namespace API {
    type CareerJobType = 0 | 1 | 2 | 3 | number;
    type CareerJobStatus = 0 | 1 | 2 | 3 | number;

    interface CareerDetailBlock {
        id?: string;
        type: string;
        data: {
            text?: string;
            level?: number;
            style?: "ordered" | "unordered";
            items?: { content: string; items?: { content: string }[] }[];
            file?: { url?: string };
            caption?: string;
            code?: string;
        };
    }

    interface CareerEditorContent {
        time?: number;
        version?: string;
        blocks?: CareerDetailBlock[];
    }

    interface CareerListItem {
        id: string;
        normalizedName: string;
        title: string;
        description?: string;
        jobRequirements?: string;
        salaryRange?: string;
        jobLocation?: string;
        jobType: CareerJobType;
        status: CareerJobStatus;
        viewCount: number;
        applicationCount: number;
        createdDate: string;
        modifiedDate?: string;
        createdBy: string;
        modifiedBy?: string;
    }

    interface CareerDetailItem {
        id: string;
        title: string;
        description?: string;
        detail?: CareerEditorContent | null;
        detailJson?: CareerEditorContent | null;
        jobType: CareerJobType;
        status: CareerJobStatus;
    }
}
