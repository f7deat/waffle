import { CircleExclamationIcon } from "@/components/web/circle-exclamation";
import { ShopeeIcon } from "@/components/web/shopee/icon";
import Shortcut from "@/components/web/shortcut";
import { WikipediaIcon } from "@/components/web/wikipedia/icon";

export default function Home() {
  return (
    <main className="flex gap-4 p-4 flex-wrap">
      <Shortcut title="Wikipedia" href="/wiki" icon={<WikipediaIcon />} />
      <Shortcut title="Pokemon" href="/pokemon" icon={<CircleExclamationIcon />} />
      <Shortcut title="Shopee" href="/shopee" icon={<ShopeeIcon />} />
      <Shortcut title="Klook" href="/klook" icon={<CircleExclamationIcon />} />
    </main>
  );
}
