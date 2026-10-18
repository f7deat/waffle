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
    }
    interface PlaceListItem {
        id: string;
        name: string;
        address: string;
        districtId: number;
        districtName: string;
        provinceId: number;
        provinceName: string;
        categoryName: string;
        thumbnail: string;
        viewCount: number;
        modifiedDate: string;
        normalizedName: string;
        description?: string;
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