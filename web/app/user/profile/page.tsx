"use client";

import PageContainer from "@/components/layout/page-container"
import { useRouter } from "next/navigation";

const Page: React.FC = () => {

    const router = useRouter();

    if (true) {
        router.push("/user/login");
    }

    return (
        <PageContainer></PageContainer>
    )
}

export default Page