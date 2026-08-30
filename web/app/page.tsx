import Link from "next/link";
import { DistrictSection } from "./home";
import { apiArticleList, apiArticleRandoms } from "@/services/article";
import { apiProducts } from "@/services/shop/product";
import { apiTagRandoms } from "@/services/contents/tag";
import { apiPlaceList } from "@/services/locations/place";
import { apiKolList } from "@/services/kol/kol";
import { apiGetSiteSetting } from "@/services/setting";
import { Metadata } from "next";
import { EyeFilled } from "@ant-design/icons";
import ShinecHome from "@/components/home/shinec";
import { getThemeKey, THEME_NAME } from "@/config/theme";
import { apiGetPublishedHomePage } from "@/services/website-page";
import WebsitePageRenderer from "@/components/website-builder/page-renderer";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await apiGetSiteSetting();
    return {
      title: settings?.title || "DefZone.Net",
      description: settings?.description || "DefZone.Net - Kênh thông tin giải trí và địa điểm ăn chơi",
    };
  } catch (error) {
    // Fallback to defaults if API call fails
    return {
      title: "DefZone.Net",
      description: "DefZone.Net - Kênh thông tin giải trí và địa điểm ăn chơi",
    };
  }
}

export default async function Home() {
  const settings = await apiGetSiteSetting();;
  const builderPage = await apiGetPublishedHomePage().catch(() => null);

  console.log("builderPage", builderPage);

  // if (builderPage?.isPublished && builderPage.content?.blocks?.some((block) => !block.hidden)) {
  //   return <WebsitePageRenderer document={builderPage.content} />;
  // }

  const articlesResponse = await apiArticleList({ current: 1, pageSize: 5 });
  const articles = articlesResponse.data || [];

  const productsResponse = await apiProducts({ current: 1, pageSize: 6 });
  const products = productsResponse.data || [];

  const tagsResponse = await apiTagRandoms();
  const tags = tagsResponse.data || [];

  const placesResponse = await apiPlaceList({ current: 1, pageSize: 6 });
  const locations = (placesResponse.data || []).slice(0, 5);

  const influencersResponse = await apiKolList({ current: 1, pageSize: 12 });
  const randomInfluencers = [...(influencersResponse.data || [])]
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  const categories = ["Huong dan", "Phan tich", "Danh gia", "Tin tuc", "Thu thuat"];

  const randomsRes = await apiArticleRandoms();
  const randomArticles = randomsRes.data || [];
  const randomLocations = locations.slice(0, 2).map(place => ({
    id: place.id,
    name: place.districtName,
    image: place.thumbnail,
    districtId: place.districtId,
  }));

  const cardStyle = (url: string) => ({
    backgroundImage: `url(${url})`,
  });

  if (getThemeKey(settings?.theme) === THEME_NAME.SHINEC) {
    return <ShinecHome articles={articles} />;
  }

  return (
    <main className="bg-slate-100">
      {
        builderPage?.isPublished && builderPage.content?.blocks?.some((block) => !block.hidden) ? (
          <WebsitePageRenderer document={builderPage.content} />
        ) : null
      }
    </main>
  );
}
