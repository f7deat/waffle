import Link from "next/link"

type Props = {
    title: string;
    href: string;
    icon: React.ReactNode;
}

const Shortcut: React.FC<Props> = ({ title, href, icon }) => {
    return (
        <Link href={href}>
            <div className="flex flex-col gap-1 items-center">
                <div className="h-10 w-10 flex items-center justify-center p-1">
                    {icon}
                </div>
                <div className="text-center text-xs font-medium text-slate-700 hover:text-blue-500">{title}</div>
            </div>
        </Link>
    )
}

export default Shortcut