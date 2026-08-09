export type RoleListType = {
    id: string;
    name: string;
    displayName?: string;
}

export type RoleUserListItem = {
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

export type RoleDetailType = {
    id: string;
    name: string;
    normalizedName: string;
    displayName?: string;
}