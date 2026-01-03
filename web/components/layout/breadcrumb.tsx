import Link from "next/link";
import "./breadcrumb.css";
import { HomeFilled } from "@ant-design/icons";

type Props = {
    items?: { label: string; href: string }[];
};

const Breadcrumb: React.FC<Props> = ({ items = [] }) => {
    return (
        <nav
            aria-label="Breadcrumb"
            className="breadcrumb mb-4 flex items-center gap-2 bg-white/90 px-3 py-2 text-sm text-slate-600 shadow-sm backdrop-blur"
        >
            <ol className="flex flex-wrap items-center gap-2" itemScope itemType="https://schema.org/BreadcrumbList">
                <li
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-indigo-700 hover:bg-indigo-50"
                    itemProp="itemListElement"
                    itemScope
                    itemType="https://schema.org/ListItem"
                >
                    <Link href="/" itemProp="item">
                        <span itemProp="name" className="flex items-center gap-1">
                            <HomeFilled />
                            Trang chủ
                        </span>
                    </Link>
                    <meta itemProp="position" content="1" />
                </li>
                {items.map((item, index) => (
                    <li
                        key={item.href}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-slate-600 hover:bg-slate-50"
                        itemProp="itemListElement"
                        itemScope
                        itemType="https://schema.org/ListItem"
                    >
                        <span aria-hidden="true" className="text-slate-300">›</span>
                        <Link
                            href={item.href}
                            itemScope
                            itemType="https://schema.org/WebPage"
                            itemProp="item"
                            itemID={item.href}
                        >
                            <span itemProp="name" className="truncate">
                                {item.label}
                            </span>
                        </Link>
                        <meta itemProp="position" content={(index + 2).toString()} />
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;