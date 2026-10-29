import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { apiCatalogMeta } from '@/services/catalog';
import PlaceDetail from './client';
import { apiPlaceDetail, apiPlaceList } from '@/services/locations/place';
import PageContainer from '@/components/layout/page-container';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { id } = await params;
        const metaResponse = await apiCatalogMeta(id);
        const metaData = metaResponse.data || null;

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
        console.error('Failed to generate place metadata:', error);
        return {
            title: 'Địa điểm',
            description: 'Thông tin chi tiết địa điểm',
        };
    }
}

const Page: React.FC<Props> = async ({ params }) => {
    const { id } = await params;
    const response = await apiPlaceDetail(id);
    const place = response.data || null;
    if (!place) notFound();

    const relatedPlacesResponse = place.districtId
        ? await apiPlaceList({ districtId: place.districtId, current: 1, pageSize: 7 })
        : null;
    const relatedPlaces = (relatedPlacesResponse?.data || []).filter((item) => item.id !== place.id).slice(0, 6);
    const breadcrumbs = [
        { label: 'Địa điểm', href: '/place' },
        ...(place.districtName && place.districtId
            ? [{ label: place.districtName, href: `/district/${place.districtId}` }]
            : []),
        { label: place.name, href: '#' },
    ];

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <PlaceDetail place={place} relatedPlaces={relatedPlaces} />
            </div>
        </PageContainer>
    );
};

export default Page;
