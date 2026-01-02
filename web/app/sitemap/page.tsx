import Link from "next/link";

export default function SitemapPage() {
  const sections: { title: string; items: { label: string; href?: string; pattern?: string }[] }[] = [
    {
      title: "Trang chính",
      items: [
        { label: "Trang chủ", href: "/" },
        { label: "Bài viết", href: "/article" },
        { label: "Địa điểm", href: "/location" },
        { label: "Địa danh", href: "/place" },
        { label: "Cửa hàng", href: "/shop" },
        { label: "Wikipedia", href: "/wiki" },
      ],
    },
    {
      title: "Khu vực/Quận",
      items: [
        { label: "Danh sách quận", href: "/district" },
        { label: "Chi tiết quận (dynamic)", pattern: "/district/[id]" },
      ],
    },
    {
      title: "Địa điểm/Thành phố",
      items: [
        { label: "Danh sách thành phố", href: "/location" },
        { label: "Chi tiết thành phố (dynamic)", pattern: "/location/city/[slug]" },
      ],
    },
    {
      title: "Nội dung động",
      items: [
        { label: "Bài viết chi tiết (dynamic)", pattern: "/article/[id]" },
        { label: "Sản phẩm (dynamic)", pattern: "/shop/[id]" },
        { label: "Địa danh (dynamic)", pattern: "/place/[id]" },
        { label: "Bài wiki (dynamic)", pattern: "/wiki/[slug]" },
      ],
    },
    {
      title: "Ứng dụng",
      items: [
        { label: "Klook", href: "/klook" },
        { label: "Pokemon", href: "/pokemon" },
        { label: "Shopee", href: "/shopee" },
      ],
    },
    {
      title: "Người dùng",
      items: [
        { label: "Đăng nhập", href: "/user/login" },
        { label: "Hồ sơ", href: "/user/profile" },
      ],
    },
    {
      title: "Pháp lý",
      items: [
        { label: "Liên hệ", href: "/contact" },
        { label: "Bảo mật", href: "/privacy" },
        { label: "Điều khoản", href: "/terms" },
        { label: "Sitemap", href: "/sitemap" },
      ],
    },
  ];

  return (
    <main className="bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto container px-4 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <Link href="/" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Home</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600 dark:text-slate-400">Sitemap</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Sơ đồ trang</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Danh sách các trang và mẫu đường dẫn (dynamic) trong hệ thống.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {sections.map((section) => (
            <section key={section.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{section.title}</h2>
              <ul className="mt-3 space-y-2">
                {section.items.map((item) => (
                  <li key={item.label} className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                    {item.href ? (
                      <Link href={item.href} className="rounded-md px-2 py-1 text-sm font-semibold text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-slate-800/60">
                        {item.href}
                      </Link>
                    ) : (
                      <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">{item.pattern}</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
