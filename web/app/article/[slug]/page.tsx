import PageContainer from "@/components/layout/page-container";
import { apiCatalogMeta } from "@/service/catalog";
import { Metadata } from "next";

type Params = {
    slug: string;
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = params;

    const meta = await apiCatalogMeta(slug);

    return {
        title: `${meta.data.name} - DefZone.Net`,
        description: meta.data.description,
    };
}

const Page: React.FC = () => {
    return (
        <PageContainer
            title="Article"
            breadcrumbs={[
                { label: "Article", href: "/article" },
            ]}
        >
            {/* Content goes here */}
        </PageContainer>
    );
};

export default Page;