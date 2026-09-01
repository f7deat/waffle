import PageContainer from "@/components/layout/page-container";

interface PageProps {
    params: Promise<{ slug: string }>;
}

const Page: React.FC<PageProps> = async ({ params }) => {
    const { slug } = await params;
    // Your component logic here
    return (
        <PageContainer breadcrumbs={[
            {
                label: 'Cửa hàng',
                href: '/shop'
            },
            {
                label: `Tag: ${slug}`,
                href: `/shop/tags/${slug}`
            }
        ]}>
            <h1>Tag: {slug}</h1>
            {/* Render tag-specific content */}
        </PageContainer>
    );
};

export default Page;