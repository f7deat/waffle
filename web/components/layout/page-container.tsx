import Breadcrumb from "./breadcrumb";

type Props = {
    children?: React.ReactNode;
    title?: string;
}

const PageContainer: React.FC<Props> = ({ children, title }) => {
    return (
        <main className="bg-white">
            <div className="font-medium border-b flex">
                <h1 className="px-4 py-1 bg-slate-100">{title}</h1>
            </div>
            <Breadcrumb />
            <div className="px-4">
                {children}
            </div>
        </main>
    )
}

export default PageContainer;