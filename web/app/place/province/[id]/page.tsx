/* eslint-disable @next/next/no-img-element */
import PageContainer from "@/components/layout/page-container";
import { apiPlaceList } from "@/services/locations/place";
import { Metadata } from "next";
import PlacesByProvinceClient from "./client";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    keyword?: string;
  }>;
};

const DEFAULT_PAGE_SIZE = 12;

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  // You might want to fetch province name from API if available
  // For now, using a simple title
  return {
    title: `Địa điểm tỉnh ${id} - DefZone.Net`,
    description: `Khám phá các địa điểm thú vị tại tỉnh ${id}`,
    openGraph: {
      title: `Địa điểm tỉnh ${id}`,
      description: `Khám phá các địa điểm thú vị tại tỉnh ${id}`,
    },
  };
}

export default async function PlacesByProvincePage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const provinceId = parseInt(id);
  const searchParamsResolved = await searchParams;
  
  const current = Math.max(1, Number(searchParamsResolved.page) || 1);
  const pageSize = Math.max(1, Number(searchParamsResolved.pageSize) || DEFAULT_PAGE_SIZE);
  const keyword = searchParamsResolved.keyword?.trim();

  // Fetch places by provinceId
  const placeResponse = await apiPlaceList({
    provinceId,
    current,
    pageSize,
    name: keyword,
  });

  const places = placeResponse.data || [];
  const total = placeResponse.total || places.length;

  // Get province name from first place if available
  const provinceName = places.length > 0 ? places[0].provinceName : `Tỉnh ${id}`;

  const breadcrumbs = [
    { label: "Địa điểm", href: "/place" },
    { label: provinceName, href: `/place/province/${id}` },
  ];

  return (
    <PageContainer breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <PlacesByProvinceClient
          provinceId={provinceId}
          provinceName={provinceName}
          places={places}
          total={total}
          current={current}
          pageSize={pageSize}
          keyword={keyword}
          defaultPageSize={DEFAULT_PAGE_SIZE}
        />
      </div>
    </PageContainer>
  );
}
