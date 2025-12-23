import Breadcrumb from "./breadcrumb";

type Props = {
    children?: React.ReactNode;
    breadcrumbs?: { label: string; href: string }[];
}

const PageContainer: React.FC<Props> = ({ children, breadcrumbs }) => {
    return (
        <main className="bg-white h-full">
            <Breadcrumb items={breadcrumbs} />
            <div className="container mx-auto mb-4">
                {children}
            </div>
        </main>
    )
}

export default PageContainer;