declare namespace API {
    interface DistrictListItem {
        id: number;
        name: string;
        provinceId: number;
        provinceName: string;
        thumbnail: string;
    }
    interface StreetFilterOptions extends FilterOptions {
        districtId?: number;
    }
    interface StreetListItem {
        id: number;
        name: string;
        districtId: number;
        districtName: string;
        provinceId: number;
        thumbnail: string;
    }
}