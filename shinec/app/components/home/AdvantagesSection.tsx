import { advantages } from "@/app/data/site-content";
import { SectionHeading } from "@/app/components/site/SectionHeading";

export function AdvantagesSection() {
  return (
    <section id="loi-the" className="section-block" data-animate="reveal">
      <SectionHeading
        eyebrow="Lợi thế đầu tư"
        title="Gia tăng hiệu quả đầu tư bằng hệ sinh thái hỗ trợ toàn diện"
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {advantages.map((item, index) => (
          <article
            key={item}
            className="feature-card"
            style={{ animationDelay: `${index * 80}ms` }}
            data-animate="reveal"
          >
            <span className="feature-index">0{index + 1}</span>
            <p className="mt-4 text-base font-semibold text-[var(--primary-deep)]">{item}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
