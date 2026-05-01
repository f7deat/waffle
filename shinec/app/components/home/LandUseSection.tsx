import { landUse } from "@/app/data/site-content";
import { SectionHeading } from "@/app/components/site/SectionHeading";

export function LandUseSection() {
  return (
    <section id="gioi-thieu" className="section-block" data-animate="reveal">
      <SectionHeading
        eyebrow="Giới thiệu tổng quan"
        title="Quỹ đất được quy hoạch bài bản, ưu tiên phát triển bền vững"
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {landUse.map((item, index) => (
          <article
            key={item.label}
            className="data-card"
            style={{ animationDelay: `${index * 80}ms` }}
            data-animate="reveal"
          >
            <p className="text-sm font-semibold text-[var(--primary)]">{item.label}</p>
            <p className="mt-3 text-2xl font-black text-[var(--primary-deep)]">{item.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
