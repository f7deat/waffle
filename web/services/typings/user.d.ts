declare namespace API {
    interface User {
        id: string;
        userName: string;
        email?: string;
        emailConfirmed?: boolean;
        phoneNumber?: string;
        name?: string;
        avatar?: string;
        roles: string[];
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