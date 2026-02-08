declare namespace API {
    type Role = {
        id: string;
        name: string;
    }
    type RoleUserListItem = {
        id: string;
        userName: string;
        email: string;
        phoneNumber?: string;
        avatar?: string;
        emailConfirmed: boolean;
        phoneNumberConfirmed: boolean;
        dateOfBirth?: string;
        gender?: boolean;
        amount: number;
        districtId?: number;
        lockoutEnd?: string;
        createdAt: string;
        lockoutEnabled: boolean;
    }
}