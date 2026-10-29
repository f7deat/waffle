declare namespace API {
    interface ProvinceFilterOptions extends FilterOptions {
        name?: string;
    }
    interface ProvinceListItem {
        id: number;
        name: string;
        countryId: number;
        districtCount: number;
    }
    interface DistrictListItem {
        id: number;
        name: string;
        provinceId: number;
        provinceName: string;
        thumbnail: string;
    }
    interface PlaceFilterOptions extends FilterOptions {
        districtId?: number;
        provinceId?: number;
        name?: string;
        influencerUserName?: string;
        minPrice?: number;
        maxPrice?: number;
        hasOpeningHours?: boolean;
        amenity?: string;
        sortBy?: string;
    }
    interface PlaceListItem {
        id: string;
        name: string;
        address?: string;
        districtId?: number;
        districtName?: string;
        provinceId?: number;
        provinceName?: string;
        categoryName?: string;
        thumbnail?: string;
        viewCount: number;
        modifiedDate: string;
        normalizedName: string;
        description?: string;
        influencerName?: string;
        influencerUserName?: string;
        influencerAvatar?: string;
        openingHours?: string;
        priceFrom?: number;
        priceTo?: number;
        amenities?: string;
        latitude?: number;
        longitude?: number;
    }
    interface PlaceDetail extends PlaceListItem {
        content: API.BlockEditor;
        phoneNumber?: string;
        openingHours?: string;
        priceFrom?: number;
        priceTo?: number;
        amenities?: string;
        affiliateLink?: string;
        latitude?: number;
        longitude?: number;
        images?: PlaceImage[];
        influencer?: {
            id: string;
            userName?: string;
            name?: string;
            avatar?: string;
        };
    }
    interface PlaceImage {
        id: string;
        placeId: string;
        url: string;
        uploadedAt: string;
    }
}