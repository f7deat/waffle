import Link from "next/link";
import Image from "next/image";
import { newsItems } from "@/app/data/site-content";
import { SectionHeading } from "@/app/components/site/SectionHeading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function NewsPreviewSection() {
  return (
    <section id="tin-tuc" className="section-block" data-animate="reveal">
      <SectionHeading eyebrow="Tin tức" title="Cập nhật xu hướng phát triển và hoạt động nổi bật" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {newsItems.map((item, index) => (
          <article
            key={item.slug}
            className="news-card"
            style={{ animationDelay: `${index * 90}ms` }}
            data-animate="reveal"
          >
            <div className="overflow-hidden rounded-xl border border-[var(--line)]">
              <Image
                src={item.image}
                alt={item.title}
                width={960}
                height={620}
                className="h-44 w-full object-cover"
              />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent)]">{item.category}</p>
            <h3 className="mt-3 text-lg font-extrabold text-[var(--primary-deep)]">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[var(--text-muted)]">{item.excerpt}</p>
            <Link
              href={`/tin-tuc/${item.slug}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--accent-deep)] hover:underline"
            >
              Xem chi tiết
              <FontAwesomeIcon icon={faArrowRight} className="h-3.5 w-3.5" />
            </Link>
          </article>
        ))}
      </div>
      <div className="mt-8">
        <Link
          href="/tin-tuc"
          className="inline-flex h-11 items-center justify-center rounded-full border border-[var(--line)] bg-white px-5 text-sm font-bold text-[var(--primary-deep)] hover:-translate-y-0.5 transition-transform"
        >
          Xem tất cả tin tức
        </Link>
      </div>
    </section>
  );
}
