import { CircleExclamationIcon } from "@/components/web/circle-exclamation";
import { ShopeeIcon } from "@/components/web/shopee/icon";
import Shortcut from "@/components/web/shortcut";
import { WikipediaIcon } from "@/components/web/wikipedia/icon";
import { THEME } from "@/config/theme";
import { apiCatalogMeta } from "@/service/catalog";
import { ReadOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const meta = await apiCatalogMeta('vn-index');
  return {
    title: `${meta.data.name} - DefZone.Net`,
    description: meta.data.description,
  };
}

export default async function Home() {
  return (
    <main className="flex gap-4 p-4 flex-wrap">
      <Shortcut title="Wikipedia" href="/wiki" icon={<WikipediaIcon />} />
      <Shortcut title="Pokemon" href="/pokemon" icon={<CircleExclamationIcon />} />
      <Shortcut title="Shopee" href="/shopee" icon={<ShopeeIcon />} />
      <Shortcut title="Klook" href="/klook" icon={<CircleExclamationIcon />} />
      <Shortcut title="Location" href="/location" icon={<span>⚲</span>} />
      <Shortcut title="Article" href="/article" icon={<ReadOutlined />} />
      <Shortcut title="Shop" href="/shop" icon={<ShoppingCartOutlined />} />
    </main>
  );
}
