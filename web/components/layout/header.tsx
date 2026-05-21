"use server";

import { THEME_NAME } from "@/config/theme";
import { ShinecHeader } from "./shinec/header";
import DefaultHeader from "./default/header";

const NEXT_PUBLIC_THEME = process.env.NEXT_PUBLIC_THEME;

const Header: React.FC = async () => {
    if (NEXT_PUBLIC_THEME === THEME_NAME.SHINEC) {
        return <ShinecHeader currentPage="home" />
    }
    return <DefaultHeader />
};

export default Header;