import Link from "next/link"

const Breadcrumb: React.FC = () => {
    return (
        <div className="flex items-center gap-2 border-b mb-2 text-sm">
            <div className="px-4 py-1 border-r">
                Back
            </div>
            <div className="px-4 py-1">
                <Link href='/'>Home</Link>
            </div>
        </div>
    )
}

export default Breadcrumb;