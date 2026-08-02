import PageContainer from "@/components/layout/page-container"

const Page: React.FC = () => {
    return (
        <PageContainer breadcrumbs={[
            {
                href: '/shop',
                label: 'Cửa hàng'
            },
            {
                href: '/shop/category',
                label: 'Danh mục sản phẩm'
            }
        ]}>

        </PageContainer>
    )
}

export default Page;