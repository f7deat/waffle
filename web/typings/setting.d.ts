export type SiteSetting = {
    name: string;
    logo: string;
    title: string;
    description: string;
    phoneNumber?: string;
    email?: string;
    address?: string;
    theme: string;
}

export type SettingLink = {
    href: string;
    name?: string;
    target?: string;
}

export type SocialLinks = {
    facebookUrl?: string;
    youtubeUrl?: string;
    xUrl?: string;
    instagramUrl?: string;
}

export type HeaderSetting = {
    brand?: string;
    logo?: string;
    topMenu?: SettingLink[];
    searchPlaceHolder?: string;
}

export type FooterSetting = {
    companyName?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    social?: SocialLinks;
    links?: SettingLink[];
}