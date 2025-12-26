/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiShopeeBaseInfoAndLinks } from "@/service/apps/shopee";
import Link from "next/link";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const { pageNum = '1' } = await searchParams

    const data = await apiShopeeBaseInfoAndLinks({ pageNum: pageNum, pageSize: 12 });

    return (
        <PageContainer breadcrumbs={[{ label: "Shopee", href: "/shopee" }]}> 
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
            <div className="flex justify-center text-sm items-center">
                <ul className="flex gap-1">
                    <li className="p-1 border flex items-center" hidden={parseInt(pageNum as string) === 1}>
                        <Link href={`/shopee?pageNum=${parseInt(pageNum as string) - 1}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>

                        </Link>
                    </li>
                    <li className="w-8 h-8 border flex items-center justify-center bg-slate-100">
                        {pageNum}
                    </li>
                    <li className="p-1 bg-white border flex items-center">
                        <Link href={`/shopee?pageNum=${parseInt(pageNum as string) + 1}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </Link>
                    </li>
                </ul>
            </div>
        </PageContainer>
    );
}
