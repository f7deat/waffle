import { apiWikiParse } from "@/service/apps/wiki"
import { Metadata } from "next";
import Link from "next/link";

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
        <>
            <main>
                <div className="flex justify-end">
                    <Link href="/wiki" className="font-medium hover:text-blue-500 px-4 py-1">Wiki</Link>
                </div>
                <div className="container mx-auto p-4">
                    <div dangerouslySetInnerHTML={{ __html: response.parse.text["*"] }} />
                </div>
            </main>
        </>
    )
}

export default Page;