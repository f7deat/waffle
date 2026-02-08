declare namespace API {
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
    }
    interface PlaceListItem {
        id: string;
        name: string;
        address: string;
        districtId: number;
        districtName: string;
        provinceId: number;
        provinceName: string;
        thumbnail: string;
        viewCount: number;
        modifiedDate: string;
        normalizedName: string;
    }
    interface PlaceDetail extends PlaceListItem {
        content: API.BlockEditor;
    }
    interface PlaceImage {
        id: string;
        placeId: string;
        url: string;
        uploadedAt: string;
    }
}