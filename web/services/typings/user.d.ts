declare namespace API {
    interface User {
        id: string;
        userName: string;
        email?: string;
        emailConfirmed?: boolean;
        phoneNumber?: string;
        name?: string;
        avatar?: string;
        amount?: number;
        roles: string[];
    }
    interface ProfileSocialAccount {
        socialPlatformId: string;
        socialPlatformName: string;
        profileUrl?: string;
        followersCount?: number | null;
        isVerified: boolean;
    }
    interface InfluencerProfileDetail {
        isOpenForBooking: boolean;
        bookingEmail?: string;
        bookingPhone?: string;
        mediaKitUrl?: string;
        mediaKitName?: string;
        mediaKitSize?: number;
        mediaKitUpdatedAt?: string;
        showEngagementStats: boolean;
    }
    interface BusinessProfileDetail {
        companyName?: string;
        taxCode?: string;
        businessType?: string;
        representativeName?: string;
        website?: string;
        contactEmail?: string;
        contactPhone?: string;
        businessAddress?: string;
        description?: string;
        isVerified?: boolean;
    }
    interface ProfileDetail {
        id: string;
        userName: string;
        name?: string;
        email?: string;
        phoneNumber?: string;
        avatar?: string;
        coverImage?: string;
        tagline?: string;
        bio?: string;
        showFavoritePlacesOnMap: boolean;
        notifyOnComments: boolean;
        provinceName?: string;
        roles: string[];
        completeness: number;
        activityAreas: { id: number; name: string }[];
        tags: { id: string; name: string }[];
        socialAccounts: ProfileSocialAccount[];
        influencer?: InfluencerProfileDetail | null;
        business?: BusinessProfileDetail | null;
    }
    interface WalletTopupCheckout {
        orderCode: number;
        amount: number;
        status: string;
        checkoutUrl: string;
        expiresAt: string;
    }
    interface WalletTopupStatus {
        orderCode: number;
        amount: number;
        status: "Pending" | "Paid" | "Cancelled" | "Failed" | "Expired";
        createdAt: string;
        paidAt?: string;
    }
    interface WalletWithdrawalRequest {
        id: string;
        userId: string;
        amount: number;
        bankName: string;
        accountHolder: string;
        accountNumber: string;
        invoiceNumber: string;
        status: "Pending" | "Approved" | "Paid" | "Rejected";
        note?: string;
        adminNote?: string;
        createdAt: string;
        updatedAt?: string;
    }
    interface UpdateProfileDetailArgs {
        name: string;
        userName: string;
        tagline?: string;
        bio?: string;
        showFavoritePlacesOnMap: boolean;
        notifyOnComments: boolean;
        provinceIds: number[];
        tags: string[];
        socialAccounts: { socialPlatformId: string; profileUrl: string; followersCount?: number | null; isVerified: boolean }[];
        influencer?: Pick<InfluencerProfileDetail, "isOpenForBooking" | "bookingEmail" | "bookingPhone" | "showEngagementStats">;
        business?: Omit<BusinessProfileDetail, "isVerified">;
    }
    interface SocialPlatformItem {
        id: string;
        code: string;
        name: string;
        isActive: boolean;
    }
    interface UserBasicInfo {
        id: string;
        userName: string;
        name?: string;
        avatar?: string;
        emailConfirmed?: boolean;
        phoneNumberConfirmed?: boolean;
        dateOfBirth?: string;
        createdAt: string;
        districtId?: number;
        districtName?: string;
        provinceName?: string;
        gender?: boolean;
    }
}