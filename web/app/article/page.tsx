import PageContainer from "@/components/layout/page-container";
import { apiCatalogList } from "@/service/apps/defzone";
import { DoubleLeftOutlined, LeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Link from "next/link";
import { ArticleListItem } from "./typings";

const Page: React.FC = async () => {

    const response = await apiCatalogList({ current: 1 });
    const articles = response.data.data;

    return (
        <PageContainer title="Article" breadcrumbs={[{ label: 'Article', href: '/article' }]}>
            <table className="w-full border-collapse text-sm border-b">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th className="py-1 px-2">Name</th>
                        <th className="py-1 px-2">View Count</th>
                        <th className="py-1 px-2">Modified Date</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.map((article: ArticleListItem) => (
                        <tr key={article.id} className="hover:bg-blue-50">
                            <td className="px-2 py-1">{article.name}</td>
                            <td className="px-2 py-1">{article.viewCount}</td>
                            <td className="px-2 py-1">{dayjs(article.modifiedDate).format('DD/MM/YYYY HH:mm')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
                    <div className="text-sm flex">
                        <Link href="/article" className="w-6 h-6 flex items-center justify-center bg-gray-100"><DoubleLeftOutlined /></Link>
                        <Link href="/article?current=1" className="w-6 h-6 flex items-center justify-center bg-gray-100">
                            <LeftOutlined />
                        </Link>
                        <Link href="/article?current=1" className="w-6 h-6 flex items-center justify-center bg-gray-100">
                            1
                        </Link>
                    </div>
        </PageContainer>
    );
};

export default Page;