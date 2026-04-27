declare namespace API {
    interface KolListItem {
        id: string;
        name: string;
        category: string;
        followers: number;
        avatar: string;
        bio: string;
        verified: boolean;
        rating: number;
        reviewCount: number;
        pricePerReview: number;
        userName: string;
        provinceName: string;
    }
    interface KolDetail extends KolListItem {
        description: string;
        socialLinks: {
            tiktok?: string;
            instagram?: string;
            youtube?: string;
            facebook?: string;
        };
        portfolio: string[];
    }
    interface KolBookingRequest {
        placeId: string;
        kolId: string;
        userName: string;
        userEmail: string;
        userPhone: string;
        reviewType: 'photo' | 'video' | 'story' | 'mixed';
        notes?: string;
        budget: number;
    }
    interface KolBooking {
        id: string;
        placeId: string;
        kolId: string;
        kolName: string;
        placeName: string;
        reviewType: 'photo' | 'video' | 'story' | 'mixed';
        status: 'pending' | 'approved' | 'completed' | 'cancelled';
        createdDate: string;
        completedDate?: string;
        budget: number;
    }
    interface KolFilterOptions extends FilterOptions {
        category?: string;
        keyword?: string;
    }
    type InfluencerJobContentType = 'Photo' | 'Video' | 'Story' | 'Reel' | 'Mixed';
    type InfluencerJobStatus = 'Open' | 'InProgress' | 'Completed' | 'Cancelled';
    type InfluencerJobApplicationStatus = 'Pending' | 'Approved' | 'Rejected';
    interface InfluencerJobListItem {
        id: string;
        title: string;
        description: string;
        budget: number;
        budgetMax?: number;
        contentType: InfluencerJobContentType;
        category?: string;
        deadline?: string;
        requiredFollowers?: number;
        brand?: string;
        status: InfluencerJobStatus;
        createdDate: string;
        createdByName: string;
        createdByAvatar?: string;
        applicationCount: number;
    }
    interface CreateInfluencerJobRequest {
        title: string;
        description: string;
        budget: number;
        budgetMax?: number;
        contentType: number;
        category?: string;
        deadline?: string;
        requiredFollowers?: number;
        brand?: string;
    }
    interface InfluencerJobFilterOptions extends FilterOptions {
        status?: string;
        category?: string;
    }
    interface MyAppliedInfluencerJobItem {
        id: string;
        jobId: string;
        appliedDate: string;
        message?: string;
        applicationStatus: InfluencerJobApplicationStatus | number;
        title: string;
        brand?: string;
        budget: number;
        budgetMax?: number;
        contentType: InfluencerJobContentType | number;
        category?: string;
        deadline?: string;
        jobStatus: InfluencerJobStatus | number;
        createdDate: string;
        postedByName: string;
    }
}
