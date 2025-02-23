import PageContainer from "@/components/layout/page-container";
import { apiShopeeBaseInfoAndLinks } from "@/service/apps/shopee";
import Link from "next/link";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { pageNum = '1' } = await searchParams
    console.log(pageNum)

    const data = await apiShopeeBaseInfoAndLinks({ pageNum: pageNum, pageSize: 12 });

    return (
        <PageContainer title="Shopee">
            <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-4 mb-4">
                {
                    data.data.data.landingPageLinkList.linkList.map((link: {
                        linkId: string;
                        link: string;
                        linkName: string;
                        image: string;
                        linkType: string;
                        groupIds: string[];
                    }) => {
                        return (
                            <div key={link.linkId} className="bg-white">
                                <a href={link.link} target="_blank" rel="noreferrer">
                                    <img src={link.image} loading="lazy" alt={link.linkName} className="mb-1 transition-transform duration-300 ease-in-out transform hover:scale-105" />
                                    <div className="hover:text-blue-500 py-1 px-2 font-medium">{link.linkName}</div>
                                </a>
                            </div>
                        )
                    })
                }
            </div>
            <div className="flex justify-center">
                <span className="mr-2">Trang:</span>
                <ul className="flex gap-1">
                    <li className="px-2 border bg-white" hidden={parseInt(pageNum as string) === 1}>
                        <Link href={`/shopee?pageNum=${parseInt(pageNum as string) - 1}`}>
                            Previous
                        </Link>
                    </li>
                    <li className="px-2 bg-white">
                        {pageNum}
                    </li>
                    <li className="px-2 bg-white">
                        <Link href={`/shopee?pageNum=${parseInt(pageNum as string) + 1}`}>
                            Next
                        </Link>
                    </li>
                </ul>
            </div>
        </PageContainer>
    );
}
