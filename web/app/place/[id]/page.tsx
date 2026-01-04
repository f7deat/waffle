import { Metadata } from 'next';
import { apiCatalogMeta } from '@/service/catalog';
import PlaceDetail from './client';

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
    return <PlaceDetail placeId={id} />;
};

export default Page;