"use server";

import { THEME_NAME } from "@/config/theme";
import { ShinecFooter } from "./shinec/footer";
import DefaultFooter from "./default/footer";

const NEXT_PUBLIC_THEME = process.env.NEXT_PUBLIC_THEME;

const Footer: React.FC = async () => {

    if (NEXT_PUBLIC_THEME === THEME_NAME.SHINEC) {
        return <ShinecFooter />;
    }
    return <DefaultFooter />
};

export default Footer;