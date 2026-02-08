import { Metadata } from 'next';
import { apiCatalogMeta } from '@/services/catalog';
import PlaceDetail from './client';
import { apiPlaceDetail } from '@/services/locations/place';
import PageContainer from '@/components/layout/page-container';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { id } = await params;

        let metaData: API.Meta | null = null;
        try {
            const metaResponse = await apiCatalogMeta(id);
            metaData = metaResponse.data || null;
        } catch (error) {
            console.error('Failed to fetch meta:', error);
        }

        return {
            title: metaData?.title,
            description: metaData?.description,
            openGraph: {
                title: metaData?.title,
                description: metaData?.description,
                images: metaData?.thumbnail ? [{ url: metaData.thumbnail }] : [],
            },
        };
    } catch (error) {
        console.error('Failed to generate metadata:', error);
        return {
            title: 'Place',
            description: 'Place details',
        };
    }
}

const Page: React.FC<Props> = async ({ params }) => {
    const { id } = await params;
    const response = await apiPlaceDetail(id);
    const place = response?.data || null;

    const breadcrumbs = place ? [
        { label: 'Địa điểm', href: '/place' },
        { label: place.districtName, href: `/district/${place.districtId}` },
        { label: place.name, href: '#' },
    ] : [{ label: 'Địa điểm', href: '/place' }];

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            {place ? (
                <PlaceDetail place={place} />
            ) : (
                <div className="text-center py-12">
                    <p className="text-red-500">Place not found.</p>
                </div>
            )}
        </PageContainer>
    );
};

export default Page;