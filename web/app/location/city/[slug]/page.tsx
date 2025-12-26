import PageContainer from "@/components/layout/page-container";

const Page: React.FC = async () => {
    return (
        <PageContainer breadcrumbs={[
            { label: "Địa điểm", href: "/location" },
            { label: "Thành phố", href: "/location/city" }
        ]}>

        </PageContainer>
    );
};

export default Page;