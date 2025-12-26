import PageContainer from "@/components/layout/page-container"
import { apiCityList } from "@/service/location"
import Link from "next/link";

const Page: React.FC = async () => {

    const data = await apiCityList();

    return (
        <PageContainer breadcrumbs={[{ label: "Location", href: "/location" }]}>
            {
                data.data.map((item: { code: number, name: string, codename: string }) => (
                    <div key={item.code} className="p-1 border-b border-gray-200 flex items-center gap-2">
                        <Link href={`/location/city/${item.codename}`}>
                            <div className="text-gray-900 hover:text-blue-500 text-sm">{item.name}</div>
                        </Link>
                    </div>
                ))
            }
        </PageContainer>
    )
}

export default Page