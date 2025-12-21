import Breadcrumb from "./breadcrumb";

type Props = {
    children?: React.ReactNode;
    title?: string;
    breadcrumbs?: { label: string; href: string }[];
}

const PageContainer: React.FC<Props> = ({ children, title, breadcrumbs }) => {
    return (
        <main className="bg-white h-full">
            <Breadcrumb items={breadcrumbs} />
            <div className="font-medium border-b flex">
                <h1 className="px-4 py-1 bg-slate-100 text-truncate text-lg">{title}</h1>
            </div>
            <div className="md:flex h-[calc(100vh-130px)] container mx-auto">
                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default PageContainer;