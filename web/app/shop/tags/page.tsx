import PageContainer from "@/components/layout/page-container";

const Page: React.FC = async () => {
    // Your component logic here
    return (
        <PageContainer breadcrumbs={[
            {
                label: 'Cửa hàng',
                href: '/shop'
            },
            {
                label: `Tag`,
                href: `/shop/tags`
            }
        ]}>
            {/* Render tag-specific content */}
        </PageContainer>
    );
};

export default Page;