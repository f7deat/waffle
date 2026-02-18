import { Metadata } from 'next';
import { apiCatalogMeta } from '@/services/catalog';
import PlaceDetail from './client';
import { apiPlaceDetail, apiPlaceList, apiPlaceRandom } from '@/services/locations/place';
import PageContainer from '@/components/layout/page-container';
import Link from 'next/link';
import { CalendarOutlined, EnvironmentOutlined, EyeOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

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
    const place = response.data || null;
    const relatedPlacesResponse = await apiPlaceList({
        districtId: place.districtId,
        current: 1,
        pageSize: 6
    });
    const relatedPlaces = relatedPlacesResponse?.data || [];
    const randomPlacesResponse = await apiPlaceRandom({ current: 1, pageSize: 6 });
    const randomPlaces = randomPlacesResponse?.data || [];

    const breadcrumbs = place ? [
        { label: 'Địa điểm', href: '/place' },
        { label: place.districtName, href: `/district/${place.districtId}` },
        { label: place.name, href: '#' },
    ] : [{ label: 'Địa điểm', href: '/place' }];

    return (
        <PageContainer breadcrumbs={breadcrumbs}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-4 rounded-lg flex gap-4">
                        {place.thumbnail && (
                            <div className="rounded-lg w-32 h-32 flex-shrink-0 overflow-hidden bg-gray-200">
                                <img src={place.thumbnail} alt={place.name} className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className='flex-1'>
                            <h1 className="text-3xl font-bold mb-3">{place.name}</h1>
                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <span className="font-semibold w-24"><EnvironmentOutlined /> Địa chỉ:</span>
                                    <span>{place.address},
                                        <Link href={`/district/${place.districtId}`} className="ml-1 text-blue-600 hover:underline">{place.districtName}</Link>
                                        ,
                                        <Link href={`/place/province/${place.provinceId}`} className="ml-1 text-blue-600 hover:underline">{place.provinceName}</Link>
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24"><EyeOutlined /> Lượt xem:</span>
                                    <span>{place.viewCount?.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-semibold w-24"><CalendarOutlined /> Cập nhật:</span>
                                    <span>{dayjs(place.modifiedDate).format('DD-MM-YYYY HH:mm')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-4 shadow-sm md:grid-cols-2">
                        <div className="flex flex-col gap-3 rounded-lg border border-indigo-100 bg-white/80 p-4 shadow-sm">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                                Booking & review
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Đặt lịch và gửi review</h2>
                            <p className="text-sm text-slate-600">
                                Đặt dịch vụ tại địa điểm này, gửi feedback kèm hình ảnh/video và nhận phản hồi trong 24h.
                            </p>
                            <div className="flex flex-col gap-2 text-sm text-slate-600">
                                <span>• Theo dõi tình trạng booking của bạn.</span>
                                <span>• Nhận hỗ trợ từ đội ngũ Waffle.</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <Link
                                    href="/influencer"
                                    className="inline-flex items-center hover:text-white gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
                                >
                                    Gửi review / đặt lịch
                                </Link>
                                <Link
                                    href="/user/login"
                                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50"
                                >
                                    Theo dõi yêu cầu
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-lg border border-emerald-100 bg-white/80 p-4 shadow-sm">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                                Đăng ký Influencer
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Trở thành KOL cho địa điểm</h2>
                            <p className="text-sm text-slate-600">
                                Nhận brief hợp tác, ưu đãi trải nghiệm và được ghim nổi bật trên danh sách KOL liên quan địa điểm này.
                            </p>
                            <div className="flex flex-col gap-2 text-sm text-slate-600">
                                <span>• Duyệt hồ sơ trong 48h.</span>
                                <span>• Quyền truy cập media kit và KPI rõ ràng.</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <Link
                                    href="/influencer/register"
                                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                                >
                                    Đăng ký ngay
                                </Link>
                                <Link
                                    href="/user/profile"
                                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-50"
                                >
                                    Xem hướng dẫn
                                </Link>
                            </div>
                        </div>
                    </div>
                    <PlaceDetail place={place} />
                </div>
                <aside className="space-y-8">
                    {relatedPlaces.length > 0 && (
                        <div className="bg-white rounded-lg p-4">
                            <h2 className="text-xl font-bold mb-4">Nhiều hơn {place.districtName}</h2>
                            <div className="space-y-4">
                                {relatedPlaces.map((relatedPlace) => (
                                    <Link key={relatedPlace.id} href={`/place/${relatedPlace.normalizedName}`}>
                                        <div className="group cursor-pointer flex gap-3 mb-4">
                                            <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-md bg-gray-200">
                                                <img
                                                    src={relatedPlace.thumbnail}
                                                    alt={relatedPlace.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                                                    {relatedPlace.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 line-clamp-1">
                                                    {relatedPlace.districtName} <EyeOutlined /> {relatedPlace.viewCount?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Random Places */}
                    <div className="bg-white rounded-lg p-4">
                        <h2 className="text-xl font-bold mb-4">More Places to Explore</h2>
                        <div className="space-y-4">
                            {randomPlaces.map((randomPlace) => (
                                <Link key={randomPlace.id} href={`/place/${randomPlace.normalizedName}`}>
                                    <div className="group cursor-pointer flex gap-3 mb-2">
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
                                            <p className="text-sm text-slate-500">
                                                <EnvironmentOutlined /> {randomPlace.districtName}, {randomPlace.provinceName} <EyeOutlined /> {randomPlace.viewCount?.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </PageContainer>
    );
};

export default Page;