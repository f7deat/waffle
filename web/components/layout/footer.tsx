"use client";

import { THEME_NAME } from "@/config/theme";
import { ShinecFooter } from "./shinec/footer";
import DefaultFooter from "./default/footer";
import { useAppContext } from "@/contexts/app-context";

const Footer: React.FC = () => {

    const { themeKey } = useAppContext();

    if (themeKey === THEME_NAME.SHINEC) {
        return <ShinecFooter />;
    }
    return <DefaultFooter />
};

export default Footer;