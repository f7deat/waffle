'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiPlaceImages } from '@/services/locations/place';
import { apiCatalogTags } from '@/services/catalog';
import { Image, Masonry } from 'antd';
import Block from '@/components/block';

interface PlaceDetailProps {
    place: API.PlaceDetail;
}

const PlaceDetail: React.FC<PlaceDetailProps> = ({ place }) => {
    const [placeImages, setPlaceImages] = useState<API.PlaceImage[]>([]);
    const [tags, setTags] = useState<API.Tag[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [loadingTags, setLoadingTags] = useState(false);

    useEffect(() => {
        const fetchPlaceImages = async () => {
            if (!place) return;
            try {
                setLoadingImages(true);
                const data = await apiPlaceImages(place.id);
                setPlaceImages(data.data || []);
            } catch (error) {
                console.error('Failed to fetch place images:', error);
                setPlaceImages([]);
            } finally {
                setLoadingImages(false);
            }
        };

        fetchPlaceImages();
    }, [place]);

    useEffect(() => {
        const fetchTags = async () => {
            const catalogId = place?.id;
            if (!catalogId) {
                setTags([]);
                return;
            }
            try {
                setLoadingTags(true);
                const data = await apiCatalogTags(catalogId);
                const tagList = Array.isArray(data.data) ? data.data : [];
                setTags(tagList);
            } catch (error) {
                console.error('Failed to fetch tags:', error);
                setTags([]);
            } finally {
                setLoadingTags(false);
            }
        };

        fetchTags();
    }, [place?.id]);

    return (
        <div>

                {/* Gallery */}
                <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold">Photo Gallery</h2>
                        {!loadingImages && placeImages.length > 0 && (
                            <span className="text-sm text-gray-500">{placeImages.length} photos</span>
                        )}
                    </div>
                    {loadingImages ? (
                        <div className="text-center py-6">
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        </div>
                    ) : placeImages.length > 0 ? (
                        <Masonry columns={3} gutter={8}
                            items={placeImages.map((image) => (
                                {
                                    key: image.id,
                                    data: image.url
                                }
                            ))}

                            itemRender={({ data }) => (
                                <Image src={`${data}?w=523&auto=format`} alt="IMG" className='w-full' />
                            )}
                        >
                        </Masonry>
                    ) : (
                        <p className="text-gray-600">No gallery images yet.</p>
                    )}
                </div>

                {/* Content */}
                <div className="prose max-w-none bg-white p-4 rounded-lg">
                    {place.content?.blocks?.map((block, index) => <Block key={index} {...block} />)}
                </div>


                {(loadingTags || tags.length > 0) && (
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xl font-bold">Tags</h2>
                            {loadingTags && (
                                <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                            )}
                        </div>
                        {tags.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((tag) => (
                                    <Link key={tag.id} href={`/search?q=${encodeURIComponent(tag.name)}`}>
                                        <span className="inline-block rounded-full bg-blue-50 text-blue-700 text-sm px-3 py-1 hover:bg-blue-100 transition-colors">#{tag.name}</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            !loadingTags && <p className="text-sm text-gray-600">No tags for this place yet.</p>
                        )}
                    </div>
                )}

        </div>
    );
};

export default PlaceDetail;
