import PageContainer from "@/components/layout/page-container";
import { apiWikiParse } from "@/service/apps/wiki"
import { Metadata } from "next";
import '../style.css';

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { slug } = await params;
    const response = await apiWikiParse(slug);

    return {
        title: `${response.parse.title} - DefZone.Net`,
        description: `Read the Wikipedia article about ${response.parse.title}`,
    };
}

const Page: React.FC<{ params: Params }> = async ({ params }) => {
    const { slug } = await params;

    const response = await apiWikiParse(slug);

    return (
        <PageContainer title={response.parse.title} breadcrumbs={[{ label: "Wiki", href: "/wiki" }]}>
            <div className="prose">
                <div dangerouslySetInnerHTML={{ __html: response.parse.text["*"] }} />
            </div>
        </PageContainer>
    )
}

export default Page;