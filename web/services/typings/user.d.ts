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
}