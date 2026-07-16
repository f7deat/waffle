"use client";

import { THEME_NAME } from "@/config/theme";
import { ShinecHeader } from "./shinec/header";
import DefaultHeader from "./default/header";
import { useAppContext } from "@/contexts/app-context";

const Header: React.FC = () => {

    const { settings } = useAppContext();

    if (settings?.theme === THEME_NAME.SHINEC) {
        return <ShinecHeader currentPage="home" />
    }
    return <DefaultHeader />
};

export default Header;