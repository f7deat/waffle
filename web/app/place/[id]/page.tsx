/* eslint-disable @next/next/no-img-element */
'use client';

import { JSX, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import PageContainer from "@/components/layout/page-container";
import KolList from "@/components/place/kol-list";
import { apiPlaceDetail, apiPlaceRandom, apiPlaceList, apiPlaceImages } from '@/service/locations/place';
import { apiKolByPlace } from '@/service/kol/kol';
import { Image } from 'antd';

const Page: React.FC = () => {
    const params = useParams();
    const placeId = Array.isArray(params.id) ? params.id[0] : params.id;
    const [place, setPlace] = useState<API.PlaceDetail | null>(null);
    const [randomPlaces, setRandomPlaces] = useState<API.PlaceListItem[]>([]);
    const [relatedPlaces, setRelatedPlaces] = useState<API.PlaceListItem[]>([]);
    const [placeImages, setPlaceImages] = useState<API.PlaceImage[]>([]);
    const [kolList, setKolList] = useState<API.KolListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingRandom, setLoadingRandom] = useState(false);
    const [loadingRelated, setLoadingRelated] = useState(false);
    const [loadingImages, setLoadingImages] = useState(false);
    const [loadingKol, setLoadingKol] = useState(false);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                setLoading(true);
                const data = await apiPlaceDetail(placeId as string);
                setPlace(data.data);
            } catch (error) {
                console.error('Failed to fetch place:', error);
                setPlace(null);
            } finally {
                setLoading(false);
            }
        };

        if (placeId) {
            fetchPlace();
        }
    }, [placeId]);

    useEffect(() => {
        const fetchRandomPlaces = async () => {
            try {
                setLoadingRandom(true);
                const data = await apiPlaceRandom({ current: 1, pageSize: 6 });
                const places = data.data || [];
                setRandomPlaces(places);
            } catch (error) {
                console.error('Failed to fetch random places:', error);
                setRandomPlaces([]);
            } finally {
                setLoadingRandom(false);
            }
        };

        fetchRandomPlaces();
    }, []);

    useEffect(() => {
        const fetchRelatedPlaces = async () => {
            if (!place?.streetId) return;
            try {
                setLoadingRelated(true);
                const data = await apiPlaceList({ 
                    streetId: place.streetId, 
                    current: 1, 
                    pageSize: 6 
                });
                const places = (data.data || []).filter(p => p.id !== place.id);
                setRelatedPlaces(places);
            } catch (error) {
                console.error('Failed to fetch related places:', error);
                setRelatedPlaces([]);
            } finally {
                setLoadingRelated(false);
            }
        };

        fetchRelatedPlaces();
    }, [place?.streetId, place?.id]);

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
        const fetchKolList = async () => {
            if (!placeId) return;
            try {
                setLoadingKol(true);
                const data = await apiKolByPlace(placeId as string, { current: 1, pageSize: 6 });
                setKolList(data.data || []);
            } catch (error) {
                console.error('Failed to fetch KOL list:', error);
                setKolList([]);
            } finally {
                setLoadingKol(false);
            }
        };

        fetchKolList();
    }, [placeId]);

    const breadcrumbs = place ? [
        { label: 'Place', href: '/place' },
        { label: place.provinceName, href: `/location/city/${place.provinceId}` },
        { label: place.districtName, href: `/district/${place.districtId}` },
        { label: place.streetName, href: `/district/street/${place.streetId}` },
        { label: place.name, href: '#' },
    ] : [{ label: 'Place', href: '/place' }];

    const renderBlock = (block: API.Block, index: number) => {
        switch (block.type) {
            case 'paragraph':
                return <p key={index} className="mb-4 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: block.data.text || '' }} />;
            case 'header':
                const HeaderTag = `h${block.data.level || 2}` as keyof JSX.IntrinsicElements;
                return <HeaderTag key={index} className={`font-bold mb-3 mt-6 ${block.data.level === 1 ? 'text-3xl' : block.data.level === 2 ? 'text-2xl' : 'text-xl'}`}>{block.data.text}</HeaderTag>;
            case 'image':
                return (
                    <figure key={index} className={`mb-6 ${block.data.align === 'center' ? 'text-center' : block.data.align === 'right' ? 'text-right' : ''}`}>
                        <img src={block.data.url} alt={block.data.caption || ''} className="max-w-full h-auto inline-block" />
                        {block.data.caption && <figcaption className="text-sm text-gray-600 mt-2">{block.data.caption}</figcaption>}
                    </figure>
                );
            case 'list':
                return (
                    <ul key={index} className="list-disc list-inside mb-4 ml-4">
                        {block.data.items?.map((item, i) => <li key={i} className="mb-1">{item}</li>)}
                    </ul>
                );
            case 'quote':
                return <blockquote key={index} className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">{block.data.text}</blockquote>;
            case 'code':
                return <pre key={index} className="bg-gray-100 p-4 rounded overflow-x-auto mb-4"><code>{block.data.code}</code></pre>;
            default:
                return null;
        }
    };

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    <p className="mt-4 text-gray-600">Loading place details...</p>
                </div>
            ) : place ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Thumbnail */}
                        {place.thumbnail && (
                            <div className="rounded-lg">
                                <img src={place.thumbnail} alt={place.name} className="w-full h-auto object-cover" />
                            </div>
                        )}

                        {/* Place Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h1 className="text-3xl font-bold mb-3">{place.name}</h1>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <span className="font-semibold w-24">Address:</span>
                                    <span>{place.streetName}, {place.districtName}, {place.provinceName}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24">Views:</span>
                                    <span>{place.viewCount?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24">Updated:</span>
                                    <span>{new Date(place.modifiedDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div>
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {placeImages.map((image) => (
                                        <div key={image.id} className="relative overflow-hidden rounded-lg bg-gray-100">
                                            <Image
                                                src={image.url}
                                                alt={place.name}
                                                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No gallery images yet.</p>
                            )}
                        </div>

                        {/* Content */}
                        <div className="prose max-w-none">
                            {place.content?.blocks?.map((block, index) => renderBlock(block, index))}
                        </div>
                    </div>

                    <aside className="space-y-8">
                        {/* Related Places on Same Street */}
                        {relatedPlaces.length > 0 && (
                            <div className="border rounded-lg p-4">
                                <h2 className="text-xl font-bold mb-4">More on {place.streetName}</h2>
                                {loadingRelated ? (
                                    <div className="text-center py-4">
                                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {relatedPlaces.map((relatedPlace) => (
                                            <Link key={relatedPlace.id} href={`/place/${relatedPlace.id}`}>
                                                <div className="group cursor-pointer flex gap-3">
                                                    <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-md bg-gray-200">
                                                        <img
                                                            src={relatedPlace.thumbnail}
                                                            alt={relatedPlace.name}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                                                            {relatedPlace.name}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 line-clamp-1">
                                                            {relatedPlace.districtName}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            👁️ {relatedPlace.viewCount?.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Random Places */}
                        <div className="border rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-4">More Places to Explore</h2>
                            {loadingRandom ? (
                                <div className="text-center py-4">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                                </div>
                            ) : randomPlaces.length > 0 ? (
                                <div className="space-y-4">
                                    {randomPlaces.map((randomPlace) => (
                                        <Link key={randomPlace.id} href={`/place/${randomPlace.id}`}>
                                            <div className="group cursor-pointer flex gap-3">
                                                <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-md bg-gray-200">
                                                    <img
                                                        src={randomPlace.thumbnail}
                                                        alt={randomPlace.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                                                        {randomPlace.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 line-clamp-1">
                                                        {randomPlace.districtName}, {randomPlace.provinceName}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        👁️ {randomPlace.viewCount?.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No other places found.</p>
                            )}
                        </div>
                    </aside>
                </div>

                {/* KOL Section */}
                {!loadingKol && kolList.length > 0 && (
                    <div className="mt-12">
                        <KolList 
                            kolList={kolList} 
                            placeId={place.id} 
                            placeName={place.name} 
                        />
                    </div>
                )}
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-600">Place not found.</p>
                </div>
            )}
        </PageContainer>
    )
}

export default Page;