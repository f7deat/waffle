import Breadcrumb from "./breadcrumb";

type Props = {
    children?: React.ReactNode;
    breadcrumbs?: { label: string; href: string }[];
    fluid?: boolean;
}

const PageContainer: React.FC<Props> = ({ children, breadcrumbs, fluid }) => {
    return (
        <main className="bg-white h-full">
            <Breadcrumb items={breadcrumbs} />
            <div className={`container mx-auto mb-4 ${fluid ? 'max-w-full px-4' : ''}`}>
                {children}
            </div>
        </main>
    )
}

export default PageContainer;