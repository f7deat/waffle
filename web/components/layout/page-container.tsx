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
            <div className="container mx-auto">
                {children}
            </div>
        </main>
    )
}

export default PageContainer;