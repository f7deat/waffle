import Link from "next/link"

type Props = {
    title: string;
    href: string;
    icon: React.ReactNode;
}

const Shortcut: React.FC<Props> = ({ title, href, icon }) => {
    return (
        <Link href={href}>
            <div className="flex flex-col gap-1 items-center rounded p-1 w-20 hover:shadow">
                <div className="h-10 w-10 bg-white flex items-center justify-center p-2 shadow text-slate-900">
                    {icon}
                </div>
                <div className="text-center text-xs font-medium text-white [text-shadow:_0_4px_4px_rgb(99_102_241_/_0.8)]">{title}</div>
            </div>
        </Link>
    )
}

export default Shortcut