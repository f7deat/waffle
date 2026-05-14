import { THEME_NAME } from "@/config/theme";
import { ShinecFooter } from "./shinec/footer";
import DefaultFooter from "./default/footer";

const { THEME } = process.env;

const Footer: React.FC = () => {

    if (THEME === THEME_NAME.SHINEC) {
        return <ShinecFooter />;
    }
    return <DefaultFooter />
};

export default Footer;