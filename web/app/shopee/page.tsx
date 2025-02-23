import { apiShopeeBaseInfoAndLinks } from "@/service/apps/shopee";
import { Pagination } from "antd";
import Link from "next/link";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { pageNum = '1' } = await searchParams
    console.log(pageNum)

    const data = await apiShopeeBaseInfoAndLinks({ pageNum: pageNum, pageSize: 10 });

    return (
        <div className="container mx-auto p-4">
            <h1 className="border-l-4 mb-2 font-medium border-blue-500 px-2 py-1">Chúng tôi bán</h1>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
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
                            <div key={link.linkId}>
                                <a href={link.link} target="_blank" rel="noreferrer">
                                    <img src={link.image} loading="lazy" alt={link.linkName} className="mb-1 transition-transform duration-300 ease-in-out transform hover:scale-105" />
                                    <div className="hover:text-blue-500">{link.linkName}</div>
                                </a>
                            </div>
                        )
                    })
                }
            </div>
            <div className="flex justify-center">
                <span className="mr-2">Trang:</span>
                <ul className="flex">
                    <li className="px-2 border" hidden={parseInt(pageNum as string) === 1}>
                        <Link href={`/shopee?pageNum=${parseInt(pageNum as string) - 1}`}>
                            Previous
                        </Link>
                    </li>
                    <li className="px-2 border">
                        {pageNum}
                    </li>
                    <li className="px-2 border">
                        <Link href={`/shopee?pageNum=${parseInt(pageNum as string) + 1}`}>
                            Next
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
