import { Metadata } from "next";
import InfluencerRegisterForm from "./client";

export async function generateMetadata(): Promise<Metadata> {
    return {
        title: "Đăng ký trở thành Influencer - DefZone.Net",
        description: "Đăng ký trở thành influencer của Waffle để nhận brief hợp tác, ưu đãi trải nghiệm và được ưu tiên ghim trên danh sách KOL tại các địa điểm bạn yêu thích.",
        openGraph: {
            title: "Đăng ký Influencer",
            description: "Đăng ký trở thành influencer của Waffle để nhận brief hợp tác, ưu đãi trải nghiệm và được ưu tiên ghim trên danh sách KOL tại các địa điểm bạn yêu thích.",
        },
    };
}

const Page = () => {
    return <InfluencerRegisterForm />;
};

export default Page;
