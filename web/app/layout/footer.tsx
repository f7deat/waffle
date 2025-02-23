import { Tooltip } from "antd";
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer>
            <div className="flex">
                <div className="h-12 flex items-center justify-center bg-slate-900 text-white w-12 hover:text-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-5 h-5" fill="currentColor">
                        <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
                    </svg>
                </div>
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