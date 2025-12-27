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
        normalizedName: string;
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
}
