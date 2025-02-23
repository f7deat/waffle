import Link from "next/link"

type Props = {
    title: string;
    href: string;
    icon: React.ReactNode;
}

const Shortcut: React.FC<Props> = ({ title, href, icon }) => {
    return (
        <Link href={href}>
            <div className="flex flex-col gap-1 items-center shadow bg-white shadow rounded p-1 w-20">
                <div className="h-10 w-10 flex items-center justify-center p-1">
                    {icon}
                </div>
                <div className="text-center text-xs font-medium hover:text-blue-500 drop-shadow">{title}</div>
            </div>
        </Link>
    )
}

export default Shortcut