import { apiKlookCoupons } from "@/service/apps/klook";

const Page: React.FC = async () => {

    const data = await apiKlookCoupons();
    console.log(data)

    return (
        <div>
            <div className="grid md:grid-cols-4">
            </div>
        </div>
    )
}

export default Page;