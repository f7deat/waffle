import Link from "next/link";
import './breadcrumb.css';
import { ArrowLeftOutlined, HomeFilled } from "@ant-design/icons";

type Props = {
    items?: { label: string; href: string }[];
}

const Breadcrumb: React.FC<Props> = ({ items }) => {
    return (
        <div className="flex items-center gap-2 border-b text-sm breadcrumb mb-4 bg-white">
            <div className="p-2 border-r flex items-center gap-1 text-gray-500">
                <ArrowLeftOutlined />
            </div>
            <ol className="p-2 flex items-center gap-1 text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href='/' itemProp="item">
                        <span itemProp="name" className="flex items-center gap-1">
                            <HomeFilled />
                            Trang chủ
                        </span>
                    </Link>
                    <meta itemProp="position" content="1" />
                </li>
                {
                    items?.map((item, index) => (
                        <li key={index} itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                            <Link href={item.href} itemScope itemType="https://schema.org/WebPage" itemProp="item" itemID={item.href}>
                                <span itemProp="name">{item.label}</span>
                            </Link>
                            <meta itemProp="position" content={(index + 2).toString()} />
                        </li>
                    ))
                }
            </ol>
        </div>
    )
}

export default Breadcrumb;