import Breadcrumb from "./breadcrumb";

type Props = {
    children?: React.ReactNode;
    breadcrumbs?: { label: string; href: string }[];
    fluid?: boolean;
}

const PageContainer: React.FC<Props> = ({ children, breadcrumbs, fluid }) => {
    return (
        <main className="h-full">
            <Breadcrumb items={breadcrumbs} />
            <div className={`container mx-auto mb-4 px-2 md:px-0 ${fluid ? 'max-w-full' : ''}`}>
                {children}
            </div>
        </main>
    )
}

export default PageContainer;