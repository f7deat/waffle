import { THEME_NAME } from "@/config/theme";
import { ShinecHeader } from "./shinec/header";
import DefaultHeader from "./default/header";

const { THEME } = process.env;

const Header: React.FC = () => {
    if (THEME === THEME_NAME.SHINEC) {
        return <ShinecHeader currentPage="home" />
    }
    return <DefaultHeader />
};

export default Header;