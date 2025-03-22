import { Tooltip } from "antd";
import Link from "next/link";
import Start from "../desktop/start";

const Footer: React.FC = () => {
    return (
        <footer className="border-t border-slate-800">
            <div className="flex">
                <Start />
                <div className="w-96">
                    <input type="search" placeholder="Search" className="w-full h-12 px-4 bg-slate-800 text-white" />
                </div>
                <div className="flex-1 bg-slate-900">

                </div>
                <Tooltip title="DefZone.Net" placement="rightTop">
                    <Link href="/" className="border-l border-slate-800 bg-slate-900 w-1">
                        <span hidden>Home</span>
                    </Link>
                </Tooltip>
            </div>
        </footer>
    )
}

export default Footer;