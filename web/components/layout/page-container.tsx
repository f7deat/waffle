import Breadcrumb from "./breadcrumb";

type Props = {
    children?: React.ReactNode;
    title?: string;
    breadcrumbs?: { label: string; href: string }[];
}

const PageContainer: React.FC<Props> = ({ children, title, breadcrumbs }) => {
    return (
        <main className="bg-white">
            <div className="font-medium border-b flex">
                <h1 className="px-4 py-1 bg-slate-100">{title}</h1>
            </div>
            <Breadcrumb items={breadcrumbs} />
            <div className="md:flex">
                <div className="w-40 border-r"></div>
                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default PageContainer;