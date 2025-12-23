import Link from "next/link";
import './breadcrumb.css';

type Props = {
    items?: { label: string; href: string }[];
}

const Breadcrumb: React.FC<Props> = ({ items }) => {
    return (
        <div className="flex items-center gap-2 border-b text-sm breadcrumb mb-4">
            <div className="p-2 border-r flex items-center gap-1 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                </svg>
            </div>
            <ol className="p-2 flex items-center gap-1 text-gray-500" itemScope itemType="https://schema.org/BreadcrumbList">
                <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
                    <Link href='/' itemProp="item">
                        <span itemProp="name" className="flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-house-door-fill" viewBox="0 0 16 16">
                                <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
                            </svg>
                            Home
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